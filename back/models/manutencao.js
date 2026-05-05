'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manutencao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Emprestimo, { foreignKey: 'id_emprestimo', as: 'emprestimo' });
      this.belongsTo(models.Notebook, { foreignKey: 'id_notebook', as: 'notebook' });

   }
  }
  Manutencao.init({
    id_manutencao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_emprestimo: DataTypes.INTEGER,
    id_notebook: DataTypes.INTEGER,
    motivo: DataTypes.STRING,
    data_entrada: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Manutencao',
  });
  return Manutencao;
};