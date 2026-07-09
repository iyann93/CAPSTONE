const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api/v1';

async function generateToken() {
  // Generate a mock token for admin
  return jwt.sign(
    { userId: '4c7cfef9-cd24-4f0e-b830-109dc052d9a3', role: 'Super Admin', is_active: true },
    process.env.JWT_ACCESS_SECRET || 'your_super_secret_access_key_change_in_production',
    { expiresIn: '1h' }
  );
}

async function getMasterData(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const resKelas = await axios.get(`${API_URL}/kelas`, { headers });
  const resMapel = await axios.get(`${API_URL}/mapel`, { headers });
  const resGuru = await axios.get(`${API_URL}/guru`, { headers });
  const resSemester = await axios.get(`${API_URL}/semester`, { headers });
  return {
    kelasId: resKelas.data.data[0]?.id,
    mapelId: resMapel.data.data[0]?.id,
    guruId: resGuru.data.data[0]?.id,
    semesterId: resSemester.data.data[0]?.id
  };
}

async function runTest() {
  console.log('--- TEST CRUD JADWAL PELAJARAN ---');
  try {
    const token = await generateToken();
    const headers = { Authorization: `Bearer ${token}` };

    const { kelasId, mapelId, guruId, semesterId } = await getMasterData(token);
    
    if (!kelasId || !mapelId || !guruId || !semesterId) {
       console.log('Master data tidak lengkap, test dibatalkan.');
       return;
    }

    const payload = {
      kelasId,
      mapelId,
      guruId,
      semesterId,
      hari: 1, // Senin
      jamMulai: '07:00',
      jamSelesai: '08:30'
    };

    console.log('1. POST /jadwal-pelajaran...');
    const postRes = await axios.post(`${API_URL}/jadwal-pelajaran`, payload, { headers });
    console.log('POST Berhasil:', postRes.data.message);
    const newId = postRes.data.data.id;

    console.log('2. GET /jadwal-pelajaran...');
    const getRes = await axios.get(`${API_URL}/jadwal-pelajaran`, { headers });
    const isPresent = getRes.data.data.some(j => j.id === newId);
    console.log('GET Berhasil. Jadwal tersimpan:', isPresent);

    console.log('3. PUT /jadwal-pelajaran/:id...');
    const putRes = await axios.put(`${API_URL}/jadwal-pelajaran/${newId}`, {
      ...payload,
      jamMulai: '08:30',
      jamSelesai: '10:00'
    }, { headers });
    console.log('PUT Berhasil:', putRes.data.message);

    console.log('4. DELETE /jadwal-pelajaran/:id...');
    const delRes = await axios.delete(`${API_URL}/jadwal-pelajaran/${newId}`, { headers });
    console.log('DELETE Berhasil:', delRes.data.message);

  } catch (err) {
    console.error('TEST ERROR:', err.response?.data || err.message);
  }
}

runTest();

