const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Listar todos os usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarioList = await Usuario.findAll();
        res.json({success: true, usuarios: usuarioList});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Criar usuario
exports.criarUsuario = async (req, res) => {
    try {
        //se a senha for fornecida, use-a; caso contrário, gere uma senha aleatória de 8 caracteres
        const senha = req.body.senha || Math.random().toString(36).slice(-8);
        //hash da senha usando bcrypt
        const hash = await bcrypt.hash(senha, SALT_ROUNDS);

        const novo_usuario = await Usuario.create({
            nome: req.body.nome,
            numero_usp: req.body.numero_usp,
            email: req.body.email,
            senha: hash,
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
                senha: req.body.senha,
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

exports.recuperarSenha = async (req, res) => {
    const transporter = require('../controllers/mailer');

    try {
        const usuario = await Usuario.findOne({ where: { email: req.body.email }});

        if (!usuario) {
            return res.status(404).json({ 
                error: "email_nao_encontrado",
                message: "Não encontramos um usuário com este e-mail." 
            });
        }

        const novaSenhaProvisoria = Math.random().toString(36).slice(-8);
        const hash = await bcrypt.hash(novaSenhaProvisoria, SALT_ROUNDS);

        await Usuario.update(
            { senha: hash },
            { where: { id_usuario: usuario.id_usuario } }
        );

        await transporter.sendMail({
            from: `"Sistema de Empréstimos" <${process.env.EMAIL_USER}>`,
            to: usuario.email,
            subject: "Recuperação de Senha",
            text: `Olá ${usuario.nome}, sua nova senha provisória é: ${novaSenhaProvisoria}\n\nRecomendamos que você acesse o sistema e altere essa senha o mais rápido possível.`
        });

        res.status(200).json({ 
            success: true        
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};