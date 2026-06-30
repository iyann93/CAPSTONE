import React, { useState, useMemo } from "react";

const RekapAbsensiSiswa = ({ user }) => {
  const [selectedClass, setSelectedClass] = useState("X IPA 1");
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  // Mock data for class-based students with attendance records and grades
  const [studentsData, setStudentsData] = useState({
    "X IPA 1": [
      { id: "2023001", name: "Andi Pratama", gender: "L", hadir: 1, izin: 0, sakit: 0, grade: 87, note: "Aktif dan rajin. Kemampuan aljabar meningkat pesat.", avatarBg: "bg-blue-500" },
      { id: "2023002", name: "Dewi Sartika", gender: "P", hadir: 1, izin: 0, sakit: 0, grade: 94, note: "Nilai tertinggi di kelas. Sangat direkomendasikan mengikuti olimpiade.", avatarBg: "bg-teal-500" },
      { id: "2023003", name: "Ricky Firmansyah", gender: "L", hadir: 0, izin: 0, sakit: 1, grade: 72, note: "Perlu bimbingan tambahan. Kesulitan pada materi limit.", avatarBg: "bg-amber-600" },
      { id: "2023004", name: "Nurul Hidayah", gender: "P", hadir: 1, izin: 0, sakit: 0, grade: 85, note: "", avatarBg: "bg-red-500" },
      { id: "2023005", name: "Fajar Setiawan", gender: "L", hadir: 0, izin: 1, sakit: 0, grade: 79, note: "Konsisten mengerjakan tugas.", avatarBg: "bg-purple-600" },
      { id: "2023006", name: "Ayu Lestari", gender: "P", hadir: 1, izin: 0, sakit: 0, grade: 91, note: "Juara 2 olimpiade kota. Sangat berbakat.", avatarBg: "bg-pink-500" },
    ],
    "X IPA 2": [
      { id: "2023007", name: "Bagus Cahyo", gender: "L", hadir: 1, izin: 0, sakit: 0, grade: 82, note: "Paham materi matriks dengan baik.", avatarBg: "bg-blue-500" },
      { id: "2023008", name: "Citra Lestari", gender: "P", hadir: 0, izin: 1, sakit: 0, grade: 78, note: "", avatarBg: "bg-pink-500" },
      { id: "2023009", name: "Dimas Anggara", gender: "L", hadir: 0, izin: 0, sakit: 1, grade: 65, note: "Perlu remedial materi trigonometri.", avatarBg: "bg-amber-600" },
    ]
  });

  const classes = Object.keys(studentsData);
  const currentStudents = studentsData[selectedClass] || [];

  // Summary Metrics calculations
  const metrics = useMemo(() => {
    const total = currentStudents.length;
    let totalHadir = 0;
    let totalIzin = 0;
    let totalSakit = 0;
    let totalGrades = 0;

    currentStudents.forEach((student) => {
      totalHadir += student.hadir;
      totalIzin += student.izin;
      totalSakit += student.sakit;
      totalGrades += student.grade;
    });

    const averageGrade = total > 0 ? (totalGrades / total).toFixed(1) : "0.0";

    return {
      total,
      totalHadir,
      totalIzin,
      totalSakit,
      averageGrade,
    };
  }, [currentStudents]);

  // Tab Filtering & Search
  const filteredStudents = useMemo(() => {
    let result = currentStudents;

    // Apply Tab Filter
    if (activeTab === "Hadir Penuh") {
      result = result.filter((s) => s.hadir > 0 && s.izin === 0 && s.sakit === 0);
    } else if (activeTab === "Ada Izin/Sakit") {
      result = result.filter((s) => s.izin > 0 || s.sakit > 0);
    } else if (activeTab === "Punya Catatan") {
      result = result.filter((s) => s.note.trim() !== "");
    }

    // Apply Search
    if (searchQuery.trim()) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.includes(searchQuery)
      );
    }

    return result;
  }, [currentStudents, activeTab, searchQuery]);

  // Count notes for the tab badge
  const countWithNotes = useMemo(() => {
    return currentStudents.filter((s) => s.note.trim() !== "").length;
  }, [currentStudents]);

  // Handler for Export
  const handleExport = () => {
    setNotification("Berhasil mengekspor rekap absensi ke format Excel!");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F8FAFC] min-h-screen relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-xl animate-slideIn">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-xs font-black tracking-tight">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs font-semibold text-gray-400 gap-1.5">
            <span>Rekap Absensi Siswa</span>
            <span>•</span>
            <span>Semester Ganjil 2023/2024 • SMAN 1 Contoh</span>
          </div>
          <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Rekap Absensi Siswa</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            Rangkuman kehadiran dan catatan siswa berdasarkan data yang telah diinput.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-slate-50 text-gray-700 px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-sm active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Ekspor Rekap
        </button>
      </div>

      {/* Pilih Kelas Box */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Pilih Kelas</span>
        <div className="relative w-full sm:w-[240px]">
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSearchQuery("");
            }}
            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none shadow-sm transition-all"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Card 1: Total Siswa */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="text-[26px] font-black text-[#1e293b] leading-none">{metrics.total}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">Total Siswa</span>
        </div>

        {/* Card 2: Total Hadir */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-[26px] font-black text-[#1e293b] leading-none">{metrics.totalHadir}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">Total Hadir</span>
        </div>

        {/* Card 3: Total Izin */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-3.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <span className="text-[26px] font-black text-[#1e293b] leading-none">{metrics.totalIzin}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">Total Izin</span>
        </div>

        {/* Card 4: Total Sakit */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-3.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <span className="text-[26px] font-black text-[#1e293b] leading-none">{metrics.totalSakit}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">Total Sakit</span>
        </div>

        {/* Card 5: Rata-rata Nilai */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <span className="text-[26px] font-black text-[#1e293b] leading-none">{metrics.averageGrade}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">Rata-rata Nilai</span>
        </div>
      </div>

      {/* Main Data Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {/* Filters Tabs and Search bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-1.5">
            {["Semua", "Hadir Penuh", "Ada Izin/Sakit"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab
                    ? "bg-[#1A3D63] text-white shadow-md"
                    : "text-gray-500 bg-white hover:bg-slate-50 border border-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setActiveTab("Punya Catatan")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "Punya Catatan"
                  ? "bg-[#1A3D63] text-white shadow-md"
                  : "text-gray-500 bg-white hover:bg-slate-50 border border-gray-100"
              }`}
            >
              Punya Catatan
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black ${
                  activeTab === "Punya Catatan"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {countWithNotes}
              </span>
            </button>
          </div>

          <div className="relative w-full sm:w-[280px]">
            <input
              type="text"
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-5 py-3 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[50px]">No</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[110px]">NIS</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Siswa</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">Hadir</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">Izin</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">Sakit</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[160px]">% Hadir</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[130px]">Nilai Rata-rata</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Catatan Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => {
                  const totalAbsences = student.hadir + student.izin + student.sakit;
                  const pct = totalAbsences > 0 ? Math.round((student.hadir / totalAbsences) * 100) : 0;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-5 px-4 text-xs font-bold text-gray-400">{idx + 1}</td>
                      <td className="py-5 px-4 text-xs font-bold text-gray-500">{student.id}</td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-sm ${student.avatarBg}`}>
                            {student.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-black text-gray-800">{student.name}</div>
                            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100 rounded">
                              {student.gender}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center text-sm font-extrabold text-gray-800">{student.hadir}</td>
                      <td className={`py-5 px-4 text-center text-sm font-extrabold ${student.izin > 0 ? "text-purple-600" : "text-gray-400"}`}>
                        {student.izin}
                      </td>
                      <td className={`py-5 px-4 text-center text-sm font-extrabold ${student.sakit > 0 ? "text-amber-600" : "text-gray-400"}`}>
                        {student.sakit}
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex flex-col gap-1 w-full max-w-[120px]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-gray-700">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1A3D63] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {pct === 0 && (
                            <span className="text-[9px] font-bold text-red-500 mt-0.5">Perlu perhatian</span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center text-sm font-extrabold text-gray-800">{student.grade}</td>
                      <td className="py-5 px-4">
                        {student.note ? (
                          <div className="flex items-start gap-2 max-w-[280px]">
                            <span className="text-[12px] mt-0.5">💬</span>
                            <p className="text-xs font-medium text-gray-700 line-clamp-2">{student.note}</p>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-gray-300">Belum ada catatan</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm font-bold text-gray-400">
                    Tidak ada data rekap ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold">
            {filteredStudents.length} siswa ditampilkan - {filteredStudents.filter((s) => s.note.trim() !== "").length} punya catatan
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Data bersumber dari: Input Nilai & Absensi Siswa
          </span>
        </div>
      </div>
    </div>
  );
};

export default RekapAbsensiSiswa;
