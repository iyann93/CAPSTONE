require('dotenv').config();
const { pool } = require('./src/config/db');

(async () => {
  try {
    const fk = await pool.query(`
      SELECT 
        tc.table_schema, tc.table_name, kcu.column_name,
        ccu.table_schema AS ref_schema, ccu.table_name AS ref_table, ccu.column_name AS ref_col
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_schema = 'shared'
        AND ccu.table_name IN ('users','roles')
      ORDER BY ccu.table_name, tc.table_schema, tc.table_name
    `);
    console.log('== FK REFERENCES TO shared.users / shared.roles ==');
    console.table(fk.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
})();
