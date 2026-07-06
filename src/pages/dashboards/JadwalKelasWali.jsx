import React from "react";

const JadwalKelasWali = ({ user }) => {
  const classInfo = {
    kelas: "VII A",
    waliKelas: user?.fullName || "Asih Kinanti, S.Pd",
    tahunAjaran: "Ganjil 2025/2026",
    jumlahSiswa: 32,
  };

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const timeRows = [
    { label: "Jam 1", time: "07:00-07:45", isBreak: false },
    { label: "Jam 2", time: "07:45-08:30", isBreak: false },
    { label: "08:30-09:00", time: "", isBreak: true, breakText: "UPACARA / PEMBIASAAN" },
    { label: "Jam 3", time: "09:00-09:45", isBreak: false },
    { label: "Jam 4", time: "09:45-10:30", isBreak: false },
    { label: "10:30-10:45", time: "", isBreak: true, breakText: "ISTIRAHAT 1" },
    { label: "Jam 5", time: "10:45-11:30", isBreak: false },
    { label: "Jam 6", time: "11:30-12:15", isBreak: false },
    { label: "12:15-13:00", time: "", isBreak: true, breakText: "ISHOMA" },
    { label: "Jam 7", time: "13:00-13:45", isBreak: false },
    { label: "Jam 8", time: "13:45-14:30", isBreak: false },
  ];

  // Dummy data representing the schedule for class VII A
  const scheduleData = [
    // Senin
    { day: "Senin", slot: "Jam 1", subject: "Matematika", teacher: "Drs. Hendra G.", type: "wajib" },
    { day: "Senin", slot: "Jam 2", subject: "Matematika", teacher: "Drs. Hendra G.", type: "wajib" },
    { day: "Senin", slot: "Jam 3", subject: "Pend. Agama", teacher: "Ahmad Rifai, S.Ag", type: "wajib" },
    { day: "Senin", slot: "Jam 4", subject: "Pend. Agama", teacher: "Ahmad Rifai, S.Ag", type: "wajib" },
    { day: "Senin", slot: "Jam 5", subject: "Bahasa Indonesia", teacher: "Rina Kumala, S.Pd", type: "wajib" },
    { day: "Senin", slot: "Jam 6", subject: "Bahasa Indonesia", teacher: "Rina Kumala, S.Pd", type: "wajib" },
    { day: "Senin", slot: "Jam 7", subject: "Seni Budaya", teacher: "Citra Dewi, S.Sn", type: "muatan" },
    { day: "Senin", slot: "Jam 8", subject: "Seni Budaya", teacher: "Citra Dewi, S.Sn", type: "muatan" },
    // Selasa
    { day: "Selasa", slot: "Jam 1", subject: "IPA Terpadu", teacher: "Budi Santoso, S.Si", type: "wajib" },
    { day: "Selasa", slot: "Jam 2", subject: "IPA Terpadu", teacher: "Budi Santoso, S.Si", type: "wajib" },
    { day: "Selasa", slot: "Jam 3", subject: "Bahasa Inggris", teacher: "Sarah Johnson, M.Pd", type: "wajib" },
    { day: "Selasa", slot: "Jam 4", subject: "Bahasa Inggris", teacher: "Sarah Johnson, M.Pd", type: "wajib" },
    { day: "Selasa", slot: "Jam 5", subject: "IPS Terpadu", teacher: "Agus Salim, M.Si", type: "wajib" },
    { day: "Selasa", slot: "Jam 6", subject: "IPS Terpadu", teacher: "Agus Salim, M.Si", type: "wajib" },
    { day: "Selasa", slot: "Jam 7", subject: "Penjasorkes", teacher: "Deni Irawan, S.Or", type: "muatan" },
    { day: "Selasa", slot: "Jam 8", subject: "Penjasorkes", teacher: "Deni Irawan, S.Or", type: "muatan" },
    // Rabu
    { day: "Rabu", slot: "Jam 1", subject: "PPKn", teacher: "Dra. Siti Aminah", type: "wajib" },
    { day: "Rabu", slot: "Jam 2", subject: "PPKn", teacher: "Dra. Siti Aminah", type: "wajib" },
    { day: "Rabu", slot: "Jam 3", subject: "Matematika", teacher: "Drs. Hendra G.", type: "wajib" },
    { day: "Rabu", slot: "Jam 4", subject: "Matematika", teacher: "Drs. Hendra G.", type: "wajib" },
    { day: "Rabu", slot: "Jam 5", subject: "Prakarya", teacher: "Lestari, S.Pd", type: "muatan" },
    { day: "Rabu", slot: "Jam 6", subject: "Prakarya", teacher: "Lestari, S.Pd", type: "muatan" },
    { day: "Rabu", slot: "Jam 7", subject: "Bimbingan Konseling", teacher: "M. Yusuf, M.Psi", type: "peminatan" },
    { day: "Rabu", slot: "Jam 8", subject: "Ekstrakurikuler", teacher: "Pembina Ekskul", type: "peminatan" },
  ];

  const getCellContent = (day, slot) => {
    return scheduleData.find((c) => c.day === day && c.slot === slot);
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case "wajib": return "bg-blue-50/70 border-blue-100/80 text-[#1A3D63]";
      case "muatan": return "bg-emerald-50/70 border-emerald-100/80 text-emerald-800";
      case "peminatan": return "bg-purple-50/70 border-purple-100/80 text-purple-900";
      default: return "bg-gray-50/70 border-gray-100/80 text-gray-700";
    }
  };

  const getTextStyle = (type) => {
    switch (type) {
      case "wajib": return "text-blue-600";
      case "muatan": return "text-emerald-600";
      case "peminatan": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fadeIn bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Jadwal Kelas</h1>
        <p className="text-sm text-gray-400 font-semibold">
          Lihat jadwal pelajaran untuk kelas perwalian Anda.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#1A3D63] to-[#2A5F8F] p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white border-2 border-white/30">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <p className="text-blue-200 text-[12px] font-semibold uppercase tracking-wider mb-0.5">Jadwal Pelajaran</p>
            <h2 className="text-[20px] font-bold">Kelas {classInfo.kelas}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-blue-100 font-medium">
              <span>{classInfo.waliKelas}</span> • <span>{classInfo.tahunAjaran}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-blue-200 text-[11px] font-semibold">Total Siswa</p>
            <p className="text-[16px] font-bold">{classInfo.jumlahSiswa} Orang</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Kategori:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-xs font-bold text-gray-700">Wajib Nasional</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold text-gray-700">Muatan Lokal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          <span className="text-xs font-bold text-gray-700">Peminatan / BK</span>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="w-[120px] px-4 py-5 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-100">
                  Waktu
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-5 text-center text-[12px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-100 last:border-r-0"
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
                      <td className="px-4 py-3 text-center border-r border-amber-100/50">
                        <div className="text-[11px] font-bold text-amber-600/80">
                          {row.label}
                        </div>
                      </td>
                      <td colSpan={5} className="px-4 py-3 text-center">
                        <span className="text-[11px] font-black text-amber-700/80 tracking-widest uppercase flex items-center justify-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {row.breakText}
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={rIdx} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-2 py-4 text-center border-r border-gray-100 bg-gray-50/20">
                      <div className="text-xs font-bold text-gray-800">{row.label}</div>
                      <div className="text-[10px] font-semibold text-gray-400 mt-1">
                        {row.time}
                      </div>
                    </td>
                    {days.map((day) => {
                      const cell = getCellContent(day, row.label);
                      return (
                        <td
                          key={day}
                          className="p-3 text-center border-r border-gray-100 last:border-r-0 align-middle"
                        >
                          {cell ? (
                            <div
                              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] shadow-sm ${getBadgeStyle(cell.type)}`}
                            >
                              <div
                                className={`text-[11px] font-extrabold uppercase tracking-wide mb-1 line-clamp-1 ${getTextStyle(cell.type)}`}
                                title={cell.subject}
                              >
                                {cell.subject}
                              </div>
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-600 font-semibold bg-white/50 py-1 px-2 rounded-lg border border-black/5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span className="truncate">{cell.teacher}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-200 font-bold">—</span>
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
    </div>
  );
};

export default JadwalKelasWali;
