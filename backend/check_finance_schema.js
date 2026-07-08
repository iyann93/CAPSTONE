require('dotenv').config();
const { query } = require('./src/config/db');

async function checkSchema() {
  try {
    const cols = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'transaksi_pembayaran'
    `);
    console.log("Transaksi Pembayaran columns:", cols.rows);

    // Get a sample of transactions
    const sample = await query(`SELECT * FROM finance.transaksi_pembayaran LIMIT 2`);
    console.log("Sample transactions:", sample.rows);

    const countStatus = await query(`SELECT status, count(*) FROM finance.tagihan_spp GROUP BY status`);
    console.log("Tagihan status counts:", countStatus.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkSchema();
