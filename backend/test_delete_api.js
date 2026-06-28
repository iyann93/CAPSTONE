const axios = require('axios');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:5000/auth/login', {
      username: 'bendahara1', // Assuming Bendahara login
      password: 'password123'
    });
    const token = loginRes.data.data.token;

    const res = await axios.delete('http://localhost:5000/finance/spp/batal-bulanan', {
      headers: { Authorization: `Bearer ${token}` },
      data: { bulan: 8, tahun: 2026 }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
run();
