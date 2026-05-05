const express = require('express');
const router = express.Router();
const manutencoesController = require('../controllers/manutencoesController');

// GET /manutencoes
router.get('/:id_notebook', manutencoesController.listarManutencao);

// POST /manutencoes
router.post('/:id_notebook', manutencoesController.criarManutencao);

// PUT /manutencoes/:id
router.put('/:id', manutencoesController.editarManutencao)

module.exports = router;