'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notificacao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
      this.belongsTo(models.Emprestimo, { foreignKey: 'id_emprestimo', as: 'emprestimo' });
    }
  }
  Notificacao.init({
    id_notificacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_emprestimo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mensagem: DataTypes.TEXT,
    data_envio: DataTypes.DATE,
    tipo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notificacao',
    tableName: 'Notificacoes'
  });
  return Notificacao;
};