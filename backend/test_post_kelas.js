require('dotenv').config();
const axios = require('axios');

async function testPostKelas() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin.tu@siakad.id',
      password: 'password123'
    });
    const token = loginRes.data.data.token;

    const res = await axios.post('http://localhost:5000/api/v1/kelas', {
      nama_kelas: 'X IPA 1 Test',
      tingkat: '10',
      tahun_ajaran: '2025/2026',
      jurusan_id: 'e21a3ed9-3e46-4d9e-95e8-19ffac1dfaf5'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}
testPostKelas();
