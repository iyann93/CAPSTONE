const fs = require('fs');
let c = fs.readFileSync('src/utils/financeHelpers.js', 'utf8');

c = c.replace(/\r\n/g, '\n');

const oldBlock = `      const siswaId = t.nis || t.nama_siswa || t.id_siswa || 'unknown-' + Math.random();
      if (!siswaMap[siswaId]) {
         siswaMap[siswaId] = { lunas: true, tingkat, tunggakan: 0 };
      }

      if (t.status === 'menunggu_konfirmasi') {
        countVerifikasi++;
        tunggakan += nom;
        siswaMap[siswaId].lunas = false;
        siswaMap[siswaId].tunggakan += nom;
      } else if (t.status === 'lunas' || t.status === 'Lunas') {
        terbayar += nom;
      } else {
        tunggakan += nom;
        siswaMap[siswaId].lunas = false;
        siswaMap[siswaId].tunggakan += nom;
      }
    });

    Object.values(siswaMap).forEach(s => {
       if (s.lunas) {
         countLunas++;
       } else {
         countBelum++;
         if (tunggakanPerKelas[s.tingkat]) {
           tunggakanPerKelas[s.tingkat].count++;
           tunggakanPerKelas[s.tingkat].nominal += s.tunggakan;
         }
       }
    });`;

const newBlock = `      const siswaId = t.nis || t.nama_siswa || t.id_siswa || 'unknown-' + Math.random();
      if (!siswaMap[siswaId]) {
         siswaMap[siswaId] = { lunas: true, tingkat, nominalBulan: nom };
      }

      if (t.status === 'menunggu_konfirmasi') {
        countVerifikasi++;
        siswaMap[siswaId].lunas = false;
      } else if (t.status === 'lunas' || t.status === 'Lunas') {
        terbayar += nom;
      } else {
        siswaMap[siswaId].lunas = false;
      }
    });

    tunggakan = 0; // reset and calculate based on unique students (1 month basis) to sync with Bendahara
    Object.values(siswaMap).forEach(s => {
       if (s.lunas) {
         countLunas++;
       } else {
         countBelum++;
         tunggakan += s.nominalBulan;
         if (tunggakanPerKelas[s.tingkat]) {
           tunggakanPerKelas[s.tingkat].count++;
           tunggakanPerKelas[s.tingkat].nominal += s.nominalBulan;
         }
       }
    });`;

const replaced = c.replace(oldBlock, newBlock);
if (replaced === c) {
  console.log('Failed to replace!');
} else {
  fs.writeFileSync('src/utils/financeHelpers.js', replaced, 'utf8');
  console.log('Success');
}
