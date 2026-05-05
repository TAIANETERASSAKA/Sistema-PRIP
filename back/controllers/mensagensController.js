const { Mensagem, Usuario } = require('../models');

// Listar todos os mensagens
exports.listarMensagens = async (req, res) => {
    try {
        const mensagens = await Mensagem.findAll(
            {
                where: { id_emprestimo: req.params.id },
                order: [['enviado_em', 'ASC']],
                include: [
                    { model: Usuario, as: 'usuario' }
                ]
            },
        );
        res.json(mensagens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Criar mensagem
exports.criarMensagem = async (req, res) => {
    if(!req.body.id_emprestimo || !req.body.id_emprestimo) {
        return res.status(400).json({
            error: "campos_obrigatorios",
            message: "Por favor, preencha todos os campos obrigatórios."
        });    
    }

    try {
        const novo_mensagem = await Mensagem.create({
            id_emprestimo: req.body.id_emprestimo,
            id_usuario: req.session.usuario.id_usuario,
            isAdm: req.session.usuario.isAdmin,
            conteudo: req.body.conteudo,
            enviado_em: new Date()
        });

        res.status(201).json(novo_mensagem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



