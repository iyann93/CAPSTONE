const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });
p.query("SELECT conname, conrelid::regclass, confrelid::regclass FROM pg_constraint WHERE confrelid = 'finance.komponen_gaji'::regclass")
  .then(res => { console.table(res.rows); p.end(); })
  .catch(e => { console.error('ERROR', e); p.end(); });
