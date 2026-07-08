const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function run() {
  try {
    const res = await pool.query("DELETE FROM finance.operasional_transactions WHERE nama = 'Pembayaran Gaji (Ref: TRX-1783503020123)'");
    console.log(`Deleted ${res.rowCount} rows`);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
