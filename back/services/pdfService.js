const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'termos');

// Garante que a pasta existe
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/**
 * Gera o PDF do termo e salva em disco.
 * @returns {string} caminho relativo salvo no banco (ex: uploads/termos/termo_xyz.pdf)
 */
async function gerarTermoPDF({ nome, numero_usp, modelo, data_retirada, data_devolucao_prevista, assinaturaBase64 }) {
  return new Promise((resolve, reject) => {
    const nomeArquivo = `termo_${uuidv4()}.pdf`;
    const caminhoAbsoluto = path.join(UPLOAD_DIR, nomeArquivo);
    const caminhoRelativo = path.join('uploads', 'termos', nomeArquivo);

    const doc = new PDFDocument({ margin: 60, size: 'A4' });
    const stream = fs.createWriteStream(caminhoAbsoluto);

    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(18).font('Helvetica-Bold').text('Termo de Compromisso de Empréstimo', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#666')
      .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });

    doc.moveDown(1.5);
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(1);

    // Corpo do termo
    doc.fontSize(12).font('Helvetica').fillColor('#000');
    doc.text(
      `Eu, ${nome}, matrícula ${numero_usp}, declaro que no dia ${data_retirada} recebi o notebook modelo ` +
      `${modelo} em perfeitas condições de uso.`,
      { align: 'justify', lineGap: 4 }
    );
    doc.moveDown();
    doc.text(
      'Comprometo-me a zelar pelo equipamento, utilizando-o de forma adequada e exclusivamente para ' +
      'fins acadêmicos. Fico ciente de que sou responsável por quaisquer danos, perda ou roubo do ' +
      'equipamento durante o período de empréstimo.',
      { align: 'justify', lineGap: 4 }
    );
    doc.moveDown();
    doc.text(
      `A devolução deverá ser feita até ${data_devolucao_prevista}, respeitando o prazo máximo de ` +
      '1 (um) semestre letivo. O não cumprimento do prazo implicará em sanções previstas no ' +
      'regulamento da instituição.',
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(1.5);
    doc.fontSize(10).fillColor('#444');
    doc.text(`Data de retirada: ${data_retirada}`);
    doc.text(`Data prevista de devolução: ${data_devolucao_prevista}`);

    // Assinatura
    doc.moveDown(2);
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000').text('Assinatura do Aluno:');
    doc.moveDown(0.5);

    // Converte base64 para Buffer e embute a imagem no PDF
    const imgData = assinaturaBase64.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(imgData, 'base64');
    doc.image(imgBuffer, { fit: [400, 120], align: 'left' });

    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#666')
      .text(`${nome} — ${numero_usp}`);

    doc.end();

    stream.on('finish', () => resolve(caminhoRelativo));
    stream.on('error', reject);
  });
}

module.exports = { gerarTermoPDF };