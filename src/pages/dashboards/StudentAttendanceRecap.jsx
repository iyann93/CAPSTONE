import React from "react";

const studentsRecap = [
  { id: 1, name: "Andi Pratama", nis: "2023001", initials: "A", color: "bg-[#10B981]", hadir: 18, sakit: 0, izin: 1, alpha: 0, total: 19, pct: 95, status: "Baik" },
  { id: 2, name: "Ayu Lestari", nis: "2023006", initials: "A", color: "bg-[#EF4444]", hadir: 19, sakit: 0, izin: 0, alpha: 0, total: 19, pct: 100, status: "Baik" },
  { id: 3, name: "Bagas Prasetyo", nis: "2023007", initials: "B", color: "bg-[#1e293b]", hadir: 17, sakit: 1, izin: 1, alpha: 0, total: 19, pct: 89, status: "Cukup" },
  { id: 4, name: "Citra Dewi", nis: "2023008", initials: "C", color: "bg-[#10B981]", hadir: 18, sakit: 1, izin: 0, alpha: 0, total: 19, pct: 95, status: "Baik" },
  { id: 5, name: "Dewi Sartika", nis: "2023002", initials: "D", color: "bg-[#EC4899]", hadir: 19, sakit: 0, izin: 0, alpha: 0, total: 19, pct: 100, status: "Baik" },
  { id: 6, name: "Dimas Kurniawan", nis: "2023009", initials: "D", color: "bg-[#8B5CF6]", hadir: 19, sakit: 0, izin: 0, alpha: 0, total: 19, pct: 100, status: "Baik" },
  { id: 7, name: "Fajar Setiawan", nis: "2023005", initials: "F", color: "bg-[#EF4444]", hadir: 15, sakit: 1, izin: 2, alpha: 1, total: 19, pct: 79, status: "Kurang" },
  { id: 8, name: "Nurul Hidayah", nis: "2023004", initials: "N", color: "bg-[#F59E0B]", hadir: 18, sakit: 0, izin: 1, alpha: 0, total: 19, pct: 95, status: "Baik" },
  { id: 9, name: "Ricky Firmansyah", nis: "2023003", initials: "R", color: "bg-[#3B82F6]", hadir: 16, sakit: 2, izin: 1, alpha: 0, total: 19, pct: 84, status: "Cukup" },
  { id: 10, name: "Siti Rahma", nis: "2023010", initials: "S", color: "bg-[#10B981]", hadir: 17, sakit: 0, izin: 2, alpha: 0, total: 19, pct: 89, status: "Cukup" },
];

const statusColor = (s) => s === "Baik" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : s === "Cukup" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-red-50 text-red-600 border-red-100";

