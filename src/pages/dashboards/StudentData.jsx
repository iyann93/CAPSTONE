import React, { useState } from "react";
import StudentForm from "./StudentForm";
import StudentDetail from "./StudentDetail";
import StudentEdit from "./StudentEdit";

const initialStudents = [
  {
    id: 1,
    name: "Andi Pratama",
    email: "andi.pratama@student.sman1.sch.id",
    nis: "2023001",
    nisn: "0045678901",
    kelas: "X IPA 1",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "L",
    nilaiRataRata: 87.5,
    kehadiran: 95,
    status: "Aktif",
    avatarColor: "bg-[#3B82F6]",
    initials: "AP"
  },
  {
    id: 2,
    name: "Dewi Sartika",
    email: "dewi.sartika@student.sman1.sch.id",
    nis: "2023002",
    nisn: "0045678902",
    kelas: "X IPA 1",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "P",
    nilaiRataRata: 91.2,
    kehadiran: 98,
    status: "Aktif",
    avatarColor: "bg-[#10B981]",
    initials: "DS"
  },
  {
    id: 3,
    name: "Ricky Firmansyah",
    email: "ricky.f@student.sman1.sch.id",
    nis: "2023003",
    nisn: "0045678903",
    kelas: "X IPA 1",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "L",
    nilaiRataRata: 78.3,
    kehadiran: 88,
    status: "Aktif",
    avatarColor: "bg-[#F59E0B]",
    initials: "RF"
  },
  {
    id: 4,
    name: "Nurul Hidayah",
    email: "nurul.h@student.sman1.sch.id",
    nis: "2023004",
    nisn: "0045678904",
    kelas: "X IPA 1",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "P",
    nilaiRataRata: 85.6,
    kehadiran: 92,
    status: "Aktif",
    avatarColor: "bg-[#EF4444]",
    initials: "NH"
  },
  {
    id: 5,
    name: "Fajar Setiawan",
    email: "fajar.s@student.sman1.sch.id",
    nis: "2023005",
    nisn: "0045678905",
    kelas: "X IPA 1",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "L",
    nilaiRataRata: 82.1,
    kehadiran: 90,
    status: "Aktif",
    avatarColor: "bg-[#8B5CF6]",
    initials: "FS"
  },
  {
    id: 6,
    name: "Ayu Lestari",
    email: "ayu.lestari@student.sman1.sch.id",
    nis: "2023006",
    nisn: "0045678906",
    kelas: "X IPA 1",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "P",
    nilaiRataRata: 93.7,
    kehadiran: 99,
    status: "Aktif",
    avatarColor: "bg-[#EC4899]",
    initials: "AL"
  },
  {
    id: 7,
    name: "Budi Santoso",
    email: "budi.s@student.sman1.sch.id",
    nis: "2023007",
    nisn: "0045678907",
    kelas: "X IPA 2",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "L",
    nilaiRataRata: 80.5,
    kehadiran: 91,
    status: "Aktif",
    avatarColor: "bg-[#10B981]",
    initials: "BS"
  },
  {
    id: 8,
    name: "Citra Dewi",
    email: "citra.d@student.sman1.sch.id",
    nis: "2023008",
    nisn: "0045678908",
    kelas: "X IPA 2",
    tingkat: "Kelas X",
    jurusan: "IPA",
    gender: "P",
    nilaiRataRata: 88.2,
    kehadiran: 96,
    status: "Aktif",
    avatarColor: "bg-[#6366F1]",
    initials: "CD"
  },
  {
    id: 9,
    name: "Dian Purnama",
    email: "dian.p@student.sman1.sch.id",
    nis: "2023009",
    nisn: "0045678909",
    kelas: "X IPS 1",
    tingkat: "Kelas X",
    jurusan: "IPS",
    gender: "P",
    nilaiRataRata: 84.0,
    kehadiran: 93,
    status: "Aktif",
    avatarColor: "bg-[#3B82F6]",
    initials: "DP"
  },
  {
    id: 10,
    name: "Eko Prasetyo",
    email: "eko.p@student.sman1.sch.id",
    nis: "2023010",
    nisn: "0045678910",
    kelas: "X IPS 1",
    tingkat: "Kelas X",
    jurusan: "IPS",
    gender: "L",
    nilaiRataRata: 76.8,
    kehadiran: 85,
    status: "Aktif",
    avatarColor: "bg-[#10B981]",
    initials: "EP"
  }
];

