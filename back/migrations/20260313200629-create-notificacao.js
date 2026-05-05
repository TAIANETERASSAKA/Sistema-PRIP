'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notificacaos', {
      id_notificacao: {
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
      id_emprestimo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Emprestimos', 
          key: 'id_emprestimo'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      mensagem: {
        type: Sequelize.TEXT
      },
      data_envio: {
        type: Sequelize.DATE
      },
      tipo: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Notificacaos');
  }
};