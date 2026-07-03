import React from "react";

const gradesData = [
  { mapel: "Matematika", type: "MTK", color: "bg-blue-100 text-blue-600", harian: 85, uts: 88, uas: 90, akhir: 88, predikat: "A" },
  { mapel: "Fisika", type: "FIS", color: "bg-pink-100 text-pink-600", harian: 82, uts: 80, uas: 85, akhir: 83, predikat: "B" },
  { mapel: "Kimia", type: "KIM", color: "bg-green-100 text-green-600", harian: 88, uts: 87, uas: 92, akhir: 89, predikat: "A" },
  { mapel: "Biologi", type: "BIO", color: "bg-emerald-100 text-emerald-600", harian: 90, uts: 88, uas: 88, akhir: 89, predikat: "A" },
  { mapel: "Bahasa Indonesia", type: "IND", color: "bg-yellow-100 text-yellow-600", harian: 85, uts: 84, uas: 86, akhir: 85, predikat: "B" },
  { mapel: "Bahasa Inggris", type: "ENG", color: "bg-blue-100 text-blue-600", harian: 88, uts: 90, uas: 91, akhir: 90, predikat: "A" },
  { mapel: "PKn", type: "PKN", color: "bg-orange-100 text-orange-600", harian: 86, uts: 85, uas: 87, akhir: 86, predikat: "A" },
  { mapel: "PJOK", type: "PJK", color: "bg-teal-100 text-teal-600", harian: 80, uts: 80, uas: 82, akhir: 81, predikat: "B" },
];

const attendanceData = [
  { bulan: "Juli", hadir: 18, sakit: 0, izin: 0, alpha: 0, total: 18, pct: 100 },
  { bulan: "Agustus", hadir: 22, sakit: 1, izin: 0, alpha: 0, total: 23, pct: 96 },
  { bulan: "September", hadir: 20, sakit: 0, izin: 1, alpha: 0, total: 21, pct: 95 },
  { bulan: "Oktober", hadir: 23, sakit: 0, izin: 0, alpha: 0, total: 23, pct: 100 },
  { bulan: "November", hadir: 20, sakit: 2, izin: 0, alpha: 0, total: 22, pct: 91 },
];

const StudentDetail = ({ student, onBack, onEdit }) => {
  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="flex items-center text-[13px] text-gray-500 gap-2">
            <span>Dashboard</span>
            <span>›</span>
            <span>Data Siswa</span>
            <span>›</span>
            <span className="font-bold text-[#1e293b]">{student.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-[#1e293b] shadow-sm transition-colors flex-shrink-0"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h1 className="text-[26px] font-bold text-[#1e293b]">{student.name}</h1>
              <p className="text-gray-500 text-[14px] mt-0.5">
                {student.kelas} - {student.jurusan} - NIS {student.nis}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-6 md:pt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 shadow-sm transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Ekspor
          </button>
          <button 
            onClick={() => onEdit(student)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold shadow-sm transition-colors"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Edit Data
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1 space-y-6">
          {/* Banner & Profile Card */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="h-[120px] bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"></div>
            
            <div className="px-6 pb-6 pt-14 relative">
              <div className="absolute -top-12 left-6">
                <div 
                  className="w-24 h-24 rounded-[20px] border-4 border-white flex items-center justify-center text-white text-[32px] font-bold shadow-sm"
                  style={{ backgroundColor: student.avatarColor }}
                >
                  {student.initials}
                </div>
              </div>
              
              <div className="absolute top-4 right-6 flex gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[12px] font-bold">Aktif</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">Tempat, Tgl Lahir</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">Yogyakarta, 15 Maret 2006</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">Agama</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">Islam</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">Alamat</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">Jl. Mawar No. 12, Kebayoran Baru</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">Kota</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">Sleman, DI Yogyakarta</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">No. Telepon</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">081234567890</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">Email</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">{student.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <h3 className="text-[22px] font-bold text-emerald-600">{student.nilaiRataRata}</h3>
              <p className="text-[12px] text-gray-500 mt-1">Nilai Rata-rata</p>
            </div>
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h3 className="text-[22px] font-bold text-blue-600">{student.kehadiran}%</h3>
              <p className="text-[12px] text-gray-500 mt-1">Kehadiran</p>
            </div>
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-3">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              </div>
              <h3 className="text-[22px] font-bold text-purple-600">#3</h3>
              <p className="text-[12px] text-gray-500 mt-1">Ranking Kelas</p>
            </div>
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3 className="text-[22px] font-bold text-orange-500">1</h3>
              <p className="text-[12px] text-gray-500 mt-1">Prestasi</p>
            </div>
          </div>

          {/* Nilai Mata Pelajaran */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <h3 className="text-[16px] font-bold text-[#1e293b]">Nilai Mata Pelajaran</h3>
              </div>
              <span className="text-[13px] text-gray-400">Semester Ganjil 2023/2024</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mata Pelajaran</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Nilai Harian</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">UTS</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">UAS</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nilai Akhir</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gradesData.map((grade, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${grade.color}`}>{grade.type}</span>
                          <span className="text-[13px] font-bold text-[#1e293b]">{grade.mapel}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[13px] text-gray-600 text-center">{grade.harian}</td>
                      <td className="py-4 px-6 text-[13px] text-gray-600 text-center">{grade.uts}</td>
                      <td className="py-4 px-6 text-[13px] text-gray-600 text-center">{grade.uas}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 w-[100px]">
                          <span className="text-[14px] font-bold text-[#1e293b]">{grade.akhir}</span>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${grade.akhir >= 85 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${grade.akhir}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-md text-[12px] font-bold ${grade.predikat === 'A' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                          {grade.predikat}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50/50 border-t border-gray-100">
                    <td colSpan="4" className="py-4 px-6 text-[13px] font-bold text-gray-500">Rata-rata Keseluruhan</td>
                    <td colSpan="2" className="py-4 px-6 text-[15px] font-bold text-[#3B82F6]">86.2</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Rekap Absensi */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <h3 className="text-[16px] font-bold text-[#1e293b]">Rekap Absensi</h3>
              </div>
              <div className="flex gap-4 text-[12px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-gray-500">Hadir: <strong className="text-[#1e293b]">103</strong></span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400"></span><span className="text-gray-500">Sakit: <strong className="text-[#1e293b]">3</strong></span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-gray-500">Izin: <strong className="text-[#1e293b]">1</strong></span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-gray-500">Alpha: <strong className="text-[#1e293b]">0</strong></span></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bulan</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Hadir</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Sakit</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Izin</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Alpha</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Total Hari</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">% Hadir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attendanceData.map((data, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-6 text-[13px] font-bold text-[#1e293b]">{data.bulan}</td>
                      <td className="py-4 px-6 text-[13px] font-bold text-emerald-600 text-center">{data.hadir}</td>
                      <td className="py-4 px-6 text-[13px] font-bold text-orange-400 text-center">{data.sakit}</td>
                      <td className="py-4 px-6 text-[13px] font-bold text-blue-500 text-center">{data.izin}</td>
                      <td className="py-4 px-6 text-[13px] font-bold text-red-500 text-center">{data.alpha}</td>
                      <td className="py-4 px-6 text-[13px] text-gray-500 text-center">{data.total}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 w-[80px]">
                          <span className="text-[13px] font-bold text-emerald-500">{data.pct}%</span>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${data.pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50/50 border-t border-gray-100">
                    <td className="py-4 px-6 text-[13px] font-bold text-[#1e293b]">Total</td>
                    <td className="py-4 px-6 text-[13px] font-bold text-emerald-600 text-center">103</td>
                    <td className="py-4 px-6 text-[13px] font-bold text-orange-400 text-center">3</td>
                    <td className="py-4 px-6 text-[13px] font-bold text-blue-500 text-center">1</td>
                    <td className="py-4 px-6 text-[13px] font-bold text-red-500 text-center">0</td>
                    <td className="py-4 px-6 text-[14px] font-bold text-[#1e293b] text-center">107</td>
                    <td className="py-4 px-6 text-[14px] font-bold text-blue-500">96%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="w-full xl:w-[320px] space-y-6">
          {/* Informasi Akademik */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Akademik</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">NIS</span>
                <span className="font-bold text-[#1e293b]">{student.nis}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">NISN</span>
                <span className="font-bold text-[#1e293b]">{student.nisn}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Kelas</span>
                <span className="font-bold text-[#1e293b]">{student.kelas}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Tingkat</span>
                <span className="font-bold text-[#1e293b]">{student.tingkat}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Jurusan</span>
                <span className="font-bold text-[#1e293b]">{student.jurusan}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Tahun Masuk</span>
                <span className="font-bold text-[#1e293b]">2023</span>
              </div>
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Data Orang Tua</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">AYAH</p>
                <p className="text-[14px] font-bold text-[#1e293b]">Budi Pratama</p>
                <p className="text-[12px] text-gray-500">Wiraswasta</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">IBU</p>
                <p className="text-[14px] font-bold text-[#1e293b]">Sri Wahyuni</p>
                <p className="text-[12px] text-gray-500">Guru</p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                081298765432
              </div>
            </div>
          </div>

          {/* Ringkasan Nilai */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Ringkasan Nilai</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Nilai Tertinggi</span>
                <span className="font-bold text-emerald-500">90</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Nilai Terendah</span>
                <span className="font-bold text-red-500">81</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Nilai Rata-rata</span>
                <span className="font-bold text-blue-500">87.5</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Ranking Kelas</span>
                <span className="font-bold text-purple-600">#3</span>
              </div>
            </div>
          </div>

          {/* Prestasi */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-4">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Prestasi
            </h3>
            <div className="bg-yellow-50 text-yellow-700 text-[12px] font-bold px-3 py-2.5 rounded-xl border border-yellow-100 flex items-start gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-1 1.05l-3.91.56a1 1 0 0 0-.93.9l-.16 2.49"/><path d="M14 14.66V17c0 .55.47.98 1 1.05l3.91.56a1 1 0 0 1 .93.9l.16 2.49"/><path d="M18 10a8 8 0 0 0-12 0c0 4.97 4 9 6 10 2-1.03 6-5.03 6-10z"/></svg>
              Juara 2 Olimpiade Matematika Tingkat Kota
            </div>
          </div>

          {/* Informasi Data */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Terdaftar</span>
                <span className="text-[#1e293b]">12 Jul 2023</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-emerald-500">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
