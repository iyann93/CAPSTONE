require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  const tfCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='finance' AND table_name='transfer_gaji' ORDER BY ordinal_position`);
  console.log('transfer_gaji:', tfCols.rows.map(x=>x.column_name).join(', '));
  const slipCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='finance' AND table_name='slip_gaji' ORDER BY ordinal_position`);
  console.log('slip_gaji:', slipCols.rows.map(x=>x.column_name).join(', '));
  const kgCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='finance' AND table_name='komponen_gaji' ORDER BY ordinal_position`);
  console.log('komponen_gaji:', kgCols.rows.map(x=>x.column_name).join(', '));
  pool.end();
}
check();
