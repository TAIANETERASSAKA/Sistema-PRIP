'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero_usp:{
      type: DataTypes.STRING,
      unique: true,
      allowNull: false 
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false 
    },
    // Não é mais usada: o login é feito pela Senha Única USP
    senha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
      allowNull: false 
    },
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios',
    defaultScope: {
      attributes: { exclude: ['senha'] }
    }
  });
  return Usuario;
};