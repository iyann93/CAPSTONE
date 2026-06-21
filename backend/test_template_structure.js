const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });

Promise.all([
  p.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'template_gaji_jabatan' ORDER BY ordinal_position"),
  p.query("SELECT conname, contype, pg_get_constraintdef(c.oid) as def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'template_gaji_jabatan'"),
]).then(([cols, cons]) => {
  console.log('\n=== COLUMNS ===');
  console.table(cols.rows);
  console.log('\n=== CONSTRAINTS ===');
  console.table(cons.rows);
  p.end();
}).catch(e => { console.error('ERROR', e); p.end(); });
