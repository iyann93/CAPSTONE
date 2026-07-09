const axios = require('axios');
async function testLogin() {
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
      email: 'budi.admin',
      password: 'password123'
    });
    console.log('Login success:', res.data.message);
  } catch (err) {
    console.error('Login error:', err.response ? err.response.data : err.message);
  }
}
testLogin();
