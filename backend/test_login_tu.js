require('dotenv').config();
const axios = require('axios');
async function test(){
  try {
    console.log('Testing login...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin.tu@siakad.id',
      password: 'password123'
    }, { timeout: 15000 });
    console.log('Login result:', JSON.stringify(loginRes.data, null, 2));
  } catch(err) {
    if (err.response) {
      console.log('Login failed:', err.response.status, JSON.stringify(err.response.data));
    } else {
      console.log('Network error:', err.message);
    }
  }
}
test();
