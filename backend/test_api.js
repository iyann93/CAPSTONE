const axios = require('axios');
require('dotenv').config();

async function testAPI() {
  try {
    // Generate a quick token for Guru Mapel
    const db = require('./src/config/db');
    const jwt = require('jsonwebtoken');
    const guru = await db.query("SELECT * FROM shared.users WHERE email = 'guru1@mbs.com' OR role = 'guru' LIMIT 1");
    if (!guru.rows.length) {
      console.log("No guru found");
      return;
    }
    const token = jwt.sign({ userId: guru.rows[0].id, role: guru.rows[0].role }, process.env.JWT_SECRET || 'rahasiabesar', { expiresIn: '1h' });

    console.log("Token generated");

    const t = Date.now();
    const res = await axios.get(`http://localhost:5000/api/nilai?limit=2000&_t=${t}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Nilai data:", res.data.data.length);
    if(res.data.data.length > 0) {
      console.log("Sample:", res.data.data[0]);
    }
    
    const absRes = await axios.get(`http://localhost:5000/api/absensi?limit=2000&_t=${t}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Absensi data:", absRes.data.data.length);

  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
  }
  process.exit(0);
}
testAPI();
