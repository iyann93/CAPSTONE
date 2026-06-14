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
  
  const permRes = await pool.query("SELECT id FROM shared.permissions WHERE modul = 'siswa' AND aksi = 'read'");
  if(permRes.rows.length > 0) {
    const permId = permRes.rows[0].id;
    try {
      await pool.query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)", [bendaharaId, permId]);
      console.log('Granted siswa.read to Bendahara');
    } catch (e) {
      console.log('Already granted or error:', e.message);
    }
  } else {
    console.log('siswa.read permission does not exist in DB');
  }
  pool.end();
}
main().catch(console.error);
