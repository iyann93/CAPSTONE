const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkTotals() {
  try {
    // 1. SPP
    const sppRes = await pool.query('SELECT jumlah_bayar FROM finance.transaksi_pembayaran');
    const totalSpp = sppRes.rows.reduce((acc, row) => acc + Number(row.jumlah_bayar || 0), 0);
    console.log('Total SPP (jumlah_bayar):', totalSpp);

    // 2. Operasional Pemasukan
    const opRes = await pool.query("SELECT nominal FROM finance.operasional_transactions WHERE tipe = 'pemasukan'");
    const totalOpMasuk = opRes.rows.reduce((acc, row) => acc + Number(row.nominal || 0), 0);
    console.log('Total Operasional Pemasukan:', totalOpMasuk);

    // 3. Dana Beasiswa Masuk
    const dbRes = await pool.query("SELECT nominal FROM finance.dana_beasiswa");
    const totalDanaBeasiswa = dbRes.rows.reduce((acc, row) => acc + Number(row.nominal || 0), 0);
    console.log('Total Dana Beasiswa Masuk:', totalDanaBeasiswa);

    const totalPemasukan = totalSpp + totalOpMasuk + totalDanaBeasiswa;
    console.log('GRAND TOTAL PEMASUKAN:', totalPemasukan);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkTotals();
