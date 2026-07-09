require('dotenv').config();
const { Pool } = require('pg');

console.log('Connecting with:');
console.log('HOST:', process.env.DB_HOST);
console.log('PORT:', process.env.DB_PORT);
console.log('USER:', process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
  ssl: false,
  connectionTimeoutMillis: 10000
});

pool.query('SELECT 1')
  .then(() => { console.log('SUCCESS - Connected!'); process.exit(0); })
  .catch(err => { console.log('FAILED:', err.message); process.exit(1); });
