const { sequelize, Emprestimo, Usuario } = require('../models');
const { enviarEmail } = require('./emailService');

const UMA_HORA = 60 * 60 * 1000;

// Marca como atrasados (status 5) os empréstimos retirados cujo prazo já passou.
// O trigger do banco só age quando o registro é editado; esta rotina cobre os que ninguém mexeu.
async function verificarAtrasos() {
    try {
        const [linhas] = await sequelize.query(`
            UPDATE "Emprestimos"
               SET status = 5, "updatedAt" = NOW()
             WHERE status = 3
               AND data_devolucao_real IS NULL
               AND CURRENT_DATE > data_devolucao_prevista::date
         RETURNING id_emprestimo
        `);

        if (linhas.length === 0) return;

        // Avisa cada aluno por e-mail sobre o atraso
        const atrasados = await Emprestimo.findAll({
            where: { id_emprestimo: linhas.map(l => l.id_emprestimo) },
            include: [{ model: Usuario, as: 'usuario' }]
        });
        atrasados.forEach(enviarEmail);

        console.log(`${atrasados.length} empréstimo(s) marcado(s) como atrasado(s).`);
    } catch (error) {
        console.error('Erro ao verificar empréstimos atrasados:', error.message);
    }
}

// Roda ao iniciar o servidor e depois a cada hora
function iniciarVerificacaoAtrasos() {
    verificarAtrasos();
    setInterval(verificarAtrasos, UMA_HORA);
}

module.exports = { verificarAtrasos, iniciarVerificacaoAtrasos };
