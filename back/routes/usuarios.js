const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');
const { validarCriar } = require('../validators/usuarioValidator');

// GET /usuarios
router.get('/', usuarioController.listarUsuarios);

// POST /usuarios
router.post('/', validarCriar, usuarioController.criarUsuario);

// PUT /usuarios/:id
router.put('/:id', usuarioController.editarUsuario);

// DELETE /usuarios/:id
router.delete('/:id', usuarioController.deletarUsuario);

// post /usuarios
router.post('/recuperar', usuarioController.recuperarSenha);

module.exports = router;