const fs = require('fs');
let c = fs.readFileSync('src/utils/financeHelpers.js', 'utf8');

c = c.replace(/\r\n/g, '\n');

const oldBlock = `      if (t.status === 'menunggu_konfirmasi') {
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
    });`;

const newBlock = `      const siswaId = t.nis || t.nama_siswa || t.id_siswa || 'unknown-' + Math.random();
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

const replaced = c.replace(oldBlock, newBlock);
if (replaced === c) {
  console.log('Failed to replace!');
} else {
  fs.writeFileSync('src/utils/financeHelpers.js', replaced, 'utf8');
  console.log('Success');
}
