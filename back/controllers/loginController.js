const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// Funcao para fazer login do usuario
exports.loginValidarUsuario = async (req, res) => {
    try {
        //Validar se o n usp já esta cadastrado
        const usuario = await Usuario.findOne({
            where: { numero_usp: req.body.numero_usp }
        });

        // Verificar se a senha corresponde
        if (!usuario || !(await bcrypt.compare(req.body.senha, usuario.senha))) {
            return res.status(401).json({
                error: "autenticacao_falhou",
                message: "Número USP ou senha incorretos."
            });
        }

        const dadosUsuario = {
            id_usuario: usuario.id_usuario,
            numero_usp: usuario.numero_usp,
            nome: usuario.nome, 
            isAdmin: usuario.isAdmin,
            email: usuario.email 
        };

        // Salvar dados do usuario na sessao
        req.session.usuario = dadosUsuario;

        return res.status(200).json({
            success: true,
            isAdmin: usuario.isAdmin, 
            usuario: dadosUsuario,
            message: "Login realizado com sucesso!"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Função para fazer logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao fazer logout" });
        }
        res.json({ success: true, message: "Logout realizado com sucesso" });
    });
};