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

pool.query("SELECT pg_get_constraintdef(c.oid) AS constraint_def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE c.conname = 'beasiswa_status_check'")
  .then(res => { console.log(res.rows[0]); pool.end(); })
  .catch(e => { console.error(e); pool.end(); });
