const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('https://capstone-production-4ef6.up.railway.app/api/v1/auth/login', {
      email: 'budi.admin@siakad.id',
      password: 'password123'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.message);
    if (err.response) {
      console.error("Response:", err.response.data);
    }
  }
}
run();
