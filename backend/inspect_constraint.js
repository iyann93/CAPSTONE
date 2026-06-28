require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT pg_get_constraintdef(c.oid) AS def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE c.conname = 'transaksi_pembayaran_metode_check';
    `);
    console.log('Constraint Definition:', res.rows[0]?.def);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
