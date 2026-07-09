require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  const r = await pool.query(`
    SELECT cc.constraint_name, cc.check_clause 
    FROM information_schema.check_constraints cc 
    JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name=ccu.constraint_name 
    WHERE ccu.table_schema='academic' AND ccu.table_name='guru'
  `);
  console.log(r.rows);
  pool.end();
}
check();
