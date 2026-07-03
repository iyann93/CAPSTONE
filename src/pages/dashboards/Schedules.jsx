import React, { useState, useEffect } from "react";
import ScheduleAdd from "./ScheduleAdd";
import ScheduleEdit from "./ScheduleEdit";

// Mock Schedule Data
const MOCK_SCHEDULES = [
  { id: 1, class: "VII IPA 1", day: "Senin", time: "07:00-08:30", period: "Jam ke-1-2", code: "MTK", subject: "Matematika", teacher: "Drs. Hendra, M.Pd", room: "Ruang 101", status: "Aktif", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: 2, class: "VII IPA 1", day: "Senin", time: "08:30-10:00", period: "Jam ke-3-4", code: "IND", subject: "Bahasa Indonesia", teacher: "Ibu Rani Kusuma, S.Pd", room: "Ruang 101", status: "Aktif", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { id: 3, class: "VII IPA 1", day: "Selasa", time: "07:00-08:30", period: "Jam ke-1-2", code: "FIS", subject: "Fisika", teacher: "Ibu Sari Dewi, S.Pd", room: "Lab Fisika", status: "Aktif", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { id: 4, class: "VII IPA 1", day: "Selasa", time: "08:30-10:00", period: "Jam ke-3-4", code: "KIM", subject: "Kimia", teacher: "Bpk. Ahmad Fauzi, M.Pd", room: "Lab Kimia", status: "Aktif", color: "bg-teal-50 border-teal-200 text-teal-700" },
  { id: 5, class: "VII IPA 1", day: "Rabu", time: "07:00-08:30", period: "Jam ke-1-2", code: "BIO", subject: "Biologi", teacher: "Ibu Dewi Anggraini, S.Pd", room: "Lab Biologi", status: "Aktif", color: "bg-green-50 border-green-200 text-green-700" },
  { id: 6, class: "VII IPA 1", day: "Rabu", time: "08:30-10:00", period: "Jam ke-3-4", code: "ENG", subject: "Bahasa Inggris", teacher: "Bpk. James Hutapea, S.Pd", room: "Ruang 101", status: "Aktif", color: "bg-sky-50 border-sky-200 text-sky-700" },
  { id: 7, class: "VII IPA 1", day: "Kamis", time: "07:00-08:30", period: "Jam ke-1-2", code: "MTK", subject: "Matematika", teacher: "Drs. Hendra, M.Pd", room: "Ruang 101", status: "Aktif", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: 8, class: "VII IPA 1", day: "Kamis", time: "08:30-10:00", period: "Jam ke-3-4", code: "PKN", subject: "PKn", teacher: "Ibu Nurdiana, S.Pd", room: "Ruang 101", status: "Aktif", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { id: 9, class: "VII IPA 1", day: "Jumat", time: "07:00-08:30", period: "Jam ke-1-2", code: "SBD", subject: "Seni Budaya", teacher: "Ibu Ani Sulistyo, S.Sn", room: "Ruang Seni", status: "Aktif", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: 10, class: "VII IPA 1", day: "Jumat", time: "08:30-10:00", period: "Jam ke-3-4", code: "PJK", subject: "PJOK", teacher: "Bpk. Rizal Maulana, S.Pd", room: "Lapangan", status: "Aktif", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  
  // Extra data for other classes to make list full
  { id: 11, class: "VII IPA 2", day: "Senin", time: "07:00-08:30", period: "Jam ke-1-2", code: "IND", subject: "Bahasa Indonesia", teacher: "Ibu Rani Kusuma, S.Pd", room: "Ruang 102", status: "Aktif", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { id: 12, class: "VII IPA 2", day: "Senin", time: "08:30-10:00", period: "Jam ke-3-4", code: "MTK", subject: "Matematika", teacher: "Drs. Hendra, M.Pd", room: "Ruang 102", status: "Aktif", color: "bg-blue-50 border-blue-200 text-blue-700" }
];

const Schedules = () => {
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem("schedules");
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOldData = parsed.some(s => {
        if (!s.class) return false;
        const cls = s.class.toUpperCase();
        return cls.startsWith("X ") || cls.startsWith("XI ") || cls.startsWith("XII ");
      });
      if (!hasOldData) return parsed;
    }
    return MOCK_SCHEDULES;
  });

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  const [view, setView] = useState("list"); // list, add, edit
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [activeTingkat, setActiveTingkat] = useState("Semua Tingkat");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState("Semua Kelas");

  const handleAdd = (newSchedule) => {
    const newId = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
    setSchedules([...schedules, { id: newId, ...newSchedule }]);
    setView("list");
  };

  const handleEdit = (updatedSchedule) => {
    setSchedules(schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
    setView("list");
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus jadwal ini?")) {
      setSchedules(schedules.filter(s => s.id !== id));
      setView("list");
    }
  };

  if (view === "add") {
    return <ScheduleAdd setView={setView} handleAdd={handleAdd} />;
  }

  if (view === "edit") {
    return <ScheduleEdit setView={setView} handleEdit={handleEdit} handleDelete={handleDelete} currentSchedule={currentEditItem} />;
  }

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full font-sans">
      {/* Breadcrumb */}
      <div className="text-[13px] font-medium text-gray-500 mb-1">
        Dashboard <span className="mx-2">&rsaquo;</span> Kelola Akademik <span className="mx-2">&rsaquo;</span> <span className="text-[#1e293b] font-bold">Jadwal Pelajaran</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Jadwal Pelajaran</h1>
          <p className="text-[14px] text-gray-500 mt-1">Kelola jadwal belajar setiap kelas, guru pengampu, dan ruangan yang digunakan.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Ekspor Jadwal
          </button>
          <button 
            onClick={() => setView("add")}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Jadwal</div>
            <div className="text-3xl font-black text-white">42</div>
            <div className="text-xs font-medium text-blue-300 mt-2">Semua kelas & hari</div>
          </div>
        </div>

        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Mata Pelajaran</div>
            <div className="text-3xl font-black text-white">14</div>
            <div className="text-xs font-medium text-blue-300 mt-2">Mapel terjadwal</div>
          </div>
        </div>

        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Guru Mengajar</div>
            <div className="text-3xl font-black text-white">14</div>
            <div className="text-xs font-medium text-blue-300 mt-2">Guru aktif terjadwal</div>
          </div>
        </div>

        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Jam/Minggu</div>
            <div className="text-3xl font-black text-white">63</div>
            <div className="text-xs font-medium text-blue-300 mt-2">Jam pelajaran</div>
          </div>
        </div>
      </div>

      {/* Filter and Content Card */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
        
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
          {/* Level Filter */}
          <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl w-fit">
            {["Semua Tingkat", "Kelas VII", "Kelas VIII", "Kelas IX"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTingkat(tab)}
                className={`px-4 py-2 text-[12px] font-bold rounded-lg transition-all ${activeTingkat === tab ? "bg-[#3B82F6] text-white" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Controls: Dropdown/Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select 
                value={selectedClassFilter} 
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 focus:outline-none focus:border-[#2563EB]"
              >
                <option>Semua Kelas</option>
                <option>VII IPA 1</option>
                <option>VII IPA 2</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-3.5 text-gray-400"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Cari mapel atau guru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#2563EB] w-[220px] font-medium"
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-3 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>

        {/* TABLE LIST VIEW ONLY */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">NO</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">KELAS</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">HARI</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">JAM</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">MATA PELAJARAN</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">GURU PENGAMPU</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">RUANGAN</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">STATUS</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {schedules.filter((item) => {
                  // Filter berdasarkan Tingkat
                  if (activeTingkat !== "Semua Tingkat") {
                    const gradeMatch = item.class.match(/^(VII|VIII|IX)\b/);
                    const grade = gradeMatch ? "Kelas " + gradeMatch[1] : "";
                    if (grade !== activeTingkat) return false;
                  }
                  // Filter berdasarkan Kelas dropdown
                  if (selectedClassFilter !== "Semua Kelas" && item.class !== selectedClassFilter) return false;
                  // Filter berdasarkan Pencarian
                  if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    return item.subject.toLowerCase().includes(q) || item.teacher.toLowerCase().includes(q);
                  }
                  return true;
                }).map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-[13px] text-gray-500 font-medium">{idx + 1}</td>
                    <td className="px-5 py-4">
                      <div>
                        <div className="text-[13px] font-bold text-[#1e293b]">{item.class}</div>
                        <div className="text-[10px] text-gray-400">IPA</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[#1A3D63] text-[13px] font-bold">{item.day}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <div className="text-[13px] font-bold text-[#1e293b]">{item.time}</div>
                        <div className="text-[10px] text-gray-400">{item.period}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          ["MTK", "FIS", "KIM", "BIO", "ENG"].includes(item.code)
                            ? 'bg-[#1A3D63]/10 text-[#1A3D63]'
                            : 'bg-slate-100 text-slate-700'
                        }`}>{item.code}</span>
                        <span className="text-[13px] font-bold text-[#1e293b]">{item.subject}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 font-medium">{item.teacher}</td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 font-medium flex items-center gap-1.5 mt-2.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {item.room}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setCurrentEditItem(item); setView("edit"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-2 py-4 flex items-center justify-between border-t border-gray-50">
            <div className="text-[13px] text-gray-500">
              Menampilkan 1-12 dari 42 jadwal
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3B82F6] text-white text-[13px] font-bold shadow-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-[13px] font-bold shadow-sm">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-[13px] font-bold shadow-sm">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-[13px] font-bold shadow-sm">
                4
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;


