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

    // Step 1: Get komponen list to see real IDs
    http.get({
      hostname: 'localhost', port: 5000,
      path: '/api/v1/payroll/komponen',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res2) => {
      let d2 = '';
      res2.on('data', c => d2 += c);
      res2.on('end', () => {
        const komponens = JSON.parse(d2)?.data || [];
        console.log('\nKomponen list from API:');
        komponens.forEach(k => console.log(` - ${k.id} | ${k.nama} | ${k.tipe}`));

        // Step 2: Test override with first real komponen ID
        const firstKomp = komponens[0];
        if (!firstKomp) { console.error('No komponen found!'); return; }

        const payload = JSON.stringify({
          user_id: '7ff844aa-7e78-4cff-9387-47e17c31b02f', // Drs. Bambang Sudirman
          komponen_id: firstKomp.id,  // using komponen_id (frontend format)
          nominal: 3000000
        });

        const req3 = http.request({
          hostname: 'localhost', port: 5000,
          path: '/api/v1/payroll/overrides', method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Authorization': `Bearer ${token}` }
        }, (res3) => {
          let d3 = '';
          res3.on('data', c => d3 += c);
          res3.on('end', () => {
            console.log(`\nUpsert override for "${firstKomp.nama}" (${firstKomp.id}):`);
            console.log(`Status: ${res3.statusCode}`);
            console.log('Response:', d3);
          });
        });
        req3.write(payload);
        req3.end();
      });
    });
  });
});
loginReq.write(loginPayload);
loginReq.end();
