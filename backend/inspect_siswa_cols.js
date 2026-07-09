require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  try {
    const r = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'academic' AND table_name = 'siswa'
    `);
    console.table(r.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
