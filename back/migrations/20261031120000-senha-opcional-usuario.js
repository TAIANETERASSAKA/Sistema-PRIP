'use strict';
/** @type {import('sequelize-cli').Migration} */
// Com a Senha Única USP o sistema não guarda mais senhas
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
