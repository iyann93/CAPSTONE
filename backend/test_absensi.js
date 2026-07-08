require('dotenv').config();
const axios = require('axios');
const { signAccessToken } = require('./src/utils/jwt');
const db = require('./src/config/db');

async function test() {
  try {
    const userRes = await db.query("SELECT u.id, u.email, u.nama, r.nama_role as role FROM shared.users u JOIN shared.user_roles ur ON u.id = ur.user_id JOIN shared.roles r ON ur.role_id = r.id WHERE r.nama_role = 'Admin TU' LIMIT 1");
    const user = userRes.rows[0];
    const payload = { userId: user.id, email: user.email, nama: user.nama, role: user.role };
    const token = signAccessToken(payload);
    
    const kelasRes = await db.query("SELECT id FROM academic.kelas WHERE nama_kelas = 'Kelas IX'");
    const kelasId = kelasRes.rows[0].id;
    const selectedDate = new Date().toISOString().split('T')[0];
    
    console.log('Fetching absensi with token...');
    const res = await axios.get(`http://localhost:5000/api/v1/absensi?tanggal=${selectedDate}&kelas_id=${kelasId}&limit=1000`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch(e) {
    if (e.response) {
      console.log('Error Status:', e.response.status);
      console.log('Error Data:', JSON.stringify(e.response.data, null, 2));
    } else {
      console.error(e.message);
    }
  } finally {
    process.exit();
  }
}
test();
