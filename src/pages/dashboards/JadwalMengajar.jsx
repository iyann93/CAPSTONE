import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const JadwalMengajar = ({ user }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [guruInfo, setGuruInfo] = useState({
    nama: user?.fullName || "Memuat...",
    mapel: "-",
    tahunAjaran: "Ganjil 2026/2027",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cari Guru ID
      const searchKey = user?.fullName || user?.nama || user?.email || "";
      const guruRes = await api.get(`/guru?search=${encodeURIComponent(searchKey)}`);
      const guru = guruRes.data?.data?.find(g => 
        (g.email && g.email === user.email) || 
        (g.nama === user.fullName) ||
        (g.nama_lengkap === user.fullName)
      );
      
      if (!guru) {
        setError("Data Guru tidak ditemukan untuk akun ini.");
        setLoading(false);
        return;
      }

      setGuruInfo(prev => ({
        ...prev,
        nama: guru.nama,
        mapel: guru.mata_pelajaran || "-"
      }));

      // Ambil Jadwal
      const jadwalRes = await api.get(`/jadwal-pelajaran?guru_id=${guru.id}&limit=100`);
      setScheduleData(jadwalRes.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil jadwal:", err);
      setError("Gagal memuat jadwal pelajaran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchSchedules();
    }
  }, [user]);

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  const timeRows = [
    { label: "Jam 1-2", time: "07:00-08:30", isBreak: false },
    { label: "Jam 3-4", time: "08:30-10:00", isBreak: false },
    { label: "10:00-10:15", time: "", isBreak: true, breakText: "ISTIRAHAT" },
    { label: "Jam 5-6", time: "10:15-11:45", isBreak: false },
    { label: "Jam 7-8", time: "11:45-13:15", isBreak: false },
    { label: "13:00-13:15", time: "", isBreak: true, breakText: "ISHOMA" },
    { label: "Jam 9-10", time: "13:15-14:35", isBreak: false },
  ];

  const getCellContent = (day, rowTime) => {
    if (!rowTime) return null;
    const [rowStart, rowEnd] = rowTime.split('-');
    
    // Pencocokan riil berdasarkan waktu database mencakup rentang waktu slot
    return scheduleData.find((c) => {
      if (c.hari !== day) return false;
      const cMulai = c.jam_mulai.substring(0, 5);
      const cSelesai = c.jam_selesai.substring(0, 5);
      return cMulai <= rowStart && cSelesai >= rowEnd;
    });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-[#F8FAFC]">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col items-center gap-4 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <h3 className="font-bold text-lg">Terjadi Kesalahan</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
          <button 
            onClick={fetchSchedules}
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fadeIn bg-[#F8FAFC] min-h-screen">
      {/* Sub-header / Breadcrumb */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Jadwal Mengajar</h1>
        <p className="text-sm text-gray-400 font-semibold">
          Semester {guruInfo.tahunAjaran} • SMPN 1 Contoh
        </p>
      </div>

      {/* Main Header / Info Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1A3D63]">{guruInfo.nama}</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {guruInfo.mapel} - {guruInfo.tahunAjaran}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 border border-blue-100 text-[#1A3D63] rounded-xl text-xs font-bold shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {scheduleData.length} Sesi
          </div>
        </div>
      </div>

      {/* Legend & Date Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keterangan:</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#1A3D63]">
              <span className="w-2 h-2 rounded-full bg-[#1A3D63]"></span>
              Wajib
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-purple-700">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Peminatan
            </span>
          </div>
        </div>
        <div className="text-xs font-bold text-gray-400 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Jadwal Aktif
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="w-[140px] px-4 py-5 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Waktu
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-5 text-center text-[11px] font-black text-gray-500 uppercase tracking-widest relative"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeRows.map((row, rIdx) => {
                if (row.isBreak) {
                  return (
                    <tr key={rIdx} className="bg-amber-50/40 border-y border-amber-100/50">
                      <td className="px-4 py-3 text-center">
                        <div className="text-[11px] font-bold text-amber-600/80">
                          {row.label}
                        </div>
                      </td>
                      <td colSpan={5} className="px-4 py-3 text-center">
                        <span className="text-[11px] font-black text-amber-700/80 tracking-widest uppercase">
                          {row.breakText}
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={rIdx} className="hover:bg-slate-50/20 transition-colors">
                    {/* Time Column */}
                    <td className="px-4 py-6 text-center border-r border-gray-50 bg-gray-50/20">
                      <div className="text-xs font-bold text-gray-800">{row.label}</div>
                      <div className="text-[10px] font-semibold text-gray-400 mt-1">
                        {row.time}
                      </div>
                    </td>

                    {/* Day Columns */}
                    {days.map((day) => {
                      const cell = getCellContent(day, row.time);
                      return (
                        <td
                          key={day}
                          className="p-3 text-center border-r border-gray-50 relative align-middle"
                        >
                          {cell ? (
                            <div
                              className="p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] shadow-sm bg-blue-50/70 border-blue-100/80 text-[#1A3D63]"
                            >
                              <div className="text-[11px] font-extrabold uppercase tracking-wide mb-1 text-[#1A3D63]">
                                {cell.nama_mapel}
                              </div>
                              <div className="text-sm font-black text-gray-800">
                                {cell.nama_kelas}
                              </div>
                              <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {cell.jam_mulai.substring(0,5)} - {cell.jam_selesai.substring(0,5)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-300 font-bold">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Section */}
      {scheduleData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-800">Ringkasan Jadwal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scheduleData.map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 text-[#1A3D63]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-gray-800">{card.nama_kelas}</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-100/60 text-[#1A3D63]">
                      {card.nama_mapel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    {card.hari} @ {card.jam_mulai.substring(0,5)}-{card.jam_selesai.substring(0,5)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalMengajar;
