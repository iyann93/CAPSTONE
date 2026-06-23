const axios = require('axios');
async function test(){
  const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
    email: 'siti.keuangan@siakad.id',
    password: 'password123'
  });
  const token = loginRes.data.data.accessToken;
  const siswaRes = await axios.get('http://localhost:5000/api/v1/siswa', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(siswaRes.data.data.map(s => s.nama_lengkap));
}
test();
