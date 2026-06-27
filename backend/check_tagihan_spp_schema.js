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
    SELECT column_name, data_type, is_generated, generation_expression
    FROM information_schema.columns
    WHERE table_schema = 'finance' AND table_name = 'tagihan_spp'
  `);
  console.log(res.rows);
  pool.end();
}
main();
