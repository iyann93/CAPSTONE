// Test generate langsung dengan capture error detail
const { Pool, types } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });

async function test() {
  const userId = '7ff844aa-7e78-4cff-9387-47e17c31b02f'; // Drs. Bambang Sudirman
  
  // Check user exists
  const userRes = await p.query("SELECT id, nama, jabatan_id FROM shared.users WHERE id = $1", [userId]);
  console.log('User:', userRes.rows[0]);

  // Check jabatan template
  const jabatanId = userRes.rows[0]?.jabatan_id;
  console.log('\nJabatan ID:', jabatanId);
  
  if (jabatanId) {
    const tRes = await p.query("SELECT t.komponen_gaji_id, t.nominal, k.nama FROM finance.template_gaji_jabatan t JOIN finance.komponen_gaji k ON t.komponen_gaji_id = k.id WHERE t.jabatan_id = $1", [jabatanId]);
    console.log('\nTemplate jabatan:');
    console.table(tRes.rows);
  }
  
  // Check all active komponen
  const kompRes = await p.query("SELECT id, nama, tipe, formula_tipe, nominal_default, nilai_satuan FROM finance.komponen_gaji WHERE is_aktif = true ORDER BY tipe, nama");
  console.log('\nKomponen aktif:');
  console.table(kompRes.rows);
  
  p.end();
}

test().catch(e => { console.error('ERROR:', e.message); p.end(); });
