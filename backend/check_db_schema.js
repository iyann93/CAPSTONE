require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema IN ('public', 'academic', 'finance', 'users')
    `);
    console.log("Tables:");
    console.log(res.rows);

    const res2 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    console.log("\nUsers Columns:");
    console.log(res2.rows);

    const res3 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'academic' AND table_name = 'siswa'
    `);
    console.log("\nSiswa Columns:");
    console.log(res3.rows);

    const res4 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'tagihan_spp'
    `);
    console.log("\nTagihan SPP Columns:");
    console.log(res4.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
