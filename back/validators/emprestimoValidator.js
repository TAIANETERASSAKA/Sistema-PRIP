const { body, validationResult } = require('express-validator')

const regras = {
    justificativa: body('justificativa')
    .notEmpty().withMessage('A justificativa é obrigatória')
    .isLength({ min: 10 }).withMessage('A justificativa deve ter, no mínimo, 10 caracteres.')
    .isString().withMessage('Deve ser uma string'),

    status: body('status')
    .optional()
    .isInt().withMessage('Deve ser um número inteiro')
    .isIn([1, 2, 3, 4, 5, 6]).withMessage('Status inválido'),
}

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

const validarCriar = [regras.justificativa, validar];

module.exports = { validarCriar };
