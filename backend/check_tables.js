const { Pool } = require('pg');
require('dotenv').config();

const p = new Pool({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

p.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'shared'")
  .then(r => console.log(r.rows.map(x=>x.table_name)))
  .catch(console.error)
  .finally(()=>p.end());
