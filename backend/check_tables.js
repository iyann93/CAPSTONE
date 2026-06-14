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
  const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'finance'");
  console.log('Tables in finance schema:');
  console.log(res.rows.map(r => r.table_name));
  await pool.end();
}

main().catch(e => { console.error(e.message); pool.end(); });
