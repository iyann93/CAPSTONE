const fs = require('fs');

const dashboardPath = './src/pages/dashboards/BendaharaDashboard.jsx';
let dashContent = fs.readFileSync(dashboardPath, 'utf8');

let lines = dashContent.split('\n');

lines[1454] = `                  { title: "Beasiswa Prestasi Akademik", subtitle: "2025/2026", type: "Beasiswa", amount: "100%", status: "Aktif", users: "12 siswa", typeColor: "blue" },`;
lines[1455] = `                  { title: "Beasiswa dari Lazismu", subtitle: "2025/2026", type: "Beasiswa", amount: "50%", status: "Aktif", users: "24 siswa", typeColor: "blue" },`;
lines[1456] = `                  { title: "Beasiswa Tahridz Al-Qur'an", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "100%", status: "Aktif", users: "8 siswa", typeColor: "blue" },`;
lines[1457] = `                  { title: "Beasiswa Prestasi Non-Akademik", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "25%", status: "Aktif", users: "16 siswa", typeColor: "blue" },`;
lines[1458] = `                  { title: "Beasiswa Tahfiz Quran", subtitle: "2025/2026", type: "Beasiswa", amount: "75%", status: "Aktif", users: "18 siswa", typeColor: "blue" },`;
lines[1459] = `                  { title: "Beasiswa Penyarikatan Muhammadiyah", subtitle: "2025/2026", type: "Beasiswa", amount: "Rp 150.000", status: "Aktif", users: "3 siswa", typeColor: "blue" }`;

fs.writeFileSync(dashboardPath, lines.join('\n'));
console.log("SUCCESS");