const StudentAttendanceRecap = ({ classData, onBack }) => {
  const totalHadir = studentsRecap.reduce((a, s) => a + s.hadir, 0);
  const totalSakit = studentsRecap.reduce((a, s) => a + s.sakit, 0);
  const totalIzin = studentsRecap.reduce((a, s) => a + s.izin, 0);
  const totalAlpha = studentsRecap.reduce((a, s) => a + s.alpha, 0);
  const avgPct = (totalHadir / (studentsRecap.length * 19) * 100).toFixed(1);

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
        <div className="space-y-3">
          <div className="flex items-center text-[13px] text-gray-500 gap-2">
            <span>Dashboard</span><span>&rsaquo;</span><span>Absensi Siswa</span><span>&rsaquo;</span>
            <span className="font-bold text-[#1e293b]">Rekap — {classData.name}</span>
          </div>
          <div className="flex items-start gap-4">
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 shadow-sm transition-colors mt-0.5 flex-shrink-0">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h1 className="text-[26px] font-bold text-[#1e293b]">Rekap Absensi — {classData.name}</h1>
              <p className="text-gray-500 text-[14px] mt-1">Laporan kehadiran bulanan November 2023</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-700 shadow-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            November 2023
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 shadow-sm transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Ekspor PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-[16px] p-5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 mb-3">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <h3 className="text-[26px] font-bold text-blue-600">{avgPct}%</h3>
              <p className="text-[12px] text-blue-500 font-medium mt-0.5">Rata-rata Hadir</p>
            </div>
            <div className="bg-orange-50 rounded-[16px] p-5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 mb-3">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-[26px] font-bold text-orange-500">{totalSakit}</h3>
              <p className="text-[12px] text-orange-500 font-medium mt-0.5">Total Sakit</p>
            </div>
            <div className="bg-purple-50 rounded-[16px] p-5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500 mb-3">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3 className="text-[26px] font-bold text-purple-600">{totalIzin}</h3>
              <p className="text-[12px] text-purple-500 font-medium mt-0.5">Total Izin</p>
            </div>
            <div className="bg-red-50 rounded-[16px] p-5">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 mb-3">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h3 className="text-[26px] font-bold text-red-500">{totalAlpha}</h3>
              <p className="text-[12px] text-red-500 font-medium mt-0.5">Total Alpha</p>
            </div>
          </div>

          {/* Bar Chart - Distribusi Kehadiran November */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              Distribusi Kehadiran November
            </h3>
            <div className="h-[200px] flex flex-col relative">
              <div className="flex-1 flex items-end relative pl-10 pb-2 border-b border-gray-100">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[11px] text-gray-400 py-2">
                  <span>180</span><span>135</span><span>90</span><span>45</span><span>0</span>
                </div>
                <div className="w-full flex justify-around relative z-10 h-full py-2">
                  {[{v:176,c:"bg-[#1e293b]"},{v:5,c:"bg-gray-400"},{v:8,c:"bg-gray-400"},{v:1,c:"bg-gray-400"}].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-full">
                      <div className={`w-12 ${bar.c} rounded-t-md`} style={{ height: `${(bar.v/180)*100}%`, minHeight: bar.v > 0 ? '6px' : '0' }}></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-around pl-10 text-[12px] text-gray-500 font-medium pt-3">
                <span>Hadir</span><span>Sakit</span><span>Izin</span><span>Alpha</span>
              </div>
            </div>
          </div>

          {/* Table - Rekap Per Siswa */}
          <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center">
              <h3 className="text-[15px] font-bold text-[#1e293b]">Rekap Per Siswa</h3>
              <div className="relative w-[220px]">
                <input type="text" placeholder="Cari siswa..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] bg-gray-50 focus:bg-white transition-all" />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">No</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Siswa ↑</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Hadir</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Sakit</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Izin</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Alpha</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Total</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">% Hadir</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {studentsRecap.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5 text-[13px] text-gray-500">{i + 1}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 ${s.color}`}>{s.initials}</div>
                          <div>
                            <p className="text-[13px] font-bold text-[#1e293b]">{s.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">{s.nis}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center text-[14px] font-bold text-emerald-600">{s.hadir}</td>
                      <td className="py-3.5 px-4 text-center text-[14px] font-bold text-orange-500">{s.sakit}</td>
                      <td className="py-3.5 px-4 text-center text-[14px] font-bold text-purple-500">{s.izin}</td>
                      <td className="py-3.5 px-4 text-center text-[14px] font-bold text-red-500">{s.alpha}</td>
                      <td className="py-3.5 px-4 text-center text-[13px] font-medium text-gray-600">{s.total}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2 w-[90px]">
                          <span className="text-[13px] font-bold text-gray-700 w-9">{s.pct}%</span>
                          <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${s.pct >= 90 ? 'bg-emerald-500' : s.pct >= 80 ? 'bg-orange-400' : 'bg-red-500'}`} style={{ width: `${s.pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColor(s.status)}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50/50 border-t border-gray-200">
                    <td className="py-3.5 px-5 text-[13px] font-bold text-[#1e293b]" colSpan={2}>Total / Rata-rata</td>
                    <td className="py-3.5 px-4 text-center text-[14px] font-bold text-emerald-600">{totalHadir}</td>
                    <td className="py-3.5 px-4 text-center text-[14px] font-bold text-orange-500">{totalSakit}</td>
                    <td className="py-3.5 px-4 text-center text-[14px] font-bold text-purple-500">{totalIzin}</td>
                    <td className="py-3.5 px-4 text-center text-[14px] font-bold text-red-500">{totalAlpha}</td>
                    <td className="py-3.5 px-4 text-center text-[13px] font-medium text-gray-600">19</td>
                    <td className="py-3.5 px-5 text-[13px] font-bold text-[#3B82F6]">{avgPct}%</td>
                    <td className="py-3.5 px-5"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[320px] space-y-6">
          {/* Trend Kehadiran */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Trend Kehadiran
            </h3>
            <div className="relative pl-10 pr-2">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[11px] text-gray-400 font-medium">
                <span>100%</span><span>94%</span><span>91%</span><span>88%</span>
              </div>
              {/* Chart area with grid */}
              <div className="relative h-[130px]">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full border-b border-gray-100"></div>
                  <div className="w-full border-b border-gray-100"></div>
                  <div className="w-full border-b border-gray-100"></div>
                  <div className="w-full border-b border-gray-100"></div>
                </div>
                {/* SVG Line */}
                <svg viewBox="0 0 240 100" preserveAspectRatio="none" className="w-full h-full relative z-10">
                  <polyline fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="20,62 70,38 120,72 170,45 220,30" />
                  {[{VII:20,y:62},{VII:70,y:38},{VII:120,y:72},{VII:170,y:45},{VII:220,y:30}].map((p,i) => (
                    <circle key={i} cx={p.VII} cy={p.y} r="5" fill="white" stroke="#3B82F6" strokeWidth="2.5" />
                  ))}
                </svg>
              </div>
              {/* VII-axis labels */}
              <div className="flex flex-wrap justify-between text-[11px] text-gray-400 font-medium mt-2">
                <span>Jul</span><span>Ags</span><span>Sep</span><span>Okt</span><span>Nov</span>
              </div>
            </div>
          </div>

          {/* Kehadiran Rendah */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Kehadiran Rendah (&lt;80%)
            </h3>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-wrap justify-between items-center">
              <div>
                <p className="text-[14px] font-bold text-[#1e293b]">Fajar Setiawan</p>
                <p className="text-[11px] text-gray-400 font-mono">2023005</p>
              </div>
              <span className="text-[16px] font-bold text-red-500">79%</span>
            </div>
          </div>

          {/* Siswa dengan Alpha */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Siswa dengan Alpha
            </h3>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-wrap justify-between items-center">
              <div>
                <p className="text-[14px] font-bold text-[#1e293b]">Fajar Setiawan</p>
                <p className="text-[11px] text-gray-400 font-mono">2023005</p>
              </div>
              <span className="text-[14px] font-bold text-red-500">1x alpha</span>
            </div>
          </div>

          {/* Informasi Rekap */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Rekap</h3>
            <div className="space-y-3">
              {[["Kelas", classData.name],["Bulan","November 2023"],["Total Hari Efektif","19 hari"],["Total Siswa","10 siswa"],["Rata-rata Kehadiran", avgPct + "%"]].map(([k,v]) => (
                <div key={k} className="flex flex-wrap justify-between text-[13px]">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-bold text-[#1e293b]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceRecap;



