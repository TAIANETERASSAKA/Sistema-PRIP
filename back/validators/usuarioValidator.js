const { body, validationResult } = require('express-validator');

const regras = {
    nome: body('nome')
    .isString().withMessage('Deve ser uma string')
    .notEmpty().withMessage('O nome é obrigatório'),

    numero_usp: body('numero_usp')
    .notEmpty().withMessage('O número usp é obrigatório'),

    email: body('email')
    .notEmpty().withMessage('O email é obrigatório')
    .isEmail().withMessage('Insira um email válido'),

    senha: body('senha')
    .notEmpty().withMessage('A senha é obrigatória'),

    isAdmin: body('isAdmin')
    .notEmpty().withMessage('O tipo de usuário é obrigatório'),
};

const validar = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      error: "campos_invalidos",
      message: erros.array().map(e => e.msg)
    });
  }
  next();
};

const validarCriar = [regras.nome, regras.numero_usp, regras.email, regras.isAdmin, validar];
const validarLogin = [regras.numero_usp, regras.senha, validar];

module.exports = { validarCriar, validarLogin };