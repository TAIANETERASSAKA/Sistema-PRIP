const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');
const { validarCriar } = require('../validators/usuarioValidator');
const { validarAdmin } = require('../validators/acessoValidator');

// Apenas administradores (CIP) podem gerenciar usuários
router.use(validarAdmin);

// GET /usuarios
router.get('/', usuarioController.listarUsuarios);

// POST /usuarios
router.post('/', validarCriar, usuarioController.criarUsuario);

// PUT /usuarios/:id
router.put('/:id', usuarioController.editarUsuario);

// DELETE /usuarios/:id
router.delete('/:id', usuarioController.deletarUsuario);

module.exports = router;