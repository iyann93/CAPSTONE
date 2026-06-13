require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspect() {
  try {
    const res = await pool.query(`SELECT id, nama_permission, modul, aksi FROM shared.permissions ORDER BY modul, aksi`);
    console.log('All permissions:');
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspect();
