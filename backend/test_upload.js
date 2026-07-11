const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  try {
    // 1. Login
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'budi.admin@siakad.id',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;

    // 2. Create dummy pdf
    fs.writeFileSync('dummy.pdf', 'dummy content');

    // 3. Upload
    const form = new FormData();
    form.append('file', fs.createReadStream('dummy.pdf'));

    const uploadRes = await axios.post('http://localhost:5000/api/v1/system/upload-announcement-file', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Upload Success:", uploadRes.data);
  } catch (err) {
    console.error("Upload Error:", err.response ? err.response.data : err.message);
  }
}

testUpload();
