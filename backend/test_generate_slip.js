const http = require('http');

const loginPayload = JSON.stringify({ email: 'siti.keuangan@siakad.id', password: 'password123' });

const loginReq = http.request({
  hostname: 'localhost', port: 5000,
  path: '/api/v1/auth/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const token = parsed?.data?.accessToken;
    if (!token) { console.error('Login failed:', data); return; }
    console.log('Login OK');

    // Test generate slip for Drs. Bambang Sudirman (Kepala Sekolah)
    const payload = JSON.stringify({
      userId: '7ff844aa-7e78-4cff-9387-47e17c31b02f',
      bulan: 6,
      tahun: 2026,
      hariHadir: 22,
      jumlahAlpha: 0,
      jamLembur: 0
    });

    const req2 = http.request({
      hostname: 'localhost', port: 5000,
      path: '/api/v1/payroll/generate', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Authorization': `Bearer ${token}` }
    }, (res2) => {
      let d2 = '';
      res2.on('data', c => d2 += c);
      res2.on('end', () => {
        console.log(`\nGenerate slip response (status ${res2.statusCode}):`);
        const r = JSON.parse(d2);
        if (r.success) {
          console.log('SUCCESS! Slip ID:', r.data?.id);
          console.log('Gaji Pokok:', r.data?.gaji_pokok);
          console.log('Total Tunjangan:', r.data?.total_tunjangan);
          console.log('Total Potongan:', r.data?.total_potongan);
          console.log('Gaji Bersih:', r.data?.gaji_bersih);
        } else {
          console.log('FAILED:', r.message);
        }
      });
    });
    req2.write(payload);
    req2.end();
  });
});
loginReq.write(loginPayload);
loginReq.end();
