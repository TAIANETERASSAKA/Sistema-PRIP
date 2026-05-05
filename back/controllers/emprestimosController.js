const { Emprestimo, Usuario, Notebook } = require('../models');
const { Op } = require('sequelize'); // Importante para usar operadores como o IN
const { enviarEmail } = require('../services/emailService');

exports.criarEmprestimo = async (req, res) => {
  try {
    // Verificar se o usuário está na sessão
    if (!req.session.usuario || !req.session  || !req.session.usuario.id_usuario) {
      return res.status(401).json({ 
        error: "nao_autenticado",
        message: "Usuário não está logado. Faça login primeiro.",
        sessionExists: !!req.session,
        sessionID: req.sessionID
      });
    }
    
    // Pegando o id_usuario da sessao
    const id_usuario = req.session.usuario.id_usuario;
    const emprestimo = await Emprestimo.create({
      id_usuario: id_usuario,
      justificativa: req.body.justificativa,
      status: 1,
      data_solicitacao: new Date()
    });

    const emprestimoCriado = await Emprestimo.findByPk(emprestimo.id_emprestimo, {
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });

    enviarEmail(emprestimoCriado);
        
    res.status(201).json({success: true, emprestimo: emprestimo});
  } catch (error) {
    console.error('Erro no criarEmprestimo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listarEmprestimos = async (req, res) => {
  try {
    const emprestimos = await Emprestimo.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Notebook, as: 'notebook' }
      ]
    });

    res.status(201).json({success: true, emprestimos: emprestimos});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.editarEmprestimo = async (req, res) => {
  try {

    if(req.body.status === 3 && !req.body.data_devolucao_prevista){
      return res.status(500).json({      
        error: "campos_ausentes",
        message: "Para confirmar a retirada de um notebook, é necessário definir a data de devolução prevista."
      })
    }

    if(new Date(req.body.data_devolucao_prevista) <= new Date()){
      return res.status(500).json({      
        error: "campos_ausentes",
        message: "A data de devolução prevista deve ser uma data futura."
      })
    }

    const [linhasAfetadas, emprestimosAtualizados] = await Emprestimo.update(
      {
        data_retirada: req.body.data_retirada ,
        data_recusa: req.body.data_recusa ,
        data_devolucao_prevista: req.body.data_devolucao_prevista,
        data_devolucao_real : req.body.data_devolucao_real,
        status: req.body.status,
        id_notebook: req.body.id_notebook,
        observacao: req.body.observacao
      },
      {
        where: { id_emprestimo: req.params.id }
      },

    );

    if (linhasAfetadas === 0) {
      return res.status(404).json({ message: 'Empréstimo não encontrado' });
    }

    res.status(201).json({success: true, emprestimosAtualizados: emprestimosAtualizados});

    const dadosParaEmail = await Emprestimo.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });

    enviarEmail(dadosParaEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletarEmprestimo = async (req, res) => {
  try {
    const linhasDeletadas = await Emprestimo.destroy({
      where: { id_emprestimo: req.params.id }
    });

    if (linhasDeletadas === 0) {
      return res.status(404).json({ message: 'Empréstimo não encontrado para deleção' });
    }

    res.status(200).json({ message: 'Empréstimo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.buscarEmprestimoAtual = async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findOne({
      where: {
        id_notebook: req.params.id,
        status: {
          [Op.in]: [2, 3, 5] 
        }
      },
      include: [
        { model: Usuario, as: 'usuario' }, // O 'as' depende de como você configurou a associação no model
        { model: Notebook, as: 'notebook' }
      ]
    });

    if (!emprestimo) {
        return res.status(404).json({ message: 'Nenhum empréstimo ativo encontrado' });
    }

    res.json(emprestimo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.buscarSolicitacoes = async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ 
        error: "sessao_inexistente",
        message: "Sessão não encontrada. Verifique se o servidor está configurado corretamente."
      });
    }
    
    // Verificar se tem id_usuario
    if (!req.session.usuario.id_usuario || !req.session.usuario) {
      return res.status(401).json({ 
        error: "sessao_invalida",
        message: "Sessão não contém id_usuario. Faça login novamente."
      });
    }

    const id_usuario = req.session.usuario.id_usuario;
    const emprestimo = await Emprestimo.findAll({
      where: {
        id_usuario: id_usuario,
        status: {
          [Op.in]: [1, 2, 3, 6] 
        }      },
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });

    if (!emprestimo) {
        return res.status(404).json({ message: 'Nenhuma solicitação encontrada' });
    }

    res.json(emprestimo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
    

exports.buscarEmprestimoAluno= async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ 
        error: "sessao_inexistente",
        message: "Sessão não encontrada. Verifique se o servidor está configurado corretamente."
      });
    }
    
    // Verificar se o usuário está na sessão
    if (!req.session.usuario) {
      return res.status(401).json({ 
        error: "nao_autenticado",
        message: "Usuário não está logado. Faça login primeiro.",
        sessionExists: !!req.session,
        sessionID: req.sessionID
      });
    }
    
    // Verificar se tem id_usuario
    if (!req.session.usuario.id_usuario) {
      return res.status(401).json({ 
        error: "sessao_invalida",
        message: "Sessão não contém id_usuario. Faça login novamente."
      });
    }

    const id_usuario = req.session.usuario.id_usuario;
    const emprestimo = await Emprestimo.findAll({
      where: {
        id_usuario: id_usuario,
        status: {
          [Op.in]: [4, 5, 6] 
        }      },
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Notebook, as: 'notebook' }
      ]
    });

    if (!emprestimo) {
        return res.status(404).json({ message: 'Nenhuma solicitação encontrada' });
    }

    res.json(emprestimo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.buscarTodosEmprestimoAluno= async (req, res) => {
  try {
    const todasSolicitacoes = await Emprestimo.findAll({
      where: {
        id_usuario: req.params.id,   
      }
    });

    if (!todasSolicitacoes) {
        return res.status(404).json({ message: 'Nenhuma solicitação encontrada' });
    }

    res.status(201).json({success: true, notificacoes: todasSolicitacoes});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
    
