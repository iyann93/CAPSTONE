import React, { useState } from "react";
import StudentAttendanceInput from "./StudentAttendanceInput";
import StudentAttendanceRecap from "./StudentAttendanceRecap";

const classData = [
  { id: 1, name: "VII IPA 1", students: 32, tingkat: "Kelas VII", jurusan: "IPA", wali: "Ibu Sari Dewi, S.Pd", hadir: 30, sakit: 1, izin: 1, alpha: 0, pct: 94, waktu: "07:45", admin: "Siti Rahayu", status: "Selesai" },
  { id: 2, name: "VII IPA 2", students: 31, tingkat: "Kelas VII", jurusan: "IPA", wali: "Bpk. Ahmad Fauzi, M.Pd", hadir: 29, sakit: 2, izin: 0, alpha: 0, pct: 94, waktu: "07:50", admin: "Siti Rahayu", status: "Selesai" },
  { id: 3, name: "VII IPS 1", students: 30, tingkat: "Kelas VII", jurusan: "IPS", wali: "Ibu Dewi Anggraini, S.E", hadir: 28, sakit: 0, izin: 1, alpha: 1, pct: 93, waktu: "08:00", admin: "Siti Rahayu", status: "Selesai" },
  { id: 4, name: "VII IPS 2", students: 29, tingkat: "Kelas VII", jurusan: "IPS", wali: "Bpk. Budi Hartono, S.Pd", hadir: null, sakit: null, izin: null, alpha: null, pct: null, waktu: null, admin: null, status: "Belum Input" },
  { id: 5, name: "VII Bahasa 1", students: 28, tingkat: "Kelas VII", jurusan: "Bahasa", wali: "Ibu Nurdiana, S.Pd", hadir: null, sakit: null, izin: null, alpha: null, pct: null, waktu: null, admin: null, status: "Belum Input" },
  { id: 6, name: "VIII IPA 1", students: 33, tingkat: "Kelas VIII", jurusan: "IPA", wali: "Ibu Rani Kusuma, S.Pd", hadir: 31, sakit: 1, izin: 1, alpha: 0, pct: 94, waktu: "07:48", admin: "Siti Rahayu", status: "Selesai" },
  { id: 7, name: "VIII IPA 2", students: 32, tingkat: "Kelas VIII", jurusan: "IPA", wali: "Bpk. Hendra Wijaya, M.Si", hadir: 30, sakit: 0, izin: 2, alpha: 0, pct: 94, waktu: "07:55", admin: "Siti Rahayu", status: "Selesai" },
  { id: 8, name: "VIII IPS 1", students: 30, tingkat: "Kelas VIII", jurusan: "IPS", wali: "Ibu Maya Sari, S.Pd", hadir: null, sakit: null, izin: null, alpha: null, pct: null, waktu: null, admin: null, status: "Belum Input" },
  { id: 9, name: "VIII IPS 2", students: 31, tingkat: "Kelas VIII", jurusan: "IPS", wali: "Bpk. Agus Santoso, S.E", hadir: 29, sakit: 1, izin: 1, alpha: 0, pct: 94, waktu: "08:02", admin: "Siti Rahayu", status: "Selesai" },
  { id: 10, name: "IX IPA 1", students: 28, tingkat: "Kelas IX", jurusan: "IPA", wali: "Ibu Siti Aminah, M.Pd", hadir: 27, sakit: 1, izin: 0, alpha: 0, pct: 96, waktu: "07:42", admin: "Siti Rahayu", status: "Selesai" },
  { id: 11, name: "IX IPA 2", students: 30, tingkat: "Kelas IX", jurusan: "IPA", wali: "Bpk. Budi Setiawan, S.Pd", hadir: null, sakit: null, izin: null, alpha: null, pct: null, waktu: null, admin: null, status: "Belum Input" },
  { id: 12, name: "IX IPS 1", students: 29, tingkat: "Kelas IX", jurusan: "IPS", wali: "Ibu Retno Wulandari, S.Pd", hadir: 28, sakit: 0, izin: 1, alpha: 0, pct: 97, waktu: "07:58", admin: "Siti Rahayu", status: "Selesai" },
];

