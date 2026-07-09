const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });

Promise.all([
  p.query("SELECT conname, pg_get_constraintdef(c.oid) as def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'slip_gaji' AND contype = 'c'"),
  p.query("SELECT column_name, column_default, is_nullable, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'slip_gaji' ORDER BY ordinal_position"),
]).then(([cons, cols]) => {
  console.log('\n=== CHECK CONSTRAINTS ===');
  console.table(cons.rows);
  console.log('\n=== COLUMNS ===');
  console.table(cols.rows);
  p.end();
}).catch(e => { console.error('ERROR', e.message); p.end(); });
