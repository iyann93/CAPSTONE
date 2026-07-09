import React, { useState } from "react";

const initialStudents = [
  { id: 1, name: "Andi Pratama", nis: "2023001", initials: "AP", color: "bg-[#3B82F6]", gender: "L", status: "Hadir", ket: "" },
  { id: 2, name: "Dewi Sartika", nis: "2023002", initials: "DS", color: "bg-[#10B981]", gender: "P", status: "Hadir", ket: "" },
  { id: 3, name: "Ricky Firmansyah", nis: "2023003", initials: "RF", color: "bg-[#F59E0B]", gender: "L", status: "Sakit", ket: "Surat dokter terlampir" },
  { id: 4, name: "Nurul Hidayah", nis: "2023004", initials: "NH", color: "bg-[#EF4444]", gender: "P", status: "Hadir", ket: "" },
  { id: 5, name: "Fajar Setiawan", nis: "2023005", initials: "FS", color: "bg-[#8B5CF6]", gender: "L", status: "Izin", ket: "Acara keluarga" },
  { id: 6, name: "Ayu Lestari", nis: "2023006", initials: "AL", color: "bg-[#EC4899]", gender: "P", status: "Hadir", ket: "" },
  { id: 7, name: "Bagas Prasetyo", nis: "2023007", initials: "BP", color: "bg-[#10B981]", gender: "L", status: "Hadir", ket: "" },
  { id: 8, name: "Citra Dewi", nis: "2023008", initials: "CD", color: "bg-[#6366F1]", gender: "P", status: "Hadir", ket: "" },
  { id: 9, name: "Dimas Kurniawan", nis: "2023009", initials: "DK", color: "bg-[#3B82F6]", gender: "L", status: "Hadir", ket: "" },
  { id: 10, name: "Siti Rahmawati", nis: "2023010", initials: "SR", color: "bg-[#EC4899]", gender: "P", status: "Hadir", ket: "" },
  { id: 11, name: "Eko Prasetyo", nis: "2023011", initials: "EP", color: "bg-[#F59E0B]", gender: "L", status: "Hadir", ket: "" },
  { id: 12, name: "Fira Aulia", nis: "2023012", initials: "FA", color: "bg-[#EF4444]", gender: "P", status: "Hadir", ket: "" },
];

