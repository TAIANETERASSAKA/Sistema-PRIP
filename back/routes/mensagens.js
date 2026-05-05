const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagensController');

// GET /mensagens
router.get('/:id', mensagemController.listarMensagens);

// POST /mensagens
router.post('/', mensagemController.criarMensagem);

module.exports = router;