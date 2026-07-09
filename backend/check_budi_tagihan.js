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
  const r = await pool.query(`
    SELECT t.id, t.bulan, t.tahun, t.nominal, t.potongan, t.nominal_akhir, t.status, s.nama_lengkap 
    FROM finance.tagihan_spp t
    JOIN academic.siswa s ON t.siswa_id = s.id
    WHERE s.nama_lengkap ILIKE '%budi%'
  `);
  console.log('Tagihan Budi:', r.rows);
  pool.end();
}
main();
