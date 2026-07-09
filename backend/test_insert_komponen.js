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
  const constraints = await pool.query(`
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE n.nspname = 'finance'
      AND conrelid::regclass::text = 'finance.komponen_gaji'
  `);
  console.log('Constraints on finance.komponen_gaji:');
  constraints.rows.forEach(r => console.log(' ', r.conname, ':', r.pg_get_constraintdef));

  console.log('\nTrying direct insert...');
  try {
    const res = await pool.query(`
      INSERT INTO finance.komponen_gaji (nama, tipe, kategori, nominal_default, is_aktif, formula_tipe, nilai_satuan)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, ['Gaji Test', 'Tunjangan', 'pendapatan', 1000000, true, 'flat', 0]);
    console.log('Insert success:', res.rows[0]);
  } catch (err) {
    console.error('Insert Failed:', err.message);
  }

  await pool.end();
}

main().catch(e => { console.error('Error:', e.message); pool.end(); });
