const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT,
  database: process.env.DB_DATABASE, ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // Check current lengths
    const cols = await pool.query(`
      SELECT column_name, character_maximum_length
      FROM information_schema.columns 
      WHERE table_schema='academic' AND table_name='mata_pelajaran'
        AND data_type='character varying';
    `);
    console.log('Varchar columns:', cols.rows);

    // Alter columns to be larger
    await pool.query(`ALTER TABLE academic.mata_pelajaran ALTER COLUMN kode TYPE varchar(20)`);
    await pool.query(`ALTER TABLE academic.mata_pelajaran ALTER COLUMN kelompok TYPE varchar(50)`);
    await pool.query(`ALTER TABLE academic.mata_pelajaran ALTER COLUMN tingkat TYPE varchar(100)`);
    console.log('✅ Columns altered!');
  } catch(err) { console.error(err.message); }
  finally { pool.end(); }
}
run();
