const axios = require('axios');

async function test() {
  try {
    const tagihanData = await axios.get('http://localhost:5000/finance/spp?limit=5000').then(r => r.data.data);
    const pembayaranData = await axios.get('http://localhost:5000/finance/pembayaran').then(r => r.data.data);

    const tagihan = Array.isArray(tagihanData) ? tagihanData : [];
    const pembayaran = Array.isArray(pembayaranData) ? pembayaranData : [];

    let totalTagihan = 0;
    let terbayar = 0;
    let tunggakan = 0;
    let countVerifikasi = 0;
    let countLunas = 0;
    let countBelum = 0;

    const tunggakanPerKelas = {
      VII: { count: 0, nominal: 0 },
      VIII: { count: 0, nominal: 0 },
      IX: { count: 0, nominal: 0 },
    };

    tagihan.forEach(t => {
      const nom = Number(t.nominal_akhir || t.nominal || 0);
      totalTagihan += nom;

      const kls = String(t.nama_kelas || t.kelas || "").toUpperCase();
      let tingkat = "Lainnya";
      if (kls.includes("VII") && !kls.includes("VIII")) tingkat = "VII";
      else if (kls.includes("VIII")) tingkat = "VIII";
      else if (kls.includes("IX")) tingkat = "IX";

      if (t.status === 'menunggu_konfirmasi') {
        countVerifikasi++;
        tunggakan += nom;
        countBelum++;
        if (tunggakanPerKelas[tingkat]) {
          tunggakanPerKelas[tingkat].count++;
          tunggakanPerKelas[tingkat].nominal += nom;
        }
      } else if (t.status === 'lunas' || t.status === 'Lunas') {
        terbayar += nom;
        countLunas++;
      } else {
        tunggakan += nom;
        countBelum++;
        if (tunggakanPerKelas[tingkat]) {
          tunggakanPerKelas[tingkat].count++;
          tunggakanPerKelas[tingkat].nominal += nom;
        }
      }
    });

    console.log("Total Tagihan:", totalTagihan);
    console.log("Terbayar:", terbayar);
    console.log("Tunggakan:", tunggakan);
    console.log("Count Lunas:", countLunas);
    console.log("Count Belum:", countBelum);
    console.log("Tunggakan Per Kelas:", tunggakanPerKelas);

  } catch (e) {
    console.error(e);
  }
}

test();
