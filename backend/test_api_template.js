const http = require('http');

// First login to get a token
const loginPayload = JSON.stringify({ email: 'siti.keuangan@siakad.id', password: 'password123' });

const loginReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const token = parsed?.data?.accessToken;
    if (!token) { console.error('Login failed:', data); return; }
    console.log('Login OK, token obtained');
    
    // Now test upsert template with komponen_id (frontend format)
    const payload = JSON.stringify({
      jabatan_id: '656e201f-2995-43a5-a95a-895d6ebbad28', // Guru
      komponen_id: '00000009-0000-0000-0000-000000000002', // Tunjangan Jabatan
      nominal: 800000
    });
    
    const req2 = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/payroll/templates',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Authorization': `Bearer ${token}` }
    }, (res2) => {
      let d2 = '';
      res2.on('data', c => d2 += c);
      res2.on('end', () => { console.log('Upsert template response:', d2); });
    });
    req2.write(payload);
    req2.end();
  });
});
loginReq.write(loginPayload);
loginReq.end();
