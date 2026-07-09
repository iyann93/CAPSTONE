require('dotenv').config();
const { pool } = require('./src/config/db');

async function alterTable() {
  try {
    const alterQuery = `
      ALTER TABLE finance.komponen_spp 
      ADD COLUMN IF NOT EXISTS denda NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS default_jatuh_tempo SMALLINT DEFAULT 10,
      ADD COLUMN IF NOT EXISTS catatan TEXT;
    `;
    
    console.log('Adding denda, default_jatuh_tempo, and catatan to finance.komponen_spp...');
    await pool.query(alterQuery);
    console.log('Columns added successfully!');

    // Cek ulang kolom di tabel komponen_spp
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'komponen_spp'
      ORDER BY ordinal_position
    `);
    console.log('\nUpdated Table finance.komponen_spp columns:');
    console.log(JSON.stringify(res.rows, null, 2));

  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}

alterTable();
