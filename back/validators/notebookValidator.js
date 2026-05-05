const { body, validationResult } = require('express-validator');

const regras = {
  numero_patrimonio: body('numero_patrimonio')
    .notEmpty().withMessage('Número de patrimônio é obrigatório')
    .isString().withMessage('Deve ser uma string'),

  marca: body('marca')
    .notEmpty().withMessage('Marca é obrigatória'),

  modelo: body('modelo')
    .notEmpty().withMessage('Modelo é obrigatório'),

  status: body('status')
    .optional()
    .isIn([1, 2, 3])
    .withMessage('Status inválido'),
};

const validar = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      error: "campos_invalidos",
      mensagens: erros.array().map(e => e.msg)
    });
  }
  next();
};

const validarCriar = [regras.numero_patrimonio, regras.marca, regras.modelo, regras.status, validar];
const validarEditar = [regras.status, validar]; // só valida o que faz sentido no PUT

module.exports = { validarCriar, validarEditar };