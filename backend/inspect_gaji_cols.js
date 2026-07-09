require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  try {
    const r = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'komponen_gaji'
      ORDER BY ordinal_position
    `);
    console.table(r.rows);
    
    const constraints = await pool.query(`
      SELECT cc.constraint_name, cc.check_clause 
      FROM information_schema.check_constraints cc 
      JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name 
      WHERE ccu.table_schema = 'finance' AND ccu.table_name = 'komponen_gaji'
    `);
    console.log("Constraints:");
    console.table(constraints.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
