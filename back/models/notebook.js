'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notebook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notebook.init({
    id_notebook: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_patrimonio: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false 
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    status: DataTypes.INTEGER,
    especif: DataTypes.STRING
  }, 
  {
    sequelize,
    modelName: 'Notebook',
    tableName: 'Notebooks'
  });
  return Notebook;
};