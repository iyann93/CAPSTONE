require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const res = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'finance' ORDER BY table_name`);
    console.log('Finance tables:', JSON.stringify(res.rows, null, 2));

    // Check komponen_gaji data
    const kg = await pool.query(`SELECT * FROM finance.komponen_gaji LIMIT 5`);
    console.log('komponen_gaji sample data:', JSON.stringify(kg.rows, null, 2));

    // Check gaji table columns
    const gajiCols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'gaji'`);
    console.log('gaji columns:', JSON.stringify(gajiCols.rows, null, 2));

    const detailGajiCols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'detail_gaji'`);
    console.log('detail_gaji columns:', JSON.stringify(detailGajiCols.rows, null, 2));
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
check();
