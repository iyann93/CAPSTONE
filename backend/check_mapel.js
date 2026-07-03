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
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'academic' AND table_name = 'mata_pelajaran'
      ORDER BY ordinal_position;
    `);
    console.log('Kolom tabel mata_pelajaran:');
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}) nullable:${r.is_nullable}`));

    const count = await pool.query(`SELECT count(*) FROM academic.mata_pelajaran`);
    console.log(`\nJumlah data saat ini: ${count.rows[0].count}`);
    
    if (parseInt(count.rows[0].count) > 0) {
      const sample = await pool.query(`SELECT * FROM academic.mata_pelajaran LIMIT 2`);
      console.log('Sample:', sample.rows);
    }
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
