'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_check_emprestimo_vencido()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.data_devolucao_prevista IS NOT NULL
           AND NEW.data_devolucao_real IS NULL
           AND CURRENT_DATE > NEW.data_devolucao_prevista::date
           AND NEW.status IS DISTINCT FROM 5
        THEN
          NEW.status := 5;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_check_emprestimo_vencido
      BEFORE INSERT OR UPDATE ON "Emprestimos"
      FOR EACH ROW
      EXECUTE FUNCTION fn_check_emprestimo_vencido();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_check_emprestimo_vencido ON "Emprestimos";
    `);
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_check_emprestimo_vencido;
    `);
  }
};