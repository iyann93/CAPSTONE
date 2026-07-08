require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

async function test() {
  const token = jwt.sign({ userId: 'some-id', role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  try {
    const res = await axios.get('http://localhost:5000/api/v1/jadwal-pelajaran?limit=100', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Total schedules:", res.data.data.length);
    if (res.data.data.length > 0) console.log(res.data.data[0]);
  } catch(e) {
    console.log(e.response?.data || e.message);
  }
}
test();
