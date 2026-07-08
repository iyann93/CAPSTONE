const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const baseUrl = 'http://127.0.0.1:5000/api/v1';
let token = '';

async function login() {
  try {
    const res = await axios.post(`${baseUrl}/auth/login`, { email: 'admin', password: 'admin123' });
    token = res.data.data.token;
    console.log('Login success');
  } catch (e) {
    console.log('Login failed', e.response?.data || e.message);
  }
}

async function apiCall(method, endpoint, data = null) {
  try {
    const res = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
      data,
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true
    });
    return { status: res.status, data: res.data };
  } catch (e) {
    return { status: 500, error: e.message };
  }
}

async function runTests() {
  await login();
  
  const endpoints = ['/kurikulum', '/tahun-ajaran', '/semester', '/mapel', '/guru', '/kelas'];
  
  console.log('--- GET TESTS ---');
  for (const ep of endpoints) {
    const res = await apiCall('GET', ep);
    console.log(`GET ${ep}: ${res.status}`);
  }
  
  console.log('\n--- POST/PUT/DELETE KURIKULUM ---');
  // TA is needed for kurikulum
  const tas = await apiCall('GET', '/tahun-ajaran');
  const taId = tas.data?.data?.[0]?.id;
  
  let kId = null;
  if (taId) {
    const createK = await apiCall('POST', '/kurikulum', {
      kode_kurikulum: 'KUR-TEST',
      nama_kurikulum: 'Kurikulum Test',
      tahun_ajaran_id: taId,
      status: 'Draft'
    });
    console.log(`POST /kurikulum: ${createK.status}`);
    kId = createK.data?.data?.id;
    
    if (kId) {
      const updateK = await apiCall('PUT', `/kurikulum/${kId}`, {
        kode_kurikulum: 'KUR-TEST-2',
        nama_kurikulum: 'Kurikulum Test Updated',
        tahun_ajaran_id: taId,
        status: 'Aktif'
      });
      console.log(`PUT /kurikulum: ${updateK.status}`);
      
      const delK = await apiCall('DELETE', `/kurikulum/${kId}`);
      console.log(`DELETE /kurikulum: ${delK.status}`);
    }
  }
  
  console.log('\n--- POST/PUT/DELETE SEMESTER ---');
  if (taId) {
    const createS = await apiCall('POST', '/semester', {
      nama: 'Semester Test',
      tahun_ajaran_id: taId,
      tanggal_mulai: '2026-07-01',
      tanggal_selesai: '2026-12-31'
    });
    console.log(`POST /semester: ${createS.status}`);
    const sId = createS.data?.data?.id;
    
    if (sId) {
      const updateS = await apiCall('PUT', `/semester/${sId}`, {
        nama: 'Semester Test Updated',
        tahun_ajaran_id: taId,
        tanggal_mulai: '2026-07-01',
        tanggal_selesai: '2026-12-31'
      });
      console.log(`PUT /semester: ${updateS.status}`);
      
      const delS = await apiCall('DELETE', `/semester/${sId}`);
      console.log(`DELETE /semester: ${delS.status}`);
    }
  }

  // Same logic can be tested manually. We just want to check if the routes return 20x or appropriate errors.
}

runTests();
