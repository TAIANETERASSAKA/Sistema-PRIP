const { Notebook, Usuario, Emprestimo, Termo_compromisso } = require('../models');
const { gerarTermoPDF } = require('../services/pdfService');

async function criarTermo(req, res) {
  try {
    const id_emprestimo = req.body.id_emprestimo;
    const assinatura_base64 = req.body.assinatura_base64;

    if (!id_emprestimo || !assinatura_base64) {
      return res.status(400).json({ error: 'Dados incompletos.' });
    }

    // Busca dados para popular o PDF
    const emprestimo = await Emprestimo.findOne({
      where: {
        id_emprestimo: id_emprestimo
      },
      include: [
        { model: Usuario, as: 'usuario' }, 
        { model: Notebook, as: 'notebook' }
      ]
    });
    
    if (!emprestimo) return res.status(404).json({ error: 'Empréstimo não encontrado.' });

    const caminho_pdf = await gerarTermoPDF({
      nome: emprestimo.usuario.nome,
      numero_usp: emprestimo.usuario.numero_usp,
      modelo: emprestimo.notebook.modelo,
      data_retirada: new Date(emprestimo.data_retirada).toLocaleDateString('pt-BR'),
      data_devolucao_prevista: new Date(emprestimo.data_devolucao_prevista).toLocaleDateString('pt-BR'),
      assinaturaBase64: assinatura_base64
    });

    const termo = await Termo_compromisso.create({
      id_emprestimo,
      assinatura_base64,
      caminho_pdf,
    });
    
    return res.status(201).json({ id_termo: termo.id_termo, caminho_pdf });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao gerar termo.' });
  }
}

// GET /api/termos/:id/pdf  — download do PDF
async function downloadPDF(req, res) {
  try {
    const termo = await TermoCompromisso.findByPk(req.params.id);
    if (!termo) return res.status(404).json({ error: 'Termo não encontrado.' });

    const path = require('path');
    const fs = require('fs');
    const fullPath = path.join(__dirname, '..', termo.caminho_pdf);

    if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'PDF não encontrado.' });

    res.download(fullPath, `termo_${req.params.id}.pdf`);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao baixar PDF.' });
  }
}

module.exports = { criarTermo, downloadPDF };