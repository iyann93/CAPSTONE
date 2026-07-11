const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  try {
    const loginRes = await axios.post('https://capstone-production-4ef6.up.railway.app/api/v1/auth/login', {
      email: 'budi.admin@siakad.id',
      password: 'password123'
    }, { headers: { Origin: 'https://cp-sia.vercel.app' } });
    const token = loginRes.data.data.accessToken;

    fs.writeFileSync('dummy.pdf', 'dummy content');
    const form = new FormData();
    form.append('file', fs.createReadStream('dummy.pdf'));

    const uploadRes = await axios.post('https://capstone-production-4ef6.up.railway.app/api/v1/system/upload-announcement-file', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
        Origin: 'https://cp-sia.vercel.app'
      }
    });
    console.log("Upload Success:", uploadRes.data);
  } catch (err) {
    console.error("Upload Error:", err.response ? err.response.data : err.message);
  }
}
testUpload();
