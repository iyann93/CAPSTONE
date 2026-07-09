require('dotenv').config({ path: '../.env' });
const { query } = require('./src/config/db');

async function run() {
  try {
    const res = await query(`
      SELECT table_name, column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_schema IN ('academic', 'shared') 
      AND table_name IN ('guru', 'siswa', 'karyawan', 'orang_tua', 'users')
      ORDER BY table_name, column_name;
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
