const axios = require('axios');

async function test() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: '197503122005012003',
      password: 'password123'
    });
    const token = loginRes.data.data.token;
    console.log("Logged in!");

    // 2. Fetch kelas to find 'Kelas IX'
    const kelasRes = await axios.get('http://localhost:5000/api/v1/kelas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const kelas = kelasRes.data.data.find(k => k.nama_kelas === 'Kelas IX');
    console.log("Kelas:", kelas.id);

    // 3. Fetch siswa for this class
    const siswaRes = await axios.get('http://localhost:5000/api/v1/siswa', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const siswa = siswaRes.data.data.filter(s => s.kelas_id === kelas.id);
    if (!siswa.length) return console.log("No siswa");
    console.log("Found", siswa.length, "siswa");

    // 4. Fetch jadwal for this class
    const jadwalRes = await axios.get('http://localhost:5000/api/v1/jadwal-pelajaran', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const jadwal = jadwalRes.data.data.find(j => j.kelas_id === kelas.id);
    if (!jadwal) return console.log("No jadwal for this class");
    console.log("Jadwal ID:", jadwal.id);

    // 5. Build payload
    const payload = siswa.map(s => ({
      siswaId: s.id,
      jadwalId: jadwal.id,
      tanggal: '2026-07-05',
      status: 'Hadir',
      keterangan: ''
    }));

    // 6. Post absensi
    console.log("Posting absensi...");
    await axios.post('http://localhost:5000/api/v1/absensi', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success!");

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}
test();
