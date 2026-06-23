require('dotenv').config();
const axios = require('axios');
async function test(){
  // Try all known user emails
  const emails = [
    'admin.tu@siakad.id',
    'siti.keuangan@siakad.id',
    'superadmin@siakad.id',
    'admin@siakad.id',
  ];
  for (const email of emails) {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email, password: 'password123'
      }, { timeout: 10000 });
      console.log('✓ LOGIN OK:', email, '| role:', res.data.data?.user?.role);
    } catch(err) {
      if (err.response) {
        console.log('✗ FAIL:', email, '-', err.response.status, err.response.data?.message);
      } else {
        console.log('✗ NET ERR:', email, '-', err.message);
      }
    }
  }
}
test();
