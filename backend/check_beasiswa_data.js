'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});

async function run() {
  const beasiswa = await pool.query('SELECT b.*, s.nama_lengkap FROM finance.beasiswa b JOIN academic.siswa s ON b.siswa_id = s.id');
  console.log('Data Beasiswa:', beasiswa.rows);
  
  const user = await pool.query('SELECT id, role, email FROM shared.users WHERE role = \'orang_tua\' LIMIT 3');
  console.log('Sample Orang Tua Users:', user.rows);
  pool.end();
}
run();
