const transporter = require('../controllers/mailer');

// Evita que dados do usuário sejam interpretados como HTML no e-mail
const escaparHtml = (texto = '') => String(texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MENSAGENS = {
    1: 'Sua solicitação de empréstimo foi enviada com sucesso! Fique atento ao seu e-mail para futuras atualizações.',
    2: 'Sua solicitação de empréstimo foi aprovada! Dirija-se ao CTI para assinar o termo e retirar o notebook.',
    3: 'O notebook foi retirado com sucesso! Fique atento à data de devolução.',
    4: 'O notebook foi devolvido com sucesso!',
    5: 'A devolução do notebook está atrasada. Por favor, devolva o equipamento o quanto antes.',
    6: 'Sua solicitação de empréstimo foi recusada.'
};

// Envia o e-mail de atualização do empréstimo.
// Nunca lança erro: uma falha no e-mail não pode derrubar o servidor nem a operação principal.
async function enviarEmail(emprestimo) {
    try {
        if (!emprestimo?.usuario?.email) return;

        const textoMensagem = MENSAGENS[emprestimo.status] || 'Houve uma atualização em seu empréstimo.';

        await transporter.sendMail({
            from: `"Sistema de Empréstimos" <${process.env.EMAIL_USER}>`,
            to: emprestimo.usuario.email,
            subject: `Atualização sobre a solicitação de empréstimo nº ${emprestimo.id_emprestimo}`,
            text: `Olá, ${emprestimo.usuario.nome}!\n\n${textoMensagem}\n\nAtenciosamente,\nSistema de Empréstimos da Faculdade`,
            html: `
            <h2>Olá, ${escaparHtml(emprestimo.usuario.nome)}!</h2>
            <p>${textoMensagem}</p>
            <br/>
            <p>Atenciosamente,<br/>Sistema de Empréstimos da Faculdade</p>`
        });
    } catch (error) {
        console.error(`Erro ao enviar e-mail do empréstimo ${emprestimo?.id_emprestimo}:`, error.message);
    }
}

module.exports = { enviarEmail };
