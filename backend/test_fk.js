const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });
p.query("SELECT * FROM finance.template_gaji_detail WHERE komponen_id = '00000009-0000-0000-0000-000000000003'")
  .then(res => { console.log('Template Gaji Detail count:', res.rowCount); p.end(); })
  .catch(e => { console.error('ERROR', e); p.end(); });
