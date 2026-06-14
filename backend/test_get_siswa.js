const axios = require('axios');
require('dotenv').config();

async function testSiswa() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'siti.keuangan@siakad.id',
      password: 'password123'
    });
    
    const token = loginRes.data.data.accessToken;
    console.log('Login success');
    
    const siswaRes = await axios.get('http://localhost:5000/api/v1/siswa', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Siswa count:', siswaRes.data.data.length);
    console.log('Siswa first:', siswaRes.data.data[0]);
  } catch (err) {
    console.error('Error:', err.response?.status, err.response?.data);
  }
}
testSiswa();
