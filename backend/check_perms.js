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
  const r = await pool.query(`
    SELECT rp.role_id, r.nama_role 
    FROM shared.role_permissions rp 
    JOIN shared.permissions p ON p.id = rp.permission_id 
    JOIN shared.roles r ON r.id = rp.role_id
    WHERE p.modul = 'beasiswa' AND p.aksi = 'read'
  `);
  console.log('Roles with beasiswa.read:', r.rows);
  pool.end();
}
main();
