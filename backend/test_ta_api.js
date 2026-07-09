require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { query } = require('./src/config/db');
require('dotenv').config();

async function test() {
  const u = await query("SELECT * FROM shared.users WHERE email = 'wahyu.admin@siakad.id'");
  const token = jwt.sign({ userId: u.rows[0].id, role: 'Admin TU', is_active: true }, process.env.JWT_SECRET || 'your_super_secret_access_key_change_in_production', { expiresIn: '1h' });
  const headers = { Authorization: 'Bearer ' + token };
  try {
    const res = await axios.get('http://127.0.0.1:5000/api/v1/tahun-ajaran?limit=100', { headers });
    console.log(JSON.stringify(res.data));
  } catch(e) {
    console.error(e.response?.data || e.message);
  }
  process.exit(0);
}
test();

