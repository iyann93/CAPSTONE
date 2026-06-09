'use strict';
require('dotenv').config();
const { pool } = require('./src/config/db');

pool.query('SELECT NOW()')
  .then(r => console.log('✅ DB connection OK →', r.rows[0]))
  .catch(e => { console.error('❌ DB connection FAILED →', e); console.error('Message:', e.message); })
  .finally(() => pool.end());
