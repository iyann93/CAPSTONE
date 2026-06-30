import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const mockNotifications = [
  { id: 1, type: "tagihan", title: "Tagihan SPP Bulan Juli", desc: "Jatuh tempo: 10 Juli 2024 · Rp 500.000", time: "2 jam lalu", read: false },
  { id: 2, type: "nilai", title: "Rapor Semester Genap Tersedia", desc: "Rapor semester genap 2023/2024 sudah bisa diunduh", time: "1 hari lalu", read: false },
  { id: 3, type: "pengumuman", title: "Pengumuman Libur Akhir Tahun", desc: "Sekolah libur tanggal 20-31 Desember 2024", time: "3 hari lalu", read: true },
];

const mockAnnouncements = [
  { id: 1, title: "Jadwal Ujian Akhir Semester", date: "20 Jun 2024", category: "Akademik", penting: true },
  { id: 2, title: "Pentas Seni Akhir Tahun 2024", date: "15 Jun 2024", category: "Kegiatan", penting: false },
  { id: 3, title: "Pengumuman Penerimaan Siswa Baru", date: "10 Jun 2024", category: "Penerimaan", penting: false },
];

const OrangTuaHome = ({ user, onNavigate }) => {
  const [showAllNotif, setShowAllNotif] = useState(false);
  console.log("OrangTuaHome user prop:", user);

  const studentData = {
    nama: user?.anak?.nama || "Siswa",
    kelas: user?.anak?.kelas || "-",
    nisn: user?.anak?.nisn || "-",
    tahunAjaran: "2025/2026",
    wali: user?.anak?.wali ? `Bapak/Ibu ${user.anak.wali}` : "Ibu Dewi Rahayu, S.Pd",
    avatar: user?.anak?.nama ? user.anak.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "SW",
  };

  const [akademikStats, setAkademikStats] = useState({
    rataRata: "-",
    rankKelas: "-",
    kehadiran: "-",
    semester: "Ganjil 2025/2026",
    totalSiswaKelas: "-",
  });

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const res = await api.get("/siswa");
        const allStudents = (res.data.data || []).map((s, index) => ({
          ...s,
          nilaiRataRata: 80 + (index % 15),
          kehadiran: 90 + (index % 10),
        }));

        // Prioritas pencarian: id (UUID) > nis > nisn > nama_lengkap
        const anakId   = user?.anak?.id;
        const anakNis  = user?.anak?.nis;
        const anakNisn = user?.anak?.nisn;
        const anakNama = user?.anak?.nama;

        const currentStudent = allStudents.find(
          (s) =>
            (anakId   && s.id      === anakId)   ||
            (anakNis  && s.nis     === anakNis)  ||
            (anakNisn && s.nisn    === anakNisn) ||
            (anakNama && s.nama_lengkap === anakNama)
        );

        if (currentStudent) {
          // Hitung peringkat di antara teman sekelas berdasarkan nilaiRataRata
          const classmates = allStudents.filter(
            (s) => s.kelas_id === currentStudent.kelas_id
          );
          const sortedClassmates = [...classmates].sort(
            (a, b) => b.nilaiRataRata - a.nilaiRataRata
          );
          const rank =
            sortedClassmates.findIndex((s) => s.id === currentStudent.id) + 1;

          setAkademikStats({
            rataRata: currentStudent.nilaiRataRata,
            rankKelas: rank > 0 ? rank : "-",
            kehadiran: currentStudent.kehadiran,
            semester: "Ganjil 2025/2026",
            totalSiswaKelas: classmates.length > 0 ? classmates.length : "-",
          });
        }
      } catch (err) {
        console.error("Gagal memuat data akademik siswa:", err);
      }
    };

    if (user) fetchStudentStats();
  }, [user]);

  const tagihanInfo = {
    bulan: "Januari 2026",
    nominal: "Rp 1.250.000",
    jatuhTempo: "10 Januari 2026",
    status: "Belum Lunas",
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Selamat Datang! 👋</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {user?.fullName || "Bapak/Ibu Orang Tua"} · Pantau perkembangan putra/putri Anda
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-400">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          Senin, 23 Juni 2024
        </div>
      </div>

      {/* Student Card */}
      <div className="bg-gradient-to-r from-[#1A3D63] to-[#2A5F8F] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-[20px] font-bold border-2 border-white/30">
              {studentData.avatar}
            </div>
            <div>
              <p className="text-blue-200 text-[12px] font-semibold uppercase tracking-wider mb-0.5">Data Siswa</p>
              <h2 className="text-[20px] font-bold">{studentData.nama}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[12px] font-semibold">{studentData.kelas}</span>
                <span className="text-blue-200 text-[12px]">NISN: {studentData.nisn}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
            <div>
              <p className="text-blue-200 text-[11px]">Tahun Ajaran</p>
              <p className="text-[14px] font-bold">{studentData.tahunAjaran}</p>
            </div>
            <div>
              <p className="text-blue-200 text-[11px]">Wali Kelas</p>
              <p className="text-[14px] font-bold truncate max-w-[140px]">{studentData.wali}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Rata-rata Nilai",
            val: akademikStats.rataRata,
            unit: "",
            sub: "Semester Genap 2023/2024",
            color: "text-blue-600",
            bg: "bg-blue-50",
            icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z",
          },
          {
            label: "Peringkat Kelas",
            val: akademikStats.rankKelas !== "-" ? `#${akademikStats.rankKelas}` : "-",
            unit: "",
            sub: akademikStats.totalSiswaKelas !== "-" ? `dari ${akademikStats.totalSiswaKelas} siswa` : "dari - siswa",
            color: "text-green-600",
            bg: "bg-green-50",
            icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
          },
          {
            label: "Kehadiran",
            val: akademikStats.kehadiran !== "-" ? `${akademikStats.kehadiran}%` : "-",
            unit: "",
            sub: "Tingkat kehadiran",
            color: "text-purple-600",
            bg: "bg-purple-50",
            icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
          },
          {
            label: "Status Tagihan",
            val: tagihanInfo.status,
            unit: "",
            sub: tagihanInfo.nominal + " · " + tagihanInfo.bulan,
            color: "text-amber-600",
            bg: "bg-amber-50",
            icon: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z",
          },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={card.color}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon}/>
                </svg>
              </div>
            </div>
            <p className="text-[26px] font-black text-[#1e293b]">{card.val}</p>
            <p className="text-[12px] text-gray-500 font-medium mt-0.5">{card.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Notifikasi */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-gray-800">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">{unreadCount}</span>
              )}
            </div>
            <button onClick={() => setShowAllNotif(!showAllNotif)} className="text-[12px] text-[#2A4365] font-semibold hover:underline">
              {showAllNotif ? "Sembunyikan" : "Lihat Semua"}
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {(showAllNotif ? mockNotifications : mockNotifications.slice(0, 2)).map((notif) => (
              <div key={notif.id} className={`px-5 py-4 flex items-start gap-3 ${!notif.read ? "bg-blue-50/40" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notif.type === "tagihan" ? "bg-amber-100" : notif.type === "nilai" ? "bg-green-100" : "bg-blue-100"
                }`}>
                  {notif.type === "tagihan" && (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/></svg>
                  )}
                  {notif.type === "nilai" && (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
                  )}
                  {notif.type === "pengumuman" && (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832"/></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold ${!notif.read ? "text-gray-900" : "text-gray-600"}`}>{notif.title}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                  <p className="text-[11px] text-gray-300 mt-1">{notif.time}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"/>}
              </div>
            ))}
          </div>
        </div>

        {/* Tagihan Terdekat */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-gray-50">
            <h3 className="text-[15px] font-bold text-gray-800">Tagihan Terdekat</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-amber-700">SPP {tagihanInfo.bulan}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">Belum Lunas</span>
              </div>
              <p className="text-[22px] font-black text-amber-600">{tagihanInfo.nominal}</p>
              <div className="flex items-center gap-1 mt-2 text-[12px] text-amber-600">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Jatuh tempo: {tagihanInfo.jatuhTempo}
              </div>
            </div>
            <button
              onClick={() => onNavigate("Tagihan SPP")}
              className="w-full py-3 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
              Lihat Detail Tagihan
            </button>
          </div>
        </div>

        {/* Pengumuman Terbaru */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-800">Pengumuman</h3>
            <button onClick={() => onNavigate("Pengumuman Sekolah")} className="text-[12px] text-[#2A4365] font-semibold hover:underline">Lihat Semua</button>
          </div>
          <div className="divide-y divide-gray-50">
            {mockAnnouncements.map((ann) => (
              <div key={ann.id} className="px-5 py-4 flex items-start gap-3 hover:bg-gray-50/50 cursor-pointer" onClick={() => onNavigate("Pengumuman Sekolah")}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">{ann.title}</p>
                    {ann.penting && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded flex-shrink-0">PENTING</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">{ann.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"/>
                    <span className="text-[11px] text-blue-500 font-medium">{ann.category}</span>
                  </div>
                </div>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-[15px] font-bold text-gray-800 mb-4">Akses Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "Akademik", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 0 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z", color: "bg-blue-50 text-blue-600", menu: "Perkembangan Akademik" },
            { label: "Unduh Rapor", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8", color: "bg-green-50 text-green-600", menu: "Unduh Rapor" },
            { label: "Tagihan SPP", icon: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z", color: "bg-amber-50 text-amber-600", menu: "Tagihan SPP" },
            { label: "Riwayat Pembayaran", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-purple-50 text-purple-600", menu: "Riwayat Pembayaran" },
            { label: "Pengumuman", icon: "M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832", color: "bg-indigo-50 text-indigo-600", menu: "Pengumuman Sekolah" },
            { label: "Profil", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", color: "bg-rose-50 text-rose-600", menu: "My Profile" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate(item.menu)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                </svg>
              </div>
              <span className="text-[12px] font-semibold text-gray-600 text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrangTuaHome;