const StudentAttendance = () => {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('attendance_classes');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOldData = parsed.some(s => {
        if (!s.name) return false;
        const n = s.name.toUpperCase();
        return n.startsWith("X ") || n.startsWith("XI ") || n.startsWith("XII ");
      });
      if (!hasOldData) return parsed;
    }
    return classData;
  });
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    // Sinkronisasi otomatis dengan Data Siswa riil dari API
    const syncWithRealData = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const res = await api.get('/siswa?limit=1000');
        const allStudents = res.data?.data || [];
        
        if (allStudents.length === 0) return; // Jika kosong, biarkan pakai mock/data yang ada

        const classMap = {};
        allStudents.forEach(s => {
          const className = s.nama_kelas || "Tanpa Kelas";
          if (!classMap[className]) {
            classMap[className] = {
              name: className,
              students: 0,
              wali: "Belum Ditentukan", // Default if not found
              jurusan: className.includes('IPA') ? 'IPA' : className.includes('IPS') ? 'IPS' : className.includes('Bahasa') ? 'Bahasa' : '-',
              tingkat: className.split(' ')[0] || '-',
            };
          }
          classMap[className].students += 1;
        });

        setClasses(prevClasses => {
          const newClasses = Object.values(classMap).map((cls, idx) => {
            const existing = prevClasses.find(c => c.name === cls.name);
            if (existing) {
              return { ...existing, students: cls.students, jurusan: cls.jurusan, tingkat: cls.tingkat };
            }
            return {
              id: Date.now() + idx,
              name: cls.name,
              students: cls.students,
              tingkat: cls.tingkat,
              jurusan: cls.jurusan,
              wali: cls.wali,
              hadir: null, sakit: null, izin: null, alpha: null, pct: null, waktu: null, admin: null,
              status: "Belum Input"
            };
          });
          
          localStorage.setItem('attendance_classes', JSON.stringify(newClasses));
          return newClasses;
        });

      } catch (err) {
        console.error("Gagal sinkronisasi data kelas dari API:", err);
      }
    };

    syncWithRealData();
  }, []);

  const handleSaveAttendance = (classId, attendanceResults) => {
    const now = new Date();
    const formatTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const updated = classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          hadir: attendanceResults.hadir,
          sakit: attendanceResults.sakit,
          izin: attendanceResults.izin,
          alpha: attendanceResults.alpha,
          pct: attendanceResults.pct,
          waktu: formatTime,
          admin: "Siti Rahayu",
          status: "Selesai"
        };
      }
      return c;
    });
    setClasses(updated);
    localStorage.setItem('attendance_classes', JSON.stringify(updated));
    setSelectedClass(null);
  };

  const totalClasses = classes.length;
  const inputtedClasses = classes.filter(c => c.status === "Selesai").length;
  const inputProgressPct = Math.round((inputtedClasses / totalClasses) * 100) || 0;

  const finishedClassesStudents = classes.filter(c => c.status === "Selesai").reduce((acc, c) => acc + c.students, 0);
  const totalHadir = classes.reduce((acc, c) => acc + (c.hadir || 0), 0);
  const totalSakit = classes.reduce((acc, c) => acc + (c.sakit || 0), 0);
  const totalIzin = classes.reduce((acc, c) => acc + (c.izin || 0), 0);
  const totalAlpha = classes.reduce((acc, c) => acc + (c.alpha || 0), 0);
  const totalNotInputted = classes.filter(c => c.status !== "Selesai").length;
  const avgAttendancePct = finishedClassesStudents > 0 ? Math.round((totalHadir / finishedClassesStudents) * 100) : 0;
  const [activeTab, setActiveTab] = useState("Semua Kelas");
  const [selectedClass, setSelectedClass] = useState(null);
  const [recapClass, setRecapClass] = useState(null);

  if (recapClass) {
    return <StudentAttendanceRecap classData={recapClass} onBack={() => setRecapClass(null)} />;
  }

  if (selectedClass) {
    return <StudentAttendanceInput classData={selectedClass} onBack={() => setSelectedClass(null)} onSave={(results) => handleSaveAttendance(selectedClass.id, results)} />;
  }

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Absensi Siswa</h1>
          <p className="text-gray-500 text-[15px] mt-1">
            Monitor dan input kehadiran siswa harian per kelas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="date" defaultValue="2023-11-20" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-medium shadow-sm outline-none focus:border-[#1A3D63]" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 shadow-sm transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Ekspor
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A3D63" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h3 className="text-[15px] font-bold text-[#1e293b]">Progress Input Absensi — Senin, 20 November 2023</h3>
          </div>
          <div className="flex items-center gap-4 text-[13px] font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Sudah: {inputtedClasses} kelas</span>
            <span className="flex items-center gap-1.5 text-gray-500"><div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>Belum: {totalClasses - inputtedClasses} kelas</span>
          </div>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-[#1A3D63] rounded-full transition-all" style={{ width: `${inputProgressPct}%` }}></div>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-500">{inputtedClasses} dari {totalClasses} kelas telah diinput</span>
          <span className="font-bold text-[#1A3D63]">{inputProgressPct}%</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {[
          { label: "Tingkat Kehadiran", val: `${avgAttendancePct}%`, subText: `${totalHadir} dari ${finishedClassesStudents} siswa` },
          { label: "Hadir", val: String(totalHadir), subText: "Siswa hadir hari ini" },
          { label: "Tidak Hadir", val: String(totalSakit + totalIzin + totalAlpha), subText: `S:${totalSakit} I:${totalIzin} A:${totalAlpha}` },
          { label: "Kelas Belum Input", val: String(totalNotInputted), subText: "Perlu segera diinput" },
        ].map((card, i) => (
          <div key={i} className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
            <div>
              <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{card.label}</div>
              <div className="text-3xl font-black text-white">{card.val}</div>
              <div className="text-xs font-medium text-blue-300 mt-2">{card.subText}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A3D63" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              Trend Kehadiran Mingguan
            </h3>
            <div className="flex items-center gap-4 text-[12px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-[#1A3D63]"></div>Hadir</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-amber-500"></div>Sakit</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-violet-500"></div>Izin</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500"></div>Alpha</span>
            </div>
          </div>
          
          <div className="h-[220px] flex flex-col relative px-4">
            {/* Chart Area */}
            <div className="flex-1 flex items-end justify-between relative pl-8 pb-2 border-b border-gray-100">
              {/* Y Axis */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[11px] text-gray-400 py-2">
                <span>280</span><span>180</span><span>120</span><span>60</span><span>0</span>
              </div>
              
              {/* Grid lines */}
              <div className="absolute left-8 right-0 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
                <div className="w-full border-b border-gray-100"></div>
                <div className="w-full border-b border-gray-100"></div>
                <div className="w-full border-b border-gray-100"></div>
                <div className="w-full border-b border-gray-100"></div>
                <div className="w-full border-b border-gray-100 opacity-0"></div> {/* Bottom line handled by container */}
              </div>

              {/* Bars */}
              <div className="w-full flex justify-around relative z-10 h-full py-2">
                {[230, 225, 235, 228, 220, 232].map((val, i) => (
                  <div key={i} className="flex flex-col items-center justify-end h-full">
                    <div className="w-4 bg-[#1A3D63] rounded-t-sm" style={{ height: `${(val/280)*100}%` }}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* VII Axis labels */}
            <div className="flex justify-around pl-8 text-[12px] text-gray-500 font-medium pt-3">
              <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sen</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
          <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-6">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A3D63" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            Distribusi Hari Ini
          </h3>
          <div className="flex flex-col items-center">
            {/* Pseudo Donut Chart */}
            <div className="relative w-[150px] h-[150px] mb-6">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Gray background ring */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EEF0F5"
                  strokeWidth="4.5"
                />
                {/* 3 equal blue arcs: each arc=21.3, each gap=12.03, total=100 */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1A3D63"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray={`${avgAttendancePct} 100`}

                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[28px] font-extrabold text-[#111827] tracking-tight">{avgAttendancePct}%</span>
                <span className="text-[14px] text-gray-400 font-medium mt-0.5">Hadir</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1A3D63] border-2 border-white shadow-sm"></div><span className="text-gray-600">Hadir</span></div>
                <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full"><div className="w-full h-full bg-[#1A3D63] rounded-full" style={{ width: `${avgAttendancePct}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{totalHadir}</span></div>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div><span className="text-gray-600">Sakit</span></div>
                <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full"><div className="w-full h-full bg-amber-500 rounded-full" style={{ width: `${finishedClassesStudents > 0 ? (totalSakit / finishedClassesStudents) * 100 : 0}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{totalSakit}</span></div>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-violet-500 border-2 border-white shadow-sm"></div><span className="text-gray-600">Izin</span></div>
                <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full"><div className="w-full h-full bg-violet-500 rounded-full" style={{ width: `${finishedClassesStudents > 0 ? (totalIzin / finishedClassesStudents) * 100 : 0}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{totalIzin}</span></div>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500 border-2 border-white shadow-sm"></div><span className="text-gray-600">Alpha</span></div>
                <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full"><div className="w-full h-full bg-rose-500 rounded-full" style={{ width: `${finishedClassesStudents > 0 ? (totalAlpha / finishedClassesStudents) * 100 : 0}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{totalAlpha}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {["Semua Kelas", "Kelas VII", "Kelas VIII", "Kelas IX"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-colors ${
                  activeTab === tab
                    ? "bg-[#1A3D63] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-[280px]">
            <input
              type="text"
              placeholder="Cari kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all bg-gray-50 focus:bg-white"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">No</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kelas</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tingkat</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jurusan</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Wali Kelas</th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Hadir</th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Sakit</th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Izin</th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Alpha</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">% Hadir</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Waktu Input</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classes.filter(cls => {
                 const matchTab = activeTab === "Semua Kelas" || cls.tingkat === activeTab;
                 const matchSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || cls.wali.toLowerCase().includes(searchQuery.toLowerCase());
                 return matchTab && matchSearch;
               }).map((cls, index) => (
                <tr key={cls.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[13px] text-gray-500">{index + 1}</td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-bold text-[#1e293b] whitespace-nowrap">{cls.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{cls.students} siswa</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[11px] font-bold whitespace-nowrap border border-gray-200">
                      {cls.tingkat}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap border ${cls.jurusan === 'IPA' ? 'bg-[#1A3D63]/10 text-[#1A3D63] border-[#1A3D63]/25' : cls.jurusan === 'IPS' ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {cls.jurusan}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-600 whitespace-nowrap">{cls.wali}</td>
                  <td className="py-4 px-4 text-center text-[14px] font-bold text-emerald-600">{cls.hadir !== null ? cls.hadir : <span className="text-gray-300">—</span>}</td>
                  <td className="py-4 px-4 text-center text-[14px] font-bold text-orange-400">{cls.sakit !== null ? cls.sakit : <span className="text-gray-300">—</span>}</td>
                  <td className="py-4 px-4 text-center text-[14px] font-bold text-purple-500">{cls.izin !== null ? cls.izin : <span className="text-gray-300">—</span>}</td>
                  <td className="py-4 px-4 text-center text-[14px] font-bold text-red-500">{cls.alpha !== null ? cls.alpha : <span className="text-gray-300">—</span>}</td>
                  <td className="py-4 px-6">
                    {cls.pct ? (
                      <div className="flex items-center gap-2 w-[80px]">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1A3D63] rounded-full" style={{ width: `${cls.pct}%` }}></div>
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">{cls.pct}%</span>
                      </div>
                    ) : <span className="text-gray-300 text-[13px] font-medium">—</span>}
                  </td>
                  <td className="py-4 px-6">
                    {cls.waktu ? (
                      <div>
                        <p className="text-[13px] font-bold text-[#1e293b]">{cls.waktu}</p>
                        <p className="text-[11px] text-gray-400">{cls.admin}</p>
                      </div>
                    ) : <span className="text-gray-300 text-[13px] font-medium">Belum</span>}
                  </td>
                  <td className="py-4 px-6">
                    {cls.status === "Selesai" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold whitespace-nowrap">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-[11px] font-bold whitespace-nowrap">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Belum Input
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {cls.status === "Selesai" ? (
                        <>
                          <button onClick={() => setSelectedClass(cls)} className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit
                          </button>
                          <button onClick={() => setRecapClass(cls)} className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Rekap
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setSelectedClass(cls)} className="px-3 py-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-sm animate-pulse">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                            Input
                          </button>
                          <button onClick={() => setRecapClass(cls)} className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Rekap
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-[13px]">
          <div className="text-gray-500">
            Total {classes.length} kelas ditampilkan
          </div>
          <button className="px-4 py-2 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-xl text-[13px] font-bold flex items-center gap-2 shadow-sm transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Input Absensi Cepat
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;



