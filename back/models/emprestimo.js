'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Emprestimo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // No seu models/emprestimo.js
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
      this.belongsTo(models.Notebook, { foreignKey: 'id_notebook', as: 'notebook' });
    }
  }
  Emprestimo.init({
    id_emprestimo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    justificativa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_notebook: DataTypes.INTEGER,
    data_solicitacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_retirada: DataTypes.DATE,
    data_recusa: DataTypes.DATE,
    data_devolucao_prevista: DataTypes.DATE,
    data_devolucao_real: DataTypes.DATE,
    observacao: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Emprestimo',
    tableName: 'Emprestimos'
  });
  return Emprestimo;
};