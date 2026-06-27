'use strict';
require('dotenv').config();
const http = require('http');

// Test: Login sebagai bendahara dulu, lalu coba create beasiswa
const BENDAHARA_EMAIL = 'siti.keuangan@siakad.id';
const SAMPLE_SISWA_ID = '00000005-0000-0000-0000-000000000001'; // Ahmad F

function doRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // 1. Login
  console.log('1. Login sebagai bendahara...');
  const loginRes = await doRequest({
    hostname: 'localhost', port: 5000, path: '/api/v1/auth/login',
    method: 'POST', headers: { 'Content-Type': 'application/json' }
  }, { email: BENDAHARA_EMAIL, password: 'password123' });

  console.log('   Status:', loginRes.status);
  const token = loginRes.body?.data?.accessToken;
  if (!token) {
    console.error('   ❌ Login gagal:', JSON.stringify(loginRes.body));
    // Coba password lain
    const loginRes2 = await doRequest({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/login',
      method: 'POST', headers: { 'Content-Type': 'application/json' }
    }, { email: BENDAHARA_EMAIL, password: 'Password123!' });
    console.log('   Status (password2):', loginRes2.status);
    console.log('   Body:', JSON.stringify(loginRes2.body));
    return;
  }
  console.log('   ✅ Token diperoleh');

  // 2. Coba GET beasiswa
  console.log('\n2. GET /beasiswa...');
  const getRes = await doRequest({
    hostname: 'localhost', port: 5000, path: '/api/v1/beasiswa?limit=5',
    method: 'GET', headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('   Status:', getRes.status);
  console.log('   Body:', JSON.stringify(getRes.body).substring(0, 200));

  // 3. Coba POST beasiswa
  console.log('\n3. POST /beasiswa...');
  const payload = {
    siswaId: SAMPLE_SISWA_ID,
    namaBeasiswa: 'Beasiswa Test',
    nominal: 250000,
    periode: '2025/2026',
    status: 'Aktif',
    tanggalMulai: '2025-07-01',
    tanggalSelesai: '2026-06-30',
  };
  console.log('   Payload:', JSON.stringify(payload));
  const postRes = await doRequest({
    hostname: 'localhost', port: 5000, path: '/api/v1/beasiswa',
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  }, payload);
  console.log('   Status:', postRes.status);
  console.log('   Body:', JSON.stringify(postRes.body));

  if (postRes.status === 201) {
    // Hapus data test
    const delRes = await doRequest({
      hostname: 'localhost', port: 5000, path: `/api/v1/beasiswa/${postRes.body.data?.id}`,
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('\n4. Cleanup DELETE:', delRes.status);
  }
}

main().catch(console.error);