const StudentData = () => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students_data');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [viewMode, setViewMode] = useState("list"); // 'list', 'add', 'edit', 'detail'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("Semua Kelas");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdd = (newStudent) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('students_data', JSON.stringify(updated));
    setViewMode("list");
  };

  const handleEdit = (updatedStudent) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    localStorage.setItem('students_data', JSON.stringify(updated));
    setViewMode("list");
    setSelectedStudent(null);
  };

  const handleDelete = (id) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    localStorage.setItem('students_data', JSON.stringify(updated));
    if (viewMode !== "list") {
      setViewMode("list");
      setSelectedStudent(null);
    }
  };

  if (viewMode === "add") {
    return <StudentForm onBack={() => setViewMode("list")} onSave={handleAdd} />;
  }

  if (viewMode === "edit" && selectedStudent) {
    return <StudentEdit student={selectedStudent} onBack={() => setViewMode("list")} onSave={handleEdit} onDelete={handleDelete} />;
  }

  if (viewMode === "detail" && selectedStudent) {
    return <StudentDetail student={selectedStudent} onBack={() => setViewMode("list")} onEdit={(s) => { setSelectedStudent(s); setViewMode("edit"); }} />;
  }

  const tabs = ["Semua Kelas", "Kelas X", "Kelas XI", "Kelas XII"];

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Data Siswa</h1>
          <p className="text-gray-500 text-[15px] mt-1">
            Kelola data seluruh siswa aktif, informasi pribadi, dan rekap akademik.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 shadow-sm transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Ekspor Data
          </button>
          <button 
            onClick={() => setViewMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold shadow-sm transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {[
          { label: "Total Siswa", val: students.length, subText: "Semua angkatan" },
          { label: "Siswa Aktif", val: students.filter(s => s.status === "Aktif").length, subText: "Sedang belajar" },
          { label: "Siswa Baru", val: students.filter(s => (s.tahunMasuk === "2023" || !s.tahunMasuk)).length, subText: "Tahun ajaran 2023" },
          { label: "Alumni", val: 0, subText: "Telah lulus" },
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

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-colors ${
                  activeTab === tab
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-[14px] font-bold hover:bg-gray-50 transition-colors whitespace-nowrap">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Filter
            </button>
            <div className="relative w-full md:w-[280px]">
              <input
                type="text"
                placeholder="Cari nama, NIS, atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all bg-gray-50 focus:bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">No</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Siswa</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">NIS / NISN</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Kelas</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Tingkat</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Jurusan</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center">L/P</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Nilai Rata-rata</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Kehadiran</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.filter(student => {
                 const matchTab = activeTab === "Semua Kelas" || student.tingkat === activeTab;
                 const matchSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.nis.includes(searchQuery) || student.kelas.toLowerCase().includes(searchQuery.toLowerCase());
                 return matchTab && matchSearch;
               }).map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[14px] text-gray-500">{index + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1A3D63]/10 text-[#1A3D63] flex items-center justify-center text-[13px] font-bold flex-shrink-0">
                        {student.initials}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#1e293b] flex items-center gap-1.5">
                          {student.name}
                          {(index === 0 || index === 1 || index === 5) && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                          )}
                        </div>
                        <div className="text-[12px] text-gray-500 mt-0.5">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-[14px] font-medium text-[#1e293b]">{student.nis}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 font-mono">{student.nisn}</div>
                  </td>
                  <td className="py-4 px-6 text-[14px] font-medium text-[#1e293b] whitespace-nowrap">{student.kelas}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[12px] font-bold whitespace-nowrap">
                      {student.tingkat}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-bold whitespace-nowrap ${student.jurusan === 'IPA' ? 'bg-[#1A3D63]/10 text-[#1A3D63]' : 'bg-slate-100 text-slate-700'}`}>
                      {student.jurusan}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-[12px] font-bold">
                      {student.gender}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 w-[120px]">
                      <span className="text-[14px] font-bold text-[#1A3D63]">
                        {student.nilaiRataRata}
                      </span>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#1A3D63]"
                          style={{ width: `${student.nilaiRataRata}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 w-[100px]">
                      <span className="text-[14px] font-medium text-gray-700">{student.kehadiran}%</span>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#4A7FA7]"
                          style={{ width: `${student.kehadiran}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[12px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Aktif
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedStudent(student); setViewMode("detail"); }}
                        className="p-1.5 text-gray-400 hover:text-[#3B82F6] transition-colors rounded-lg hover:bg-blue-50"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button 
                        onClick={() => { setSelectedStudent(student); setViewMode("edit"); }}
                        className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Apakah Anda yakin ingin menghapus siswa ${student.name}?`)) {
                            handleDelete(student.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-[13px]">
          <div className="text-gray-500">
            Total {students.length} siswa
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#3B82F6] text-white rounded-lg font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">2</button>
            <button className="p-1.5 border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentData;
