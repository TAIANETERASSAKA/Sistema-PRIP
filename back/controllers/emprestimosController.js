const { sequelize, Emprestimo, Usuario, Notebook } = require('../models');
const { Op } = require('sequelize'); // Importante para usar operadores como o IN
const { enviarEmail } = require('../services/emailService');

// Status do empréstimo
const STATUS = { PENDENTE: 1, APROVADO: 2, RETIRADO: 3, DEVOLVIDO: 4, ATRASADO: 5, RECUSADO: 6 };
const STATUS_ATIVOS = [STATUS.PENDENTE, STATUS.APROVADO, STATUS.RETIRADO, STATUS.ATRASADO];

// Status do notebook
const NOTEBOOK_DISPONIVEL = 1;
const NOTEBOOK_EMPRESTADO = 2;

// Erro com código HTTP, usado para interromper a transação com uma resposta amigável
class ErroHttp extends Error {
  constructor(status, error, message) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

// Busca o empréstimo com o usuário e envia o e-mail de atualização (sem travar a resposta)
const notificarAluno = async (id_emprestimo) => {
  const emprestimo = await Emprestimo.findByPk(id_emprestimo, {
    include: [{ model: Usuario, as: 'usuario' }]
  });
  enviarEmail(emprestimo);
};

exports.criarEmprestimo = async (req, res) => {
  try {
    // Pegando o id_usuario da sessao (garantida pelo validarSessao)
    const id_usuario = req.session.usuario.id_usuario;

    // RF13: apenas um notebook por aluno por vez
    const emprestimoAtivo = await Emprestimo.findOne({
      where: { id_usuario, status: { [Op.in]: STATUS_ATIVOS } }
    });

    if (emprestimoAtivo) {
      return res.status(409).json({
        error: "emprestimo_ativo",
        message: "Você já possui uma solicitação ou empréstimo em andamento. Só é permitido um notebook por aluno por vez."
      });
    }

    const emprestimo = await Emprestimo.create({
      id_usuario: id_usuario,
      justificativa: req.body.justificativa,
      status: STATUS.PENDENTE,
      data_solicitacao: new Date()
    });

    res.status(201).json({success: true, emprestimo: emprestimo});

    notificarAluno(emprestimo.id_emprestimo).catch(console.error);
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
  const { status, id_notebook, data_devolucao_prevista } = req.body;

  if (status === STATUS.RETIRADO && !data_devolucao_prevista) {
    return res.status(400).json({      
      error: "campos_ausentes",
      message: "Para confirmar a retirada de um notebook, é necessário definir a data de devolução prevista."
    });
  }

  if (data_devolucao_prevista && new Date(data_devolucao_prevista) <= new Date()) {
    return res.status(400).json({      
      error: "campos_ausentes",
      message: "A data de devolução prevista deve ser uma data futura."
    });
  }

  if (status === STATUS.APROVADO && !id_notebook) {
    return res.status(400).json({
      error: "campos_ausentes",
      message: "Selecione um notebook disponível para aprovar a solicitação."
    });
  }

  try {
    // Transação: o empréstimo e o notebook são atualizados juntos, ou nada é alterado
    await sequelize.transaction(async (transaction) => {
      const emprestimo = await Emprestimo.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!emprestimo) {
        throw new ErroHttp(404, "nao_encontrado", "Empréstimo não encontrado");
      }

      // RF07: só é possível atribuir um notebook disponível.
      // O lock impede que dois administradores atribuam o mesmo notebook ao mesmo tempo.
      if (id_notebook && id_notebook !== emprestimo.id_notebook) {
        const notebook = await Notebook.findByPk(id_notebook, { transaction, lock: transaction.LOCK.UPDATE });

        if (!notebook || notebook.status !== NOTEBOOK_DISPONIVEL) {
          throw new ErroHttp(409, "notebook_indisponivel", "Este notebook não está mais disponível. Escolha outro.");
        }
        await notebook.update({ status: NOTEBOOK_EMPRESTADO }, { transaction });
      }

      await emprestimo.update({
        data_retirada: req.body.data_retirada,
        data_recusa: req.body.data_recusa,
        data_devolucao_prevista: data_devolucao_prevista,
        data_devolucao_real: req.body.data_devolucao_real,
        status: status,
        id_notebook: id_notebook,
        observacao: req.body.observacao
      }, { transaction });
    });

    res.status(201).json({success: true});

    notificarAluno(req.params.id).catch(console.error);
  } catch (error) {
    if (error instanceof ErroHttp) {
      return res.status(error.status).json({ error: error.error, message: error.message });
    }
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
    // Sessão garantida pelo validarSessao nas rotas
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
    // Sessão garantida pelo validarSessao nas rotas
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
    
