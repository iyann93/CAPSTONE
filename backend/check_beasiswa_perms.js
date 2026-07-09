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

async function main() {
  // Cek struktur tabel roles
  const r0 = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='shared' AND table_name='roles'`);
  console.log('Roles columns:', r0.rows.map(r => r.column_name));

  // Cek semua roles
  const r1 = await pool.query(`SELECT * FROM shared.roles LIMIT 10`);
  console.log('\nAll roles:', r1.rows);

  // Cek semua beasiswa perms
  const r2 = await pool.query(`SELECT * FROM shared.permissions WHERE modul ILIKE '%beasiswa%'`);
  console.log('\nAll beasiswa permissions:', r2.rows);

  // Cek siswa id type
  const r3 = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='academic' AND table_name='siswa' AND column_name='id'`);
  console.log('\nSiswa id type:', r3.rows);

  // Sample siswa
  const r4 = await pool.query(`SELECT id, nis, nama_lengkap FROM academic.siswa LIMIT 3`);
  console.log('\nSample siswa:', r4.rows);

  // Cek beasiswa table
  const r5 = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='finance' AND table_name='beasiswa'`);
  console.log('\nBeasiswa columns:', r5.rows);

  await pool.end();
}

main().catch(e => { console.error(e.message); pool.end(); });
