import React from "react";

const JadwalMengajar = ({ user }) => {
  const guruInfo = {
    nama: user?.fullName || "Drs. Hendra Gunawan, M.Pd",
    mapel: "Matematika",
    tahunAjaran: "Ganjil 2023/2024",
  };

  const scheduleCards = [
    {
      day: "Senin",
      slot: "Jam 1-2",
      subject: "Matematika",
      class: "X IPA 1",
      room: "Ruang 101",
      type: "wajib",
      time: "07:00",
    },
    {
      day: "Senin",
      slot: "Jam 3-4",
      subject: "Matematika",
      class: "X IPA 2",
      room: "Ruang 102",
      type: "wajib",
      time: "08:30",
    },
    {
      day: "Senin",
      slot: "Jam 9-10",
      subject: "Mat. Peminatan",
      class: "XII IPA 1",
      room: "Ruang 401",
      type: "peminatan",
      time: "13:05",
    },
    {
      day: "Selasa",
      slot: "Jam 5-6",
      subject: "Matematika",
      class: "XI IPA 1",
      room: "Ruang 301",
      type: "wajib",
      time: "10:15",
    },
    {
      day: "Rabu",
      slot: "Jam 5-6",
      subject: "Matematika",
      class: "X IPS 1",
      room: "Ruang 201",
      type: "wajib",
      time: "10:15",
    },
    {
      day: "Kamis",
      slot: "Jam 1-2",
      subject: "Mat. Peminatan",
      class: "XII IPA 1",
      room: "Ruang 401",
      type: "peminatan",
      time: "07:00",
    },
    {
      day: "Jumat",
      slot: "Jam 1-2",
      subject: "Matematika",
      class: "XI IPA 2",
      room: "Ruang 302",
      type: "wajib",
      time: "07:00",
    },
  ];

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

  const getCellContent = (day, slot) => {
    return scheduleCards.find((c) => c.day === day && c.slot === slot);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fadeIn bg-[#F8FAFC] min-h-screen">
      {/* Sub-header / Breadcrumb */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Jadwal Mengajar</h1>
        <p className="text-sm text-gray-400 font-semibold">
          Semester Ganjil 2023/2024 • SMAN 1 Contoh
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
            6 kelas
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            10.5 jam/minggu
          </div>
        </div>
      </div>

      {/* Legend & Date Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keterangan:</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#1A3D63]">
              <span className="w-2 h-2 rounded-full bg-[#1A3D63]"></span>
              Matematika
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-purple-700">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Mat. Peminatan
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
          Selasa, 30 Juni 2026
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
                    {day === "Selasa" && (
                      <span className="ml-1.5 inline-block bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                        Hari Ini
                      </span>
                    )}
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
                      const cell = getCellContent(day, row.label);
                      return (
                        <td
                          key={day}
                          className={`p-3 text-center border-r border-gray-50 relative align-middle ${
                            day === "Selasa" ? "bg-green-50/5" : ""
                          }`}
                        >
                          {cell ? (
                            <div
                              className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] shadow-sm ${
                                cell.type === "peminatan"
                                  ? "bg-purple-50/70 border-purple-100/80 text-purple-900"
                                  : "bg-blue-50/70 border-blue-100/80 text-[#1A3D63]"
                              }`}
                            >
                              <div
                                className={`text-[11px] font-extrabold uppercase tracking-wide mb-1 ${
                                  cell.type === "peminatan" ? "text-purple-600" : "text-[#1A3D63]"
                                }`}
                              >
                                {cell.subject}
                              </div>
                              <div className="text-sm font-black text-gray-800">
                                {cell.class}
                              </div>
                              <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {cell.room}
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
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-800">Ringkasan Jadwal Minggu Ini</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scheduleCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  card.type === "peminatan" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-[#1A3D63]"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-gray-800">{card.class}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      card.type === "peminatan"
                        ? "bg-purple-100/60 text-purple-600"
                        : "bg-blue-100/60 text-[#1A3D63]"
                    }`}
                  >
                    {card.subject}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  {card.day} @ {card.time}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{card.room}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JadwalMengajar;
