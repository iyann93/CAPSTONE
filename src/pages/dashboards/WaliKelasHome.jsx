import React from "react";

const WaliKelasHome = ({ user, onNavigate }) => {
  const classData = {
    kelas: "VII A",
    waliKelas: user?.fullName || (user?.role === "Wali Kelas" ? "Asih Kinanti, S.Pd" : "Ahmad Rifai, S.Pd"),
    tahunAjaran: "2025/2026",
    jumlahSiswa: 32,
  };

  const sppStats = {
    lunas: 20,
    belumLunas: 12,
    totalTerkumpul: 25000000,
    bulanBerjalan: "Januari 2026",
  };

  const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

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

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Siswa",
            val: classData.jumlahSiswa,
            unit: "Siswa",
            sub: "Total siswa di kelas",
            color: "text-blue-600",
            bg: "bg-blue-50",
            icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
          },
          {
            label: "Sudah Bayar SPP",
            val: sppStats.lunas,
            unit: "Siswa",
            sub: `Bulan ${sppStats.bulanBerjalan}`,
            color: "text-green-600",
            bg: "bg-green-50",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            label: "Belum Bayar SPP",
            val: sppStats.belumLunas,
            unit: "Siswa",
            sub: `Bulan ${sppStats.bulanBerjalan}`,
            color: "text-amber-600",
            bg: "bg-amber-50",
            icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            label: "Total Pembayaran SPP",
            val: fmt(sppStats.totalTerkumpul),
            unit: "",
            sub: `Terkumpul di ${sppStats.bulanBerjalan}`,
            color: "text-purple-600",
            bg: "bg-purple-50",
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
            <div className="flex items-baseline gap-1">
              <p className="text-[26px] font-black text-[#1e293b]">{card.val}</p>
              {card.unit && <p className="text-[13px] font-bold text-gray-500">{card.unit}</p>}
            </div>
            <p className="text-[12px] text-gray-500 font-medium mt-0.5">{card.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Action / Information Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 className="text-[18px] font-bold text-gray-800 mb-2">Monitoring SPP Siswa</h3>
          <p className="text-[13px] text-gray-500 mb-6 max-w-sm">
            Pantau status pembayaran SPP seluruh siswa di kelas Anda secara real-time berdasarkan bulan dan tahun ajaran.
          </p>
          <button 
            onClick={() => onNavigate("Monitoring SPP Siswa")}
            className="px-6 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white text-[13px] font-bold rounded-xl transition-colors"
          >
            Lihat Data SPP Kelas
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
          <h3 className="text-[18px] font-bold text-gray-800 mb-2">Riwayat Terima Gaji</h3>
          <p className="text-[13px] text-gray-500 mb-6 max-w-sm">
            Lihat seluruh riwayat penerimaan honorarium wali kelas dan gaji bulanan Anda.
          </p>
          <button 
            onClick={() => onNavigate("Riwayat Terima Gaji")}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-[13px] font-bold rounded-xl transition-colors"
          >
            Lihat Riwayat
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaliKelasHome;
