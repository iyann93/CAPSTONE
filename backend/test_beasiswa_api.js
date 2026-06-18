'use strict';
require('dotenv').config();
const axios = require('axios');

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api/v1`;

async function main() {
  // 1. Login dulu
  console.log('1. Login...');
  let token;
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.TEST_EMAIL || 'bendahara@school.com',
      password: process.env.TEST_PASSWORD || 'password123'
    });
    token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken;
    if (!token) {
      // Try to get from cookie or different structure
      console.log('Login response:', JSON.stringify(loginRes.data, null, 2));
    }
    console.log('Login berhasil, token:', token ? token.substring(0,30) + '...' : 'NOT FOUND');
  } catch (e) {
    console.error('Login gagal:', e.response?.data || e.message);
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  // 2. GET beasiswa
  console.log('\n2. GET /beasiswa...');
  try {
    const res = await axios.get(`${BASE_URL}/beasiswa`, { headers });
    console.log('GET beasiswa OK, total:', res.data?.data?.total || res.data?.data?.length || JSON.stringify(res.data?.data).substring(0, 100));
  } catch (e) {
    console.error('GET beasiswa gagal:', e.response?.status, e.response?.data || e.message);
  }

  // 3. GET siswa untuk cari ID valid
  console.log('\n3. GET /siswa untuk cari ID...');
  let siswaId;
  try {
    const res = await axios.get(`${BASE_URL}/siswa?limit=1`, { headers });
    const rows = res.data?.data?.rows || res.data?.data || [];
    siswaId = rows[0]?.id;
    console.log('Siswa pertama ID:', siswaId, '| Nama:', rows[0]?.nama_lengkap);
  } catch (e) {
    console.error('GET siswa gagal:', e.response?.status, e.response?.data || e.message);
    return;
  }

  if (!siswaId) {
    console.log('Tidak ada siswa ditemukan, skip test create beasiswa');
    return;
  }

  // 4. POST beasiswa
  console.log('\n4. POST /beasiswa...');
  const payload = {
    siswaId,
    namaBeasiswa: 'Test Beasiswa Script',
    nominal: 500000,
    periode: '2025/2026',
    status: 'Aktif',
    tanggalMulai: '2025-07-01',
    tanggalSelesai: '2026-06-30'
  };
  console.log('Payload:', payload);
  try {
    const res = await axios.post(`${BASE_URL}/beasiswa`, payload, { headers });
    console.log('POST beasiswa OK:', JSON.stringify(res.data?.data, null, 2));

    // Cleanup: hapus data test
    const createdId = res.data?.data?.id;
    if (createdId) {
      await axios.delete(`${BASE_URL}/beasiswa/${createdId}`, { headers });
      console.log('\nCleanup: data test berhasil dihapus');
    }
  } catch (e) {
    console.error('POST beasiswa GAGAL:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
  }
}

main().catch(console.error);
