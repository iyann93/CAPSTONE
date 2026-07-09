require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  try {
    const constraints = await pool.query(`
      SELECT cc.constraint_name, cc.check_clause 
      FROM information_schema.check_constraints cc 
      JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name 
      WHERE ccu.table_schema = 'finance' AND ccu.table_name = 'tagihan_spp'
    `);
    console.table(constraints.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
