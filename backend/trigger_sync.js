'use strict';
require('dotenv').config();
const SppRepository = require('./src/repositories/spp.repository');
const { Pool } = require('pg');

async function main() {
  const siswaId = '00000005-0000-0000-0000-000000000002'; // Budi
  console.log('Running sync for', siswaId);
  try {
    await SppRepository.syncBeasiswaToTagihan(siswaId);
    console.log('Sync completed.');
    
    // Check DB
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: String(process.env.DB_PASSWORD),
      port: parseInt(process.env.DB_PORT, 10),
    });
    
    const r = await pool.query('SELECT nominal, potongan, nominal_akhir, beasiswa_id FROM finance.tagihan_spp WHERE siswa_id = $1', [siswaId]);
    console.log('Updated Tagihan:', r.rows);
    pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
}
main();
