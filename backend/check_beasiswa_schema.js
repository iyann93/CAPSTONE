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
  const res = await pool.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'beasiswa'
  `);
  console.log('Columns in finance.beasiswa:');
  console.log(res.rows);

  const res2 = await pool.query('SELECT * FROM finance.beasiswa LIMIT 3');
  console.log('\nData in finance.beasiswa:');
  console.log(res2.rows);

  await pool.end();
}

main().catch(e => { console.error(e.message); pool.end(); });
