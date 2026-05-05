const express = require('express');
const router = express.Router();
const { criarTermo, downloadPDF } = require('../controllers/termoController');

router.post('/', criarTermo);
router.get('/:id/pdf', downloadPDF);

module.exports = router;