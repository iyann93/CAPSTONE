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
    const toDelete = [
      'Kelas IX-A',
      'Kelas VII-A',
      'Kelas VIII-A',
      'X IPA 1',
      'X IPA 2',
      'X IPS 1',
      'X IPS 2',
      'XI IPA 1',
      'XI IPS 1',
      'XII IPA 1',
      'XII IPS 1'
    ];

    const placeholders = toDelete.map((_, i) => `$${i + 1}`).join(',');
    const res = await pool.query(`DELETE FROM academic.kelas WHERE nama_kelas IN (${placeholders}) RETURNING nama_kelas`, toDelete);
    
    console.log(`Deleted ${res.rowCount} classes:`);
    console.log(res.rows.map(r => r.nama_kelas).join(', '));
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
