'use strict';
require('dotenv').config();
const AuthRepository = require('./src/repositories/auth.repository');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: String(process.env.DB_PASSWORD),
    port: parseInt(process.env.DB_PORT, 10),
  });
  
  const r = await pool.query("SELECT email FROM shared.users u JOIN shared.user_roles ur ON ur.user_id = u.id JOIN shared.roles ro ON ro.id = ur.role_id WHERE ro.nama_role = 'orang_tua' LIMIT 1");
  if (r.rows.length > 0) {
    const user = await AuthRepository.findUserByEmail(r.rows[0].email);
    console.log('Orang Tua User object from DB (AuthRepository):', JSON.stringify(user, null, 2));
  }
  pool.end();
}
main();
