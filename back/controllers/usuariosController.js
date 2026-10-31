const { Usuario } = require('../models');

// Listar todos os usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarioList = await Usuario.findAll();
        res.json({success: true, usuarios: usuarioList});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Criar usuario (pré-cadastro; nome e e-mail são atualizados pela Senha Única USP no login)
exports.criarUsuario = async (req, res) => {
    try {
        const novo_usuario = await Usuario.create({
            nome: req.body.nome,
            numero_usp: req.body.numero_usp,
            email: req.body.email,
            isAdmin: req.body.isAdmin
        });

        res.json({success: true});
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            if (error.fields.hasOwnProperty('numero_usp')) {
                return res.status(409).json({
                    error: "numero_usp_duplicado",
                    message: "Este número USP já está cadastrado no sistema."
                });
            }
            
            if (error.fields.hasOwnProperty('email')) {
                return res.status(409).json({
                    error: "email_duplicado",
                    message: "Este e-mail já está cadastrado no sistema."
                });
            }
        }

        res.status(400).json({ error: error.message });
    }
};

// Editar usuario
exports.editarUsuario = async (req, res) => {
    try {
        const [linhasAfetadas, usuariosAtualizados] = await Usuario.update(
            {
                nome: req.body.nome,
                numero_usp: req.body.numero_usp,
                email: req.body.email,
                isAdmin: req.body.isAdmin
            },
            {
                where: { id_usuario: req.params.id },
                returning: true 
            }
        );

        if (linhasAfetadas === 0) {
            return res.status(404).json({ message: 'Usuario não encontrado' });
        }

        res.json({success: true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deletar usuario
exports.deletarUsuario = async (req, res) => {
    try {
        const linhasDeletadas = await Usuario.destroy({
            where: { id_usuario: req.params.id }
        });

        if (linhasDeletadas === 0) {
            return res.status(404).json({ message: 'Usuario não encontrado para deleção' });
        }

        res.json({success: true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
