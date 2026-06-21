const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });

const user_id = '7ff844aa-7e78-4cff-9387-47e17c31b02f';       // Drs. Bambang Sudirman
const komponen_gaji_id = '00000009-0000-0000-0000-000000000002'; // Tunjangan Jabatan
const nominal = 2500000;

console.log('Testing direct DB upsert...');
p.query(
  "INSERT INTO finance.pengaturan_gaji_user (user_id, komponen_gaji_id, nominal, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (user_id, komponen_gaji_id) DO UPDATE SET nominal = EXCLUDED.nominal, updated_at = NOW() RETURNING *",
  [user_id, komponen_gaji_id, nominal]
)
.then(res => {
  console.log('SUCCESS:', res.rows);
  p.end();
})
.catch(e => {
  console.error('ERROR code:', e.code);
  console.error('ERROR message:', e.message);
  console.error('ERROR detail:', e.detail);
  p.end();
});
