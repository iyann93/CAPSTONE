require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid)
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE n.nspname = 'finance' AND conrelid::regclass::text = 'finance.tagihan_spp'
    `);
    console.log("Constraints on tagihan_spp:");
    console.log(res.rows);

  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
