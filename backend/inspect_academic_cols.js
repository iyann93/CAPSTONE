require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  const tables = ['tahun_ajaran','semester','kelas','siswa','guru'];
  for (const t of tables) {
    const r = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='academic' AND table_name='${t}' ORDER BY ordinal_position`);
    console.log(`${t}:`, r.rows.map(x=>x.column_name).join(', '));
  }
  pool.end();
}
check();
