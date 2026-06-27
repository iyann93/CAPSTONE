'use strict';
require('dotenv').config();
const { Pool } = require('pg');
const BeasiswaRepository = require('./src/repositories/beasiswa.repository');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});

async function main() {
  const SAMPLE_SISWA_ID = '00000005-0000-0000-0000-000000000001'; 
  const payload = {
    siswaId: SAMPLE_SISWA_ID,
    namaBeasiswa: 'Beasiswa Test',
    nominal: 250000,
    periode: '2025/2026',
    status: 'Aktif',
    tanggalMulai: '2025-07-01',
    tanggalSelesai: '2026-06-30',
  };

  try {
    console.log('Attempting to create beasiswa directly via repository...');
    const result = await BeasiswaRepository.create(payload);
    console.log('Success:', result);
    await BeasiswaRepository.delete(result.id);
  } catch (error) {
    console.error('Error creating beasiswa:');
    console.error(error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    pool.end();
    process.exit(0);
  }
}

main();
