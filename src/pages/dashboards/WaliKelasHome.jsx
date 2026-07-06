import React from "react";

const WaliKelasHome = ({ user, onNavigate }) => {
  const classData = {
    kelas: "VII A",
    waliKelas: user?.fullName || (user?.role === "Wali Kelas" ? "Asih Kinanti, S.Pd" : "Ahmad Rifai, S.Pd"),
    tahunAjaran: "2025/2026",
    jumlahSiswa: 32,
  };



  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Selamat Datang! 👋</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {classData.waliKelas} · Wali Kelas {classData.kelas}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-400">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          Senin, 23 Juni 2026
        </div>
      </div>

      {/* Class Overview Card */}
      <div className="bg-gradient-to-r from-[#1A3D63] to-[#2A5F8F] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
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
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Stat Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center">
          <div className="flex items-start justify-between mb-3">
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

        {/* Quick Action / Information Area */}
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
            className="px-6 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white text-[13px] font-bold rounded-xl transition-colors"
          >
            Lihat Data Siswa
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaliKelasHome;




