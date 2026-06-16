require('dotenv').config();
const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'budi.admin@siakad.id',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;

    const rolesRes = await axios.get('http://localhost:5000/api/v1/system/roles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Roles:', rolesRes.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
