const axios = require('axios');

async function testGet() {
  try {
    const login = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'dr.wahyu@sekolah.id',
      password: 'password123'
    });
    const token = login.data?.data?.token;
    
    const res = await axios.get('http://localhost:5000/api/v1/kelulusan', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Success length:', res.data?.data?.length);
    console.log('First item:', JSON.stringify(res.data?.data?.[0], null, 2));
  } catch(e) {
    console.log('Error:', e.response?.data || e.message);
  }
}

testGet();
