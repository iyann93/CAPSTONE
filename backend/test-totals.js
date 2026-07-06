const axios = require('axios');

async function testTotals() {
  try {
    const ops = await axios.get('http://localhost:5000/finance/operasional').then(r => r.data.data);
    const beasiswa = await axios.get('http://localhost:5000/finance/beasiswa').then(r => r.data.data);
    const beasiswaDana = await axios.get('http://localhost:5000/finance/beasiswa/dana').then(r => r.data.data);
    const bayar = await axios.get('http://localhost:5000/finance/pembayaran').then(r => r.data.data);
    const slips = await axios.get('http://localhost:5000/payroll/slip?limit=1000&status=dibayar').then(r => r.data.data);

    let pemasukan = 0;
    let pengeluaran = 0;
    
    let opIn = 0, opOut = 0;
    if (ops) {
      ops.forEach(o => {
        if (o.tipe === 'pemasukan') { opIn += Number(o.nominal); pemasukan += Number(o.nominal); }
        if (o.tipe === 'pengeluaran') { opOut += Number(o.nominal); pengeluaran += Number(o.nominal); }
      });
    }

    let danaIn = 0;
    if (beasiswaDana) {
      beasiswaDana.forEach(b => {
        danaIn += Number(b.nominal); pemasukan += Number(b.nominal);
      });
    }

    let sppIn = 0;
    if (bayar) {
      bayar.forEach(b => {
        sppIn += Number(b.jumlah_bayar || b.nominal_dibayar || b.nominal || 0); pemasukan += Number(b.jumlah_bayar || b.nominal_dibayar || b.nominal || 0);
      });
    }

    let gajiOut = 0;
    if (slips) {
      slips.forEach(s => {
        gajiOut += Number(s.gaji_bersih || 0); pengeluaran += Number(s.gaji_bersih || 0);
      });
    }

    let bOut = 0;
    if (beasiswa) {
      beasiswa.forEach(p => {
        if (p.status === 'Aktif') {
           const amt = Number(String(p.amount || '0').replace(/[^0-9]/g, ''));
           (p.penerima || []).forEach(r => {
             const nom = Number(r.nominal || amt);
             bOut += nom; pengeluaran += nom;
           });
        }
      });
    }

    console.log("=== DB TOTALS ===");
    console.log("Operasional Masuk:", opIn);
    console.log("Dana Beasiswa Masuk:", danaIn);
    console.log("SPP Masuk:", sppIn);
    console.log("--> TOTAL PEMASUKAN:", pemasukan);
    
    console.log("Operasional Keluar:", opOut);
    console.log("Gaji Keluar:", gajiOut);
    console.log("Beasiswa Keluar:", bOut);
    console.log("--> TOTAL PENGELUARAN:", pengeluaran);
  } catch (e) {
    console.error(e.message);
  }
}

testTotals();
