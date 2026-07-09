const axios = require('axios');
const fs = require('fs');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email: 'admin_tu@example.com', password: 'password123' });
    const token = res.data.data.token;
    console.log("Logged in Admin TU");

    const getRes = await axios.get('http://localhost:5000/api/v1/jadwal-pelajaran?limit=1', { headers: { Authorization: 'Bearer ' + token } });
    if (getRes.data.data.length === 0) {
      console.log('No jadwal found to test delete.');
      return;
    }
    const id = getRes.data.data[0].id;
    console.log("Found ID:", id);

    const delRes = await axios.delete('http://localhost:5000/api/v1/jadwal-pelajaran/' + id, { headers: { Authorization: 'Bearer ' + token } });
    console.log("SUCCESS:", JSON.stringify(delRes.data));
  } catch(e) {
    console.log("ERROR:", e.response ? JSON.stringify(e.response.data) : e.message);
  }
}
test();
