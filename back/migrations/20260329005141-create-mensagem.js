'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mensagems', {
      id_mensagem: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      isAdm: {
        type: Sequelize.BOOLEAN
      },
      conteudo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      enviado_em: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('Mensagems');
  }
};