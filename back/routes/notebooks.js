const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebooksController');
const { validarCriar, validarEditar } = require('../validators/notebookValidator');

// GET /notebooks
router.get('/', notebookController.listarNotebooks);

// POST /notebooks
router.post('/', validarCriar,  notebookController.criarNotebook);

// PUT /notebooks/:id
router.put('/:id', validarEditar, notebookController.editarNotebook);


// DELETE /notebooks/:id
router.delete('/:id', notebookController.deletarNotebook);

module.exports = router;