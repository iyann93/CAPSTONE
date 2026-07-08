const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkPengeluaran() {
  try {
    // 1. Operasional Pengeluaran
    const opRes = await pool.query("SELECT SUM(nominal) FROM finance.operasional_transactions WHERE tipe = 'pengeluaran'");
    const totalOp = Number(opRes.rows[0].sum || 0);
    console.log('Total Operasional Pengeluaran:', totalOp);

    // 2. Beasiswa
    const beaRes = await pool.query("SELECT SUM(nominal) FROM finance.beasiswa_penerima");
    const totalBea = Number(beaRes.rows[0].sum || 0);
    console.log('Total Beasiswa:', totalBea);

    console.log('GRAND TOTAL PENGELUARAN:', totalOp + totalBea);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkPengeluaran();
