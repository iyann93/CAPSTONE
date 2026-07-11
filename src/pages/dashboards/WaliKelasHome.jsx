import React, { useState, useEffect } from "react";
import { getAnnouncements } from "../../utils/announcementStore";
import { getNotifications } from "../../utils/notificationStore";

const WaliKelasHome = ({ user, onNavigate }) => {
  const classData = {
    kelas: "VII A",
    waliKelas: user?.fullName || (user?.role === "Wali Kelas" ? "Asih Kinanti, S.Pd" : "Ahmad Rifai, S.Pd"),
    tahunAjaran: "2025/2026",
    jumlahSiswa: 32,
  };

  const [liveAnn, setLiveAnn] = useState([]);
  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    setLiveAnn(getAnnouncements().slice(0, 3));
    const allNotifs = getNotifications();
    const waliNotifs = allNotifs.filter(n => n.roleTarget === "Wali Kelas");
    setLiveNotifications(waliNotifs.slice(0, 3));
  }, []);

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Selamat Datang!</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {classData.waliKelas} · Wali Kelas {classData.kelas}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-400">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          {today}
        </div>
      </div>

      {/* Class Overview Card */}
      <div className="bg-gradient-to-r from-[#1A3D63] to-[#2A5F8F] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-[20px] font-bold border-2 border-white/30">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <p className="text-blue-200 text-[12px] font-semibold uppercase tracking-wider mb-0.5">Informasi Kelas</p>
              <h2 className="text-[20px] font-bold">Kelas {classData.kelas}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[12px] font-semibold">{classData.tahunAjaran}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-right">
            <div>
              <p className="text-blue-200 text-[11px]">Total Siswa</p>
              <p className="text-[14px] font-bold">{classData.jumlahSiswa} Orang</p>
            </div>
            <div>
              <p className="text-blue-200 text-[11px]">Status Wali</p>
              <p className="text-[14px] font-bold">Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center">
          <div className="flex flex-wrap items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-[26px] font-black text-[#1e293b]">{classData.jumlahSiswa}</p>
            <p className="text-[13px] font-bold text-gray-500">Siswa</p>
          </div>
          <p className="text-[12px] text-gray-500 font-medium mt-0.5">Total Siswa</p>
          <p className="text-[11px] text-gray-400 mt-1">Total siswa di kelas</p>
        </div>

        {/* Quick Action */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#1A3D63] rounded-full flex items-center justify-center mb-4">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 className="text-[18px] font-bold text-gray-800 mb-2">Data Siswa Kelas</h3>
          <p className="text-[13px] text-gray-500 mb-6 max-w-sm">
            Lihat daftar siswa, performa akademik, dan kelola data detail setiap siswa di kelas Anda.
          </p>
          <button
            onClick={() => onNavigate("Data Siswa Kelas")}
            className="px-6 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white text-[13px] font-bold rounded-xl transition-colors border-none cursor-pointer"
          >
            Lihat Data Siswa
          </button>
        </div>
      </div>

      {/* Slip Gaji Notification Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-[15px] font-bold text-gray-800">Slip Gaji Tersedia</h3>
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">Baru</span>
              </div>
              <p className="text-[13px] text-gray-500">
                Slip gaji bulan <span className="font-semibold text-emerald-700">Juli 2026</span> telah diterbitkan oleh Bendahara. Silakan cek dan unduh slip gaji Anda.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  Diterbitkan: Juli 2026
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Status: Sudah Ditransfer
                </span>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <button
              onClick={() => onNavigate("Slip Gaji")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-xl transition-colors border-none cursor-pointer whitespace-nowrap"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Lihat Slip Gaji
            </button>
            <button
              onClick={() => onNavigate("Riwayat Terima Gaji")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-[12px] font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Riwayat Gaji
            </button>
          </div>
        </div>
      </div>

      {/* Notifikasi Sistem / Akademik */}
      {liveNotifications.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[15px] font-bold text-[#1A3D63]">Notifikasi Akademik</h3>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">{liveNotifications.length} Baru</span>
          </div>
          <div className="space-y-3">
            {liveNotifications.map(notif => (
              <div key={notif.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-800">{notif.title}</h4>
                    <p className="text-[12px] text-gray-500 mt-0.5 leading-snug">{notif.message}</p>
                    <span className="text-[10px] text-gray-400 mt-1.5 block">{notif.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate("Rapor Siswa")}
                  className="flex shrink-0 items-center justify-center gap-2 px-4 py-2 bg-[#1A3D63] hover:bg-[#122A44] text-white text-[12px] font-bold rounded-lg transition-colors border-none cursor-pointer"
                >
                  Generate Rapor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pengumuman Sekolah Terbaru */}
      {liveAnn.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-gray-800">Pengumuman Sekolah Terbaru</h3>
            <button onClick={() => onNavigate && onNavigate("Pengumuman Sekolah")} className="text-[12px] font-bold text-[#1A3D63] hover:underline">Lihat Semua →</button>
          </div>
          <div className="space-y-3">
            {liveAnn.map(ann => (
              <div
                key={ann.id}
                onClick={() => onNavigate && onNavigate("Pengumuman Sekolah")}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ann.importance === "Penting" ? "bg-red-100" : "bg-blue-100"}`}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={ann.importance === "Penting" ? "#dc2626" : "#2563eb"} strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">{ann.title}</p>
                    {ann.importance === "Penting" && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded flex-shrink-0">PENTING</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">{ann.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"/>
                    <span className="text-[11px] text-blue-500 font-medium">{ann.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaliKelasHome;
