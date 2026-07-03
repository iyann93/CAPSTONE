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
    await pool.query(`ALTER TABLE academic.kelas ALTER COLUMN kode_kelas TYPE varchar(50);`);
    console.log("Altered kode_kelas length to 50");
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
