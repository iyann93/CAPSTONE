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
    
    console.log('Posting to /semester with token...');
    const payloadData = {
      nama: "Ganjil 2025/2026",
      tahunAjaranId: "00000001-0000-0000-0000-000000000001",
      tanggalMulai: "2025-07-15",
      tanggalSelesai: "2025-12-20"
    };
    
    console.log('Request Payload:', payloadData);
    const res = await axios.post(`http://localhost:5000/api/v1/semester`, payloadData, {
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
