require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'transaksi_pembayaran'
    `);
    console.log("Transaksi Pembayaran Columns:");
    console.log(res.rows);

  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
