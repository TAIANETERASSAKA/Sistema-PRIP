'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Termo_compromissos', {
      id_termo: {
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
      assinatura_base64: {
        type:  Sequelize.TEXT('long'),
        allowNull: false
      },
      caminho_pdf: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_assinatura: {
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
    await queryInterface.dropTable('Termo_compromissos');
  }
};