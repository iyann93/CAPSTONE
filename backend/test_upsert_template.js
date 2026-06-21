const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });

// Test: upsert template for jabatan "Guru" + komponen "Gaji Pokok"
const jabatan_id = '656e201f-2995-43a5-a95a-895d6ebbad28'; // Guru
const komponen_gaji_id = '00000009-0000-0000-0000-000000000001'; // Gaji Pokok (from previous data)

p.query("SELECT id, nama FROM finance.komponen_gaji LIMIT 3")
  .then(res => {
    console.log('Komponen gaji sample:');
    console.table(res.rows);
    const firstKomponen = res.rows[0];
    return p.query(
      "INSERT INTO finance.template_gaji_jabatan (jabatan_id, komponen_gaji_id, nominal, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (jabatan_id, komponen_gaji_id) DO UPDATE SET nominal = EXCLUDED.nominal, updated_at = NOW() RETURNING *",
      [jabatan_id, firstKomponen.id, 5000000]
    );
  })
  .then(res => {
    console.log('\nUpsert result:');
    console.table(res.rows);
    p.end();
  })
  .catch(e => { console.error('ERROR', e.message); p.end(); });
