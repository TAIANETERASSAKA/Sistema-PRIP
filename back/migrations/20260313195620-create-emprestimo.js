'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Emprestimos', {
      id_emprestimo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios', 
          key: 'id_usuario'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_notebook: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Notebooks',
          key: 'id_notebook'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      data_solicitacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      justificativa: {
        type: Sequelize.STRING,
        allowNull: false
      },
      observacao: {
        type: Sequelize.STRING,
      },
      data_retirada: {
        type: Sequelize.DATE
      },
      data_recusa: {
        type: Sequelize.DATE
      },   
      data_devolucao_prevista: {
        type: Sequelize.DATE
      },
      data_devolucao_real: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Emprestimos');
  }
};