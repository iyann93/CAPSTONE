require('dotenv').config();
const { query } = require('./src/config/db');

async function run() {
  try {
    const res = await query('SELECT id, nama_kelas FROM academic.kelas');
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
