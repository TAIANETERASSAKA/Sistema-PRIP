'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mensagem extends Model {
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
  Mensagem.init({
    id_mensagem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_emprestimo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_usuario:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isAdm: DataTypes.BOOLEAN,
    conteudo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enviado_em: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Mensagem',
  });
  return Mensagem;
};