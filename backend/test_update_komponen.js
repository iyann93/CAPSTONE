const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });
p.query("UPDATE finance.komponen_gaji SET nominal_default = 300000 WHERE id = '00000009-0000-0000-0000-000000000003' RETURNING *")
  .then(res => { console.log(res.rows); p.end(); })
  .catch(e => { console.error('ERROR', e); p.end(); });
