require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspect() {
  try {
    const resRapor = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'academic' AND table_name = 'rapor'
    `);
    console.log("== TABEL RAPOR ==");
    console.log(JSON.stringify(resRapor.rows, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspect();
