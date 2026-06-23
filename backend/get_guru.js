require('dotenv').config();
const { pool } = require('./src/config/db');
pool.query("SELECT email, password_hash FROM shared.users WHERE email = 'sri.guru@siakad.id'")
  .then(res => {
    console.log(res.rows);
    pool.end();
  })
  .catch(console.error);
