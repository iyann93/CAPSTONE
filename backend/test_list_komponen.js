const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });

p.query("SELECT id, nama, tipe, formula_tipe, is_aktif FROM finance.komponen_gaji ORDER BY tipe, nama")
  .then(res => {
    console.log(`Total: ${res.rows.length} komponen`);
    console.table(res.rows);
    p.end();
  })
  .catch(e => { console.error('ERROR', e.message); p.end(); });
