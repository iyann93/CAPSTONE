require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspect() {
  try {
    const resNilai = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'academic' AND table_name = 'nilai'
    `);
    console.log("== TABEL NILAI ==");
    console.log(JSON.stringify(resNilai.rows, null, 2));

    const resBobot = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'academic' AND table_name = 'bobot_nilai'
    `);
    console.log("\n== TABEL BOBOT_NILAI ==");
    console.log(JSON.stringify(resBobot.rows, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspect();
