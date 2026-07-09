const fs = require('fs');
const filePath = 'd:\\SEMESTER 6\\capstone SIA\\CAPSTONE\\src\\pages\\dashboards\\BendaharaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Clear programList
content = content.replace(
  /const \[programList, setProgramList\] = useState\(\[[\s\S]*?\n\s*\]\);/,
  'const [programList, setProgramList] = useState([]);'
);

// 2. Clear danaBeasiswaList
content = content.replace(
  /const \[danaBeasiswaList, setDanaBeasiswaList\] = useState\(\[[\s\S]*?\n\s*\]\);/,
  'const [danaBeasiswaList, setDanaBeasiswaList] = useState([]);'
);

// 3. Ensure handleSaveBeasiswa strictly validates all fields
content = content.replace(
  /if \(!beasiswaForm\.siswaId \|\| !beasiswaForm\.namaBeasiswa \|\| !beasiswaForm\.nominal\) \{/,
  'if (!beasiswaForm.siswaId || !beasiswaForm.namaBeasiswa || !beasiswaForm.nominal || !beasiswaForm.periode || !beasiswaForm.tanggalMulai || !beasiswaForm.tanggalSelesai) {'
);

content = content.replace(
  /triggerToast\("Mohon lengkapi form penerima beasiswa", "error"\);/,
  'triggerToast("Mohon isi seluruh field wajib bertanda *", "error");'
);

// 4. Add <span className="text-red-500">*</span> to all labels in Modal Tambah Penerima
const labels = [
  "Pilih Siswa",
  "Nama Program Beasiswa",
  "Nominal Potongan (Rp)",
  "Periode",
  "Status",
  "Tanggal Mulai",
  "Tanggal Selesai"
];

labels.forEach(lbl => {
  const searchStr = `<label className="block text-sm font-semibold text-gray-700 mb-2">${lbl}</label>`;
  const replaceStr = `<label className="block text-sm font-semibold text-gray-700 mb-2">${lbl} <span className="text-red-500">*</span></label>`;
  content = content.split(searchStr).join(replaceStr);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Data and UI updated successfully');
