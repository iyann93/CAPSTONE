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
    const res = await pool.query(`SELECT id, nama_kelas FROM academic.kelas WHERE nama_kelas = 'X MIPA 1'`);
    if (res.rows.length > 0) {
      console.log('ID for X MIPA 1:', res.rows[0].id);
      
      // Update all students
      const updateRes = await pool.query(`UPDATE academic.siswa SET kelas_id = $1`, [res.rows[0].id]);
      console.log(`Updated ${updateRes.rowCount} students.`);
    } else {
      console.log('Class X MIPA 1 not found!');
    }
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
