require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspect() {
  try {
    const resTagihan = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'tagihan_spp'
    `);
    console.log("== TABEL TAGIHAN SPP ==");
    console.log(JSON.stringify(resTagihan.rows, null, 2));

    const resTransaksi = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'transaksi_pembayaran'
    `);
    console.log("== TABEL TRANSAKSI PEMBAYARAN ==");
    console.log(JSON.stringify(resTransaksi.rows, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspect();
