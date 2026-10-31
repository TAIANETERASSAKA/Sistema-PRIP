'use strict';
/** @type {import('sequelize-cli').Migration} */
// Índices para as consultas mais frequentes (o Postgres não cria índice em chave estrangeira)
// e a coluna de finalização da manutenção, usada pelo PUT /manutencoes/:id
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Emprestimos', ['id_usuario', 'status'], { name: 'idx_emprestimos_usuario_status' });
    await queryInterface.addIndex('Emprestimos', ['id_notebook'], { name: 'idx_emprestimos_notebook' });
    await queryInterface.addIndex('Emprestimos', ['status'], { name: 'idx_emprestimos_status' });
    await queryInterface.addIndex('Mensagems', ['id_emprestimo'], { name: 'idx_mensagens_emprestimo' });
    await queryInterface.addIndex('Manutencaos', ['id_notebook'], { name: 'idx_manutencoes_notebook' });

    await queryInterface.addColumn('Manutencaos', 'data_finalizada', { type: Sequelize.DATE });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Manutencaos', 'data_finalizada');

    await queryInterface.removeIndex('Manutencaos', 'idx_manutencoes_notebook');
    await queryInterface.removeIndex('Mensagems', 'idx_mensagens_emprestimo');
    await queryInterface.removeIndex('Emprestimos', 'idx_emprestimos_status');
    await queryInterface.removeIndex('Emprestimos', 'idx_emprestimos_notebook');
    await queryInterface.removeIndex('Emprestimos', 'idx_emprestimos_usuario_status');
  }
};
