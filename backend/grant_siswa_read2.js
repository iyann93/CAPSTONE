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
  const roleRes = await pool.query("SELECT id FROM shared.roles WHERE nama_role ILIKE '%bendahara%'");
  const bendaharaId = roleRes.rows[0].id;
  
  let permId;
  const permRes = await pool.query("SELECT id FROM shared.permissions WHERE modul = 'siswa' AND aksi = 'read'");
  if(permRes.rows.length > 0) {
    permId = permRes.rows[0].id;
  } else {
    console.log('Inserting siswa.read permission...');
    const insertRes = await pool.query(
      "INSERT INTO shared.permissions (nama_permission, modul, aksi) VALUES ($1, $2, $3) RETURNING id",
      ['Lihat Data Siswa', 'siswa', 'read']
    );
    permId = insertRes.rows[0].id;
  }
  
  try {
    await pool.query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)", [bendaharaId, permId]);
    console.log('Granted siswa.read to Bendahara');
  } catch (e) {
    console.log('Already granted or error:', e.message);
  }
  
  pool.end();
}
main().catch(console.error);
