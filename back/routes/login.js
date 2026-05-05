const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { validarLogin } = require('../validators/usuarioValidator');

router.post('/', validarLogin, loginController.loginValidarUsuario);
router.post('/logout', loginController.logout);


module.exports = router;