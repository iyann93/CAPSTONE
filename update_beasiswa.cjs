const fs = require('fs');

const dashboardPath = './src/pages/dashboards/BendaharaDashboard.jsx';
let dashContent = fs.readFileSync(dashboardPath, 'utf8');

// 1. Change title
dashContent = dashContent.replace(
  /<h2 className="text-xl font-bold text-gray-800">Beasiswa & Potongan<\/h2>/g,
  '<h2 className="text-xl font-bold text-gray-800">Beasiswa</h2>'
);

// 2. Change mock data
const oldArray = `                {[
                  { title: "Beasiswa Prestasi Akademik", subtitle: "2025/2026", type: "Beasiswa", amount: "100%", status: "Aktif", users: "12 siswa", typeColor: "blue" },
                  { title: "Beasiswa Yayasan Peduli", subtitle: "2025/2026", type: "Beasiswa", amount: "50%", status: "Aktif", users: "24 siswa", typeColor: "blue" },
                  { title: "Potongan Anak Guru", subtitle: "Setiap Bulan", type: "Potongan", amount: "Rp 100.000", status: "Aktif", users: "8 siswa", typeColor: "orange" },
                  { title: "Potongan Kakak-Adik", subtitle: "Setiap Bulan", type: "Potongan", amount: "25%", status: "Aktif", users: "16 siswa", typeColor: "orange" },
                  { title: "Beasiswa Dhuafa", subtitle: "2025/2026", type: "Beasiswa", amount: "75%", status: "Aktif", users: "18 siswa", typeColor: "blue" },
                  { title: "Subsidi Bencana Alam", subtitle: "Jan-Mar 2025", type: "Potongan", amount: "Rp 150.000", status: "Non-Aktif", users: "3 siswa", typeColor: "orange" }
                ].map((item, i) => (`

const newArray = `                {[
                  { title: "Beasiswa Prestasi Akademik", subtitle: "2025/2026", type: "Beasiswa", amount: "100%", status: "Aktif", users: "12 siswa", typeColor: "blue" },
                  { title: "Beasiswa dari Lazismu", subtitle: "2025/2026", type: "Beasiswa", amount: "50%", status: "Aktif", users: "24 siswa", typeColor: "blue" },
                  { title: "Beasiswa Tahridz Al-Qur'an", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "100%", status: "Aktif", users: "8 siswa", typeColor: "blue" },
                  { title: "Beasiswa Prestasi Non-Akademik", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "25%", status: "Aktif", users: "16 siswa", typeColor: "blue" },
                  { title: "Beasiswa Tahfiz Quran", subtitle: "2025/2026", type: "Beasiswa", amount: "75%", status: "Aktif", users: "18 siswa", typeColor: "blue" },
                  { title: "Beasiswa Penyarikatan Muhammadiyah", subtitle: "2025/2026", type: "Beasiswa", amount: "Rp 150.000", status: "Aktif", users: "3 siswa", typeColor: "blue" }
                ].map((item, i) => (`

dashContent = dashContent.replace(oldArray, newArray);

fs.writeFileSync(dashboardPath, dashContent);
console.log("SUCCESS");
