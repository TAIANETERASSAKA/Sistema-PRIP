const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimosController');
const { validarCriar } = require('../validators/emprestimoValidator');
const { validarSessao, validarAdmin, validarProprioUsuario } = require('../validators/acessoValidator');

// Todas as rotas exigem login; as de gestão são exclusivas da CIP
router.use(validarSessao);


// GET /emprestimos
router.get('/', validarAdmin, emprestimoController.listarEmprestimos);

// GET /solicitacoes
router.get('/solicitacoes', emprestimoController.buscarSolicitacoes);

// GET /emprestimosAtuais
router.get('/atual/:id', validarAdmin, emprestimoController.buscarEmprestimoAtual);

// GET /emprestimos/finalizados
router.get('/aluno', emprestimoController.buscarEmprestimoAluno)

// GET /emprestimos/todos
router.get('/todos/:id', validarProprioUsuario, emprestimoController.buscarTodosEmprestimoAluno)

// POST /emprestimos
router.post('/', validarCriar, emprestimoController.criarEmprestimo);

// PUT /emprestimos/:id
router.put('/:id', validarAdmin, emprestimoController.editarEmprestimo);

// DELETE /emprestimos/:id
router.delete('/:id', validarAdmin, emprestimoController.deletarEmprestimo);

module.exports = router;