const { Emprestimo } = require('../models');

// Exige um usuário logado na sessão
const validarSessao = (req, res, next) => {
  if (!req.session?.usuario?.id_usuario) {
      return res.status(401).json({
          error: "nao_autenticado",
          message: "Usuário não está logado. Faça login primeiro."
      });
  }
  next();
};

// Exige um usuário logado com perfil de administrador (CIP)
const validarAdmin = (req, res, next) => {
  validarSessao(req, res, () => {
      if (!req.session.usuario.isAdmin) {
          return res.status(403).json({
              error: "acesso_negado",
              message: "Apenas administradores podem acessar este recurso."
          });
      }
      next();
  });
};

// Exige que o empréstimo pertença ao usuário logado (admins acessam todos)
// buscarId: função que extrai o id do empréstimo da requisição
const validarDonoEmprestimo = (buscarId) => async (req, res, next) => {
  if (req.session.usuario.isAdmin) return next();

  try {
      const emprestimo = await Emprestimo.findByPk(buscarId(req));

      if (!emprestimo || emprestimo.id_usuario !== req.session.usuario.id_usuario) {
          return res.status(403).json({
              error: "acesso_negado",
              message: "Você não tem acesso a este empréstimo."
          });
      }
      next();
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Exige que o id da URL seja o do próprio usuário (admins acessam todos)
const validarProprioUsuario = (req, res, next) => {
  const { id_usuario, isAdmin } = req.session.usuario;

  if (!isAdmin && Number(req.params.id) !== id_usuario) {
      return res.status(403).json({
          error: "acesso_negado",
          message: "Você só pode consultar os seus próprios empréstimos."
      });
  }
  next();
};

module.exports = { validarSessao, validarAdmin, validarDonoEmprestimo, validarProprioUsuario };
