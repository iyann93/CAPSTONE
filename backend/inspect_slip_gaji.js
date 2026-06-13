require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  try {
    const slip = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'slip_gaji'
      ORDER BY ordinal_position
    `);
    console.log("slip_gaji columns:");
    console.table(slip.rows);
    
    const slip_constraints = await pool.query(`
      SELECT cc.constraint_name, cc.check_clause 
      FROM information_schema.check_constraints cc 
      JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name 
      WHERE ccu.table_schema = 'finance' AND ccu.table_name = 'slip_gaji'
    `);
    console.log("slip_gaji constraints:");
    console.table(slip_constraints.rows);

    const transfer = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'transfer_gaji'
      ORDER BY ordinal_position
    `);
    console.log("transfer_gaji columns:");
    console.table(transfer.rows);
    
    const transfer_constraints = await pool.query(`
      SELECT cc.constraint_name, cc.check_clause 
      FROM information_schema.check_constraints cc 
      JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name 
      WHERE ccu.table_schema = 'finance' AND ccu.table_name = 'transfer_gaji'
    `);
    console.log("transfer_gaji constraints:");
    console.table(transfer_constraints.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
