const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/senhaunica', authController.iniciarLogin);
router.get('/senhaunica/callback', authController.callback);

// Login simulado (somente com SENHAUNICA_FAKE=true fora de produção)
router.get('/fake', authController.formularioFake);
router.post('/fake', express.urlencoded({ extended: false }), authController.loginFake);

router.get('/me', authController.usuarioLogado);
router.post('/logout', authController.logout);

module.exports = router;
