const express = require('express');
const router = express.Router();
const { criarTermo, downloadPDF } = require('../controllers/termoController');
const { validarAdmin } = require('../validators/acessoValidator');

// Apenas administradores (CIP)
router.use(validarAdmin);

router.post('/', criarTermo);
router.get('/:id/pdf', downloadPDF);

module.exports = router;