'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Manutencaos', {
      id_manutencao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_emprestimo: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Emprestimos', 
          key: 'id_emprestimo'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_notebook: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Notebooks', 
          key: 'id_notebook'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      motivo: {
        type: Sequelize.STRING
      },
      data_entrada: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Manutencaos');
  }
};