'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Termo_compromisso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Emprestimo, { foreignKey: 'id_emprestimo', as: 'emprestimo' });
    }
  }
  Termo_compromisso.init({
    id_termo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_emprestimo: DataTypes.INTEGER,
    assinatura_base64:{
      type: DataTypes.TEXT('long')
    },         
    caminho_pdf: DataTypes.STRING,
    data_assinatura: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Termo_compromisso',
  });
  return Termo_compromisso;
};