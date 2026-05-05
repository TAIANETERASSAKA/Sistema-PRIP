const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimosController');
const { validarCriar } = require('../validators/emprestimoValidator');


// GET /emprestimos
router.get('/', emprestimoController.listarEmprestimos);

// GET /solicitacoes
router.get('/solicitacoes', emprestimoController.buscarSolicitacoes);

// GET /emprestimosAtuais
router.get('/atual/:id', emprestimoController.buscarEmprestimoAtual);

// GET /emprestimos/finalizados
router.get('/aluno', emprestimoController.buscarEmprestimoAluno)

// GET /emprestimos/todos
router.get('/todos/:id', emprestimoController.buscarTodosEmprestimoAluno)

// POST /emprestimos
router.post('/', validarCriar, emprestimoController.criarEmprestimo);

// PUT /emprestimos/:id
router.put('/:id', emprestimoController.editarEmprestimo);

// DELETE /emprestimos/:id
router.delete('/:id', emprestimoController.deletarEmprestimo);

module.exports = router;