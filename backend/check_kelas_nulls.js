const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT column_name, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'academic' AND table_name = 'kelas';
    `);
    console.log(res.rows);
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
