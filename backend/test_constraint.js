const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });
p.query("SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c WHERE conname = 'template_gaji_jabatan_jabatan_id_fkey'")
  .then(res => { console.log(res.rows); p.end(); })
  .catch(e => { console.error('ERROR', e); p.end(); });
