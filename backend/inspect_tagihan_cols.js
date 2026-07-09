require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  const r = await pool.query(`
    SELECT column_name, column_default, is_nullable, is_generated
    FROM information_schema.columns 
    WHERE table_schema='finance' AND table_name='tagihan_spp' 
    ORDER BY ordinal_position
  `);
  r.rows.forEach(row => console.log(row.column_name, '| generated:', row.is_generated, '| default:', row.column_default, '| nullable:', row.is_nullable));
  pool.end();
}
check();
