const http = require('http');

// Login dulu
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

    // Test upsert override (format yang dikirim frontend: komponen_id)
    const payload = JSON.stringify({
      user_id: '7ff844aa-7e78-4cff-9387-47e17c31b02f',       // Drs. Bambang Sudirman
      komponen_id: '00000009-0000-0000-0000-000000000002',    // Tunjangan Jabatan
      nominal: 2500000
    });

    const req2 = http.request({
      hostname: 'localhost', port: 5000,
      path: '/api/v1/payroll/overrides', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Authorization': `Bearer ${token}` }
    }, (res2) => {
      let d2 = '';
      res2.on('data', c => d2 += c);
      res2.on('end', () => { console.log('Status:', res2.statusCode); console.log('Response:', d2); });
    });
    req2.write(payload);
    req2.end();
  });
});
loginReq.write(loginPayload);
loginReq.end();
