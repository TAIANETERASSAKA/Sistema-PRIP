const transporter = require('../controllers/mailer');

async function enviarEmail(emprestimo) {

    const mensagem = {
        1: `Sua solicitação de empréstimo foi enviada com sucesso! Fique atento no email para futuras atualizações!`,
        2: `Sua solicitação de emprestimo foi aprovada, se dirija até o CTI pata assinar o termo e retirar o notebook!`,
        3: `O notebook foi retirado com sucesso! Fique atento no dia da devolução!`,
        4: `O notebook foi devolvido com sucesso!`,
        5: `O notebook com devolução atrasada!`,
        6: `Sua solicitação de emprestimo foi reprovada,!`
    };
    const textoMensagem = mensagem[emprestimo.status] || "Houve uma atualização em seu empréstimo.";

    const info = await transporter.sendMail({
        from: `"Sistema de Empréstimos" <${process.env.EMAIL_USER}>`, // sender address
        to: emprestimo.usuario.email, // list of recipients
        subject: `"Atualização sobre solicitação de empréstimo - ${emprestimo.id_emprestimo} "`, // subject line
        text: `"Olá, ${emprestimo.id_emprestimo}!
        Sua solicitação de empréstimo foi  "`, // plain text body
        html: `
        <h2>Olá, ${emprestimo.usuario.nome}!</h2>
        <p>${textoMensagem}</p>
        <br/>
        <p>Atenciosamente,<br/>Sistema de Empréstimos da Faculdade</p>`
    });
}

module.exports = { enviarEmail };