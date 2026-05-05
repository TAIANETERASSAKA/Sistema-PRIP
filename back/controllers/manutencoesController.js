const {  Emprestimo, Manutencao } = require('../models');

exports.criarManutencao = async (req, res) => {
  try {
    const manutencao = await Manutencao.create({
      motivo: req.body.motivo,
      id_emprestimo: req.body.id_emprestimo,
      data_entrada: req.body.data_entrada,
      id_notebook: req.params.id_notebook
    });
        
    res.status(201).json({success: true, manutencao: manutencao});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listarManutencao = async (req, res) => {
    try {
      const manutencoes = await Manutencao.findAll({
        where: { id_notebook: req.params.id_notebook }
      });
  
      res.status(201).json({success: true, manutencoes: manutencoes});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

exports.editarManutencao = async (req, res) => {
  try {

    const [linhasAfetadas, manutencoesAtualizados] = await Emprestimo.update(
      {
        data_finalizada: req.body.data_finalizada ,
      },
      {
        where: { id_manutencao: req.params.id }
      },

    );

    if (linhasAfetadas === 0) {
      return res.status(404).json({ message: 'Manutenção não encontrada' });
    }

    res.status(201).json({success: true, manutencoesAtualizados: manutencoesAtualizados});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
