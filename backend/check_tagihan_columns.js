'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});

pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'tagihan_spp'")
  .then(res => { console.log(res.rows); pool.end(); })
  .catch(e => { console.error(e); pool.end(); });
