const { Pool } = require('pg');
require('dotenv').config();

const p = new Pool({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

p.query("SELECT * FROM finance.komponen_gaji").then(r => console.table(r.rows)).catch(console.error).finally(()=>p.end());
