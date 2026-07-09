require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkCounts() {
  try {
    const tables = [
      'academic.siswa',
      'academic.guru',
      'shared.users',
      'finance.komponen_spp',
      'finance.tagihan_spp',
      'finance.transaksi_pembayaran',
      'finance.beasiswa',
      'finance.slip_gaji',
      'finance.komponen_gaji'
    ];
    for (const t of tables) {
      const res = await pool.query(`SELECT COUNT(*) FROM ${t}`);
      console.log(`${t}: ${res.rows[0].count} rows`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
checkCounts();
