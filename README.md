# Sistem Informasi Akademik (SIA) - MBS Yogyakarta

Sistem Informasi Akademik (SIA) ini adalah aplikasi berbasis web yang dirancang khusus untuk mempermudah dan mendigitalkan pengelolaan kegiatan akademik di sekolah. Aplikasi ini dibangun dengan antarmuka yang modern, responsif, dan ramah pengguna untuk menghubungkan berbagai pihak di lingkungan sekolah.

## 🎯 Tujuan Proyek
Proyek ini bertujuan untuk menyediakan sebuah platform terpusat dalam memonitoring, mengelola, dan mengevaluasi seluruh proses akademik, sehingga pihak sekolah, guru, serta orang tua dapat berkolaborasi secara transparan dan efisien.

## 👥 Hak Akses (Roles)
Sistem ini mendukung berbagai peran pengguna dengan hak akses yang disesuaikan dengan tanggung jawab masing-masing:
- **Super Admin** : Memiliki kontrol penuh terhadap sistem, termasuk manajemen pengguna dan pengaturan utama.
- **Admin TU (Tata Usaha)** : Bertanggung jawab atas administrasi sekolah seperti data siswa, guru, kelas, mata pelajaran, dan pembuatan pengumuman resmi.
- **Kepala Sekolah** : Dapat melihat statistik keseluruhan, laporan akademik, serta menyetujui dokumen penting.
- **Wali Kelas** : Memantau absensi kelas, nilai, catatan kedisiplinan, serta mengelola kenaikan/kelulusan siswa di kelasnya.
- **Guru** : Dapat melihat jadwal mengajar, melakukan absensi, serta memberikan nilai kepada siswa.
- **Orang Tua & Siswa** : Memiliki akses portal untuk melihat pengumuman, nilai/rapor akademik, jadwal pelajaran, dan riwayat absensi.

## ✨ Fitur Utama (Akademik)

1. **Dashboard Role-Based**
   - Tampilan antarmuka yang disesuaikan secara khusus untuk setiap jenis peran (Role) agar fokus pada informasi yang paling dibutuhkan.

2. **Manajemen Data Master**
   - **Data Siswa & Guru:** Pengelolaan data induk siswa dan guru secara lengkap.
   - **Data Kelas & Mata Pelajaran:** Pengaturan kelas, rombongan belajar, dan pengalokasian guru mata pelajaran.

3. **Jadwal Pelajaran**
   - Pembuatan dan pendistribusian jadwal pelajaran mingguan yang terintegrasi langsung dengan portal guru dan siswa.

4. **Penilaian & E-Rapor**
   - Penginputan nilai tugas, UTS, dan UAS oleh guru.
   - Pembuatan rapor akhir semester secara otomatis yang dapat diunduh (PDF) oleh orang tua/siswa.

5. **Manajemen Absensi**
   - Pencatatan kehadiran siswa per sesi kelas.
   - Fitur rekap absensi otomatis yang bisa dipantau langsung oleh wali kelas dan orang tua.

6. **Pengumuman Sekolah**
   - Sistem publikasi pengumuman (informasi akademik, jadwal ujian, dll) lengkap dengan lampiran dokumen (PDF) dan label tingkat kepentingan.

7. **Kenaikan Kelas & Kelulusan**
   - Modul khusus untuk memproses penentuan kenaikan tingkat atau kelulusan siswa berdasarkan kriteria dan rekap nilai yang ada.

## 🛠 Teknologi yang Digunakan
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js (Railway)
- **Database:** PostgreSQL (Supabase)
- **Deployment:** Vercel (Frontend), Railway (Backend)
