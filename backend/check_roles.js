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
  const r = await pool.query('SELECT id, nama_role FROM shared.roles');
  console.log('Roles:', r.rows);
  
  const u = await pool.query('SELECT u.email, r.nama_role FROM shared.users u JOIN shared.user_roles ur ON ur.user_id = u.id JOIN shared.roles r ON r.id = ur.role_id');
  console.log('Users:', u.rows);
  
  pool.end();
}
main();
