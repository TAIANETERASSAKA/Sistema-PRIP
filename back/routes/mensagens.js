const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagensController');
const { validarSessao, validarDonoEmprestimo } = require('../validators/acessoValidator');

// Só o aluno dono do empréstimo e os admins acessam as mensagens
router.use(validarSessao);

// GET /mensagens
router.get('/:id', validarDonoEmprestimo(req => req.params.id), mensagemController.listarMensagens);

// POST /mensagens
router.post('/', validarDonoEmprestimo(req => req.body.id_emprestimo), mensagemController.criarMensagem);

module.exports = router;