const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // Check all current kelas
    const res = await pool.query(`SELECT id, nama_kelas, tingkat FROM academic.kelas ORDER BY tingkat, nama_kelas`);
    console.log(`Total kelas: ${res.rowCount}`);
    res.rows.forEach(r => console.log(`  [${r.tingkat}] ${r.nama_kelas} (${r.id})`));
    
    // Check siswa kelas_id
    const siswa = await pool.query(`SELECT s.nama_lengkap, k.nama_kelas FROM academic.siswa s LEFT JOIN academic.kelas k ON s.kelas_id = k.id`);
    console.log('\nData siswa & kelas:');
    siswa.rows.forEach(r => console.log(`  ${r.nama_lengkap} -> ${r.nama_kelas || 'TIDAK ADA'}`));
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