const StudentAttendanceInput = ({ classData, selectedDate, onBack, onSave }) => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const [res, absensiRes] = await Promise.all([
          api.get(`/siswa?kelas_id=${classData.id}&limit=1000`),
          api.get(`/absensi?tanggal=${selectedDate}&kelas_id=${classData.id}&limit=1000`)
        ]);
        const classStudents = res.data?.data || [];
        const existingAbsensi = absensiRes.data?.data || [];
        
        if (classStudents.length === 0) {
          setStudents([]);
          return;
        }

        const mapped = classStudents.map((s, idx) => {
          const existing = existingAbsensi.find(a => a.siswa_id === s.id);
          return {
            id: s.id,
            name: s.nama_lengkap || "Tanpa Nama",
            nis: s.nis || "-",
            initials: (s.nama_lengkap || "S").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
            color: ["bg-[#3B82F6]", "bg-[#10B981]", "bg-[#F59E0B]", "bg-[#EF4444]", "bg-[#8B5CF6]", "bg-[#EC4899]"][idx % 6],
            gender: s.jenis_kelamin === "Perempuan" ? "P" : "L",
            status: existing ? existing.status : "Hadir", // default Hadir jika belum ada
            ket: existing ? (existing.keterangan || "") : ""
          };
        });
        setStudents(mapped);
      } catch (err) {
        console.error("Gagal memuat siswa:", err);
        setStudents([]);
      }
    };
    fetchStudents();
  }, [classData.id, selectedDate]);
  const [filterStatus, setFilterStatus] = useState("Semua");

  const handleSave = async () => {
    try {
      const { default: api } = await import('../../api/axios');
      // Prepare payload
      const payload = students.map(s => ({
        siswaId: s.id,
        kelasId: classData.id,
        tanggal: selectedDate || new Date().toISOString().split('T')[0],
        status: s.status,
        keterangan: s.ket
      }));
      
      await api.post('/absensi', payload);

      onSave({
        hadir: counts.Hadir,
        sakit: counts.Sakit,
        izin: counts.Izin,
        alpha: counts.Alpha,
        pct: pctHadir
      });
    } catch (e) {
      console.error("Gagal menyimpan absensi:", e);
      alert("Gagal menyimpan absensi");
    }
  };

  const setAllStatus = (status) => {
    setStudents(students.map(s => ({ ...s, status })));
  };

  const updateStudentStatus = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const updateStudentKet = (id, ket) => {
    setStudents(students.map(s => s.id === id ? { ...s, ket } : s));
  };

  const counts = {
    Hadir: students.filter(s => s.status === 'Hadir').length,
    Sakit: students.filter(s => s.status === 'Sakit').length,
    Izin: students.filter(s => s.status === 'Izin').length,
    Alpha: students.filter(s => s.status === 'Alpha').length,
  };

  const totalStudents = students.length;
  const pctHadir = totalStudents > 0 ? Math.round((counts.Hadir / totalStudents) * 100) : 0;
  const pctSakit = totalStudents > 0 ? Math.round((counts.Sakit / totalStudents) * 100) : 0;
  const pctIzin = totalStudents > 0 ? Math.round((counts.Izin / totalStudents) * 100) : 0;
  const pctAlpha = totalStudents > 0 ? Math.round((counts.Alpha / totalStudents) * 100) : 0;

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="flex items-center text-[13px] text-gray-500 gap-2">
            <span>Dashboard</span>
            <span>&rsaquo;</span>
            <span>Absensi Siswa</span>
            <span>&rsaquo;</span>
            <span className="font-bold text-[#1e293b]">Input — {classData.name}</span>
          </div>

          <div className="flex items-start gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-[#1e293b] shadow-sm transition-colors mt-0.5 flex-shrink-0"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-bold text-[#1e293b]">Input Absensi</h1>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-md text-[12px] font-bold">{classData.name}</span>
                <span className="px-2.5 py-1 bg-orange-100 text-orange-600 rounded-md text-[12px] font-bold">Sedang Diedit</span>
              </div>
              <p className="text-gray-500 text-[14px] mt-1">
                {selectedDate} · Wali Kelas: {classData.wali}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold shadow-sm transition-colors mt-6 md:mt-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Simpan Absensi
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden flex flex-col">
            
            {/* Top Toolbar: Bulk Actions */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-gray-500">Tandai semua sebagai:</span>
                <div className="flex gap-2">
                  <button onClick={() => setAllStatus('Hadir')} className="px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[12px] font-bold transition-colors">Hadir Semua</button>
                  <button onClick={() => setAllStatus('Sakit')} className="px-3 py-1.5 rounded-lg border border-orange-200 text-orange-500 hover:bg-orange-50 text-[12px] font-bold transition-colors">Sakit Semua</button>
                  <button onClick={() => setAllStatus('Izin')} className="px-3 py-1.5 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 text-[12px] font-bold transition-colors">Izin Semua</button>
                  <button onClick={() => setAllStatus('Alpha')} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-[12px] font-bold transition-colors">Alpha Semua</button>
                </div>
              </div>
              <button onClick={() => setAllStatus('Hadir')} className="text-[#3B82F6] text-[13px] font-bold hover:underline">
                Reset Semua → Hadir
              </button>
            </div>

            {/* Middle Toolbar: Tabs & Search */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto hide-scrollbar">
                <button onClick={() => setFilterStatus("Semua")} className={`px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm whitespace-nowrap ${filterStatus === 'Semua' ? 'bg-[#3B82F6] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Semua</button>
                <button onClick={() => setFilterStatus("Hadir")} className={`px-4 py-2 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors ${filterStatus === 'Hadir' ? 'bg-[#3B82F6] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Hadir({counts.Hadir})</button>
                <button onClick={() => setFilterStatus("Sakit")} className={`px-4 py-2 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors ${filterStatus === 'Sakit' ? 'bg-[#3B82F6] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Sakit({counts.Sakit})</button>
                <button onClick={() => setFilterStatus("Izin")} className={`px-4 py-2 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors ${filterStatus === 'Izin' ? 'bg-[#3B82F6] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Izin({counts.Izin})</button>
                <button onClick={() => setFilterStatus("Alpha")} className={`px-4 py-2 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors ${filterStatus === 'Alpha' ? 'bg-[#3B82F6] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Alpha({counts.Alpha})</button>
              </div>

              <div className="relative w-full md:w-[260px]">
                <input
                  type="text"
                  placeholder="Cari nama atau NIS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all bg-gray-50 focus:bg-white"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            {/* Student List */}
            <div className="divide-y divide-gray-100">
              {students.filter(student => {
                const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.nis.includes(searchQuery);
                const matchesFilter = filterStatus === "Semua" || student.status === filterStatus;
                return matchesSearch && matchesFilter;
              }).map((student, idx) => (
                <div key={student.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-bold text-gray-400 w-4 text-center">{idx + 1}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0 ${student.color}`}>
                      {student.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-[#1e293b]">{student.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${student.gender === 'L' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>{student.gender}</span>
                      </div>
                      <span className="text-[12px] text-gray-400 font-mono mt-0.5 block">{student.nis}</span>
                    </div>
                  </div>

                  {/* Attendance Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                      <button 
                        onClick={() => updateStudentStatus(student.id, 'Hadir')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${student.status === 'Hadir' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                      >Hadir</button>
                      <button 
                        onClick={() => updateStudentStatus(student.id, 'Sakit')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${student.status === 'Sakit' ? 'bg-orange-400 text-white shadow-sm' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'}`}
                      >Sakit</button>
                      <button 
                        onClick={() => updateStudentStatus(student.id, 'Izin')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${student.status === 'Izin' ? 'bg-purple-500 text-white shadow-sm' : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'}`}
                      >Izin</button>
                      <button 
                        onClick={() => updateStudentStatus(student.id, 'Alpha')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${student.status === 'Alpha' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
                      >Alpha</button>
                    </div>

                    <div className="relative w-full lg:w-[160px]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[12px] font-bold">+</span>
                      <input 
                        type="text" 
                        placeholder="Keterangan"
                        value={student.ket}
                        onChange={(e) => updateStudentKet(student.id, e.target.value)}
                        className={`w-full pl-7 pr-3 py-2 border rounded-xl text-[12px] font-medium focus:outline-none focus:ring-2 transition-all ${student.ket ? 'border-blue-300 bg-blue-50 text-blue-700 focus:ring-blue-500/20' : 'border-gray-200 bg-white text-gray-700 focus:border-[#3B82F6] focus:ring-[#3B82F6]/20'}`}
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-[320px] space-y-6">
          
          {/* Rekap Sementara */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              Rekap Sementara
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 mb-6">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" strokeWidth="4.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray={`${pctHadir}, 100`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[26px] font-bold text-[#1e293b] leading-tight">{pctHadir}%</span>
                  <span className="text-[12px] text-[#10B981] font-medium mt-0.5">Hadir</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-white shadow-sm"></div><span className="text-gray-600">Hadir</span></div>
                  <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pctHadir}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{counts.Hadir}</span></div>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-2 border-orange-400 bg-white shadow-sm"></div><span className="text-gray-600">Sakit</span></div>
                  <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400 rounded-full" style={{ width: `${pctSakit}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{counts.Sakit}</span></div>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-2 border-purple-500 bg-white shadow-sm"></div><span className="text-gray-600">Izin</span></div>
                  <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${pctIzin}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{counts.Izin}</span></div>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-2 border-red-500 bg-white shadow-sm"></div><span className="text-gray-600">Alpha</span></div>
                  <div className="flex items-center gap-3"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${pctAlpha}%` }}></div></div><span className="font-bold text-[#1e293b] w-6 text-right">{counts.Alpha}</span></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-[13px]">
              <span className="text-gray-500">Total Siswa</span>
              <span className="font-bold text-[#1e293b]">{totalStudents} siswa</span>
            </div>
          </div>

          {/* Informasi Kelas */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Informasi Kelas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Kelas</span>
                <span className="font-bold text-[#1e293b]">{classData.name}</span>
              </div>

              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Wali Kelas</span>
                <span className="font-bold text-[#1e293b] text-right">{classData.wali}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Kapasitas</span>
                <span className="font-bold text-[#1e293b]">{classData.students} siswa</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Semester</span>
                <span className="font-bold text-[#1e293b]">Ganjil 2023/2024</span>
              </div>
            </div>
          </div>

          {/* Kelas Lain */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Kelas Lain</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-[#1e293b]">VII A</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Selesai</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-[#1e293b]">VII B</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Selesai</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-[#1e293b]">VIII A</span>
                <span className="text-orange-500 font-bold flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Belum</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-[#1e293b]">IX A</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Selesai</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Simpan Absensi Kelas {classData.name}
          </button>

        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceInput;


