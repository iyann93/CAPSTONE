import React, { useState, useEffect } from "react";
import ScheduleAdd from "./ScheduleAdd";
import ScheduleEdit from "./ScheduleEdit";

// Mock Schedule Data
const MOCK_SCHEDULES = [
  { id: 1, class: "X IPA 1", day: "Senin", time: "07:00-08:30", period: "Jam ke-1-2", code: "MTK", subject: "Matematika", teacher: "Drs. Hendra, M.Pd", room: "Ruang 101", status: "Aktif", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: 2, class: "X IPA 1", day: "Senin", time: "08:30-10:00", period: "Jam ke-3-4", code: "IND", subject: "Bahasa Indonesia", teacher: "Ibu Rani Kusuma, S.Pd", room: "Ruang 101", status: "Aktif", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { id: 3, class: "X IPA 1", day: "Selasa", time: "07:00-08:30", period: "Jam ke-1-2", code: "FIS", subject: "Fisika", teacher: "Ibu Sari Dewi, S.Pd", room: "Lab Fisika", status: "Aktif", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { id: 4, class: "X IPA 1", day: "Selasa", time: "08:30-10:00", period: "Jam ke-3-4", code: "KIM", subject: "Kimia", teacher: "Bpk. Ahmad Fauzi, M.Pd", room: "Lab Kimia", status: "Aktif", color: "bg-teal-50 border-teal-200 text-teal-700" },
  { id: 5, class: "X IPA 1", day: "Rabu", time: "07:00-08:30", period: "Jam ke-1-2", code: "BIO", subject: "Biologi", teacher: "Ibu Dewi Anggraini, S.Pd", room: "Lab Biologi", status: "Aktif", color: "bg-green-50 border-green-200 text-green-700" },
  { id: 6, class: "X IPA 1", day: "Rabu", time: "08:30-10:00", period: "Jam ke-3-4", code: "ENG", subject: "Bahasa Inggris", teacher: "Bpk. James Hutapea, S.Pd", room: "Ruang 101", status: "Aktif", color: "bg-sky-50 border-sky-200 text-sky-700" },
  { id: 7, class: "X IPA 1", day: "Kamis", time: "07:00-08:30", period: "Jam ke-1-2", code: "MTK", subject: "Matematika", teacher: "Drs. Hendra, M.Pd", room: "Ruang 101", status: "Aktif", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: 8, class: "X IPA 1", day: "Kamis", time: "08:30-10:00", period: "Jam ke-3-4", code: "PKN", subject: "PKn", teacher: "Ibu Nurdiana, S.Pd", room: "Ruang 101", status: "Aktif", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { id: 9, class: "X IPA 1", day: "Jumat", time: "07:00-08:30", period: "Jam ke-1-2", code: "SBD", subject: "Seni Budaya", teacher: "Ibu Ani Sulistyo, S.Sn", room: "Ruang Seni", status: "Aktif", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: 10, class: "X IPA 1", day: "Jumat", time: "08:30-10:00", period: "Jam ke-3-4", code: "PJK", subject: "PJOK", teacher: "Bpk. Rizal Maulana, S.Pd", room: "Lapangan", status: "Aktif", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  
  // Extra data for other classes to make list full
  { id: 11, class: "X IPA 2", day: "Senin", time: "07:00-08:30", period: "Jam ke-1-2", code: "IND", subject: "Bahasa Indonesia", teacher: "Ibu Rani Kusuma, S.Pd", room: "Ruang 102", status: "Aktif", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { id: 12, class: "X IPA 2", day: "Senin", time: "08:30-10:00", period: "Jam ke-3-4", code: "MTK", subject: "Matematika", teacher: "Drs. Hendra, M.Pd", room: "Ruang 102", status: "Aktif", color: "bg-blue-50 border-blue-200 text-blue-700" }
];

const Schedules = () => {
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem("schedules");
    if (saved) {
      return JSON.parse(saved);
    }
    return MOCK_SCHEDULES;
  });

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  const [view, setView] = useState("list"); // list, add, edit
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [viewMode, setViewMode] = useState("tabel"); // tabel, mingguan
  const [activeTingkat, setActiveTingkat] = useState("Semua Tingkat");
  const [activeClassTab, setActiveClassTab] = useState("X IPA 1");
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

  const classesTabs = ["X IPA 1", "X IPA 2", "X IPS 1", "XI IPA 1", "XI IPS 1", "XII IPA 1", "XII IPS 1"];

  const timeSlots = [
    { period: "Jam 1-2", time: "07:00-08:30", key: "07:00-08:30" },
    { period: "Jam 3-4", time: "08:30-10:00", key: "08:30-10:00" },
    { type: "break", name: "ISTIRAHAT", time: "10:00-10:15" },
    { period: "Jam 5-6", time: "10:15-11:45", key: "10:15-11:45" },
    { period: "Jam 7-8", time: "11:45-13:05", key: "11:45-13:05" },
    { type: "break", name: "ISHOMA", time: "13:00-13:05" },
    { period: "Jam 9-10", time: "13:05-14:35", key: "13:05-14:35" }
  ];

  const days = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];

  const getWeeklyCard = (day, timeSlot) => {
    // Find matching schedule for the active class, selected day and time slot
    return schedules.find(
      (s) => s.class === activeClassTab && s.day.toLowerCase() === day.toLowerCase() && s.time === timeSlot
    );
  };

  const getCohesiveColor = (code) => {
    const primaryCodes = ["MTK", "FIS", "KIM", "BIO", "ENG"];
    if (primaryCodes.includes(code)) {
      return "bg-[#1A3D63]/5 border-[#1A3D63]/20 text-[#1A3D63]";
    }
    return "bg-slate-50 border-slate-200 text-slate-700";
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full font-sans">
      {/* Breadcrumb */}
      <div className="text-[13px] font-medium text-gray-500 mb-1">
        Dashboard <span className="mx-2">›</span> Kelola Akademik <span className="mx-2">›</span> <span className="text-[#1e293b] font-bold">Jadwal Pelajaran</span>
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
            {["Semua Tingkat", "Kelas X", "Kelas XI", "Kelas XII"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTingkat(tab)}
                className={`px-4 py-2 text-[12px] font-bold rounded-lg transition-all ${activeTingkat === tab ? "bg-[#3B82F6] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Controls: Table/Calendar Toggle + Dropdown/Search */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-xl p-0.5 bg-white">
              <button
                onClick={() => setViewMode("tabel")}
                className={`flex items-center gap-2 px-4 py-2 text-[12px] font-bold rounded-lg transition-all ${viewMode === "tabel" ? "bg-[#3B82F6] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                Tabel
              </button>
              <button
                onClick={() => setViewMode("mingguan")}
                className={`flex items-center gap-2 px-4 py-2 text-[12px] font-bold rounded-lg transition-all ${viewMode === "mingguan" ? "bg-[#3B82F6] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
                Jadwal Mingguan
              </button>
            </div>

            {/* Dropdown Filters */}
            {viewMode === "mingguan" ? (
              <div className="relative">
                <select 
                  value={activeClassTab}
                  onChange={(e) => setActiveClassTab(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:outline-none focus:border-[#2563EB]"
                >
                  {classesTabs.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            ) : (
              <>
                <div className="relative">
                  <select 
                    value={selectedClassFilter} 
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option>Semua Kelas</option>
                    <option>X IPA 1</option>
                    <option>X IPA 2</option>
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
              </>
            )}
          </div>
        </div>

        {/* Content depending on view mode */}
        {viewMode === "mingguan" ? (
          /* WEEKLY CALENDAR VIEW */
          <div className="space-y-4">
            {/* Class Tabs row & Semester Year */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
              <div className="flex flex-wrap gap-1.5">
                {classesTabs.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveClassTab(c)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${activeClassTab === c ? "bg-[#3B82F6] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <span className="text-[12px] font-bold text-gray-400 flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Ganjil 2023/2024
              </span>
            </div>

            {/* Weekly Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px] border border-gray-100 rounded-2xl overflow-hidden">
                {/* Grid Header */}
                <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-100 py-3 text-center text-[11px] font-bold text-gray-400 tracking-wider">
                  <div className="text-left pl-4">WAKTU</div>
                  <div>SENIN</div>
                  <div>SELASA</div>
                  <div>RABU</div>
                  <div>KAMIS</div>
                  <div>JUMAT</div>
                </div>

                {/* Grid Rows */}
                <div className="divide-y divide-gray-100">
                  {timeSlots.map((slot, index) => {
                    if (slot.type === "break") {
                      return (
                        <div key={index} className="grid grid-cols-6 bg-[#FEFCE8]/40 py-2.5 text-center">
                          <div className="text-left pl-4 text-[11px] font-bold text-gray-400">{slot.time}</div>
                          <div className="col-span-5 text-center text-[11px] font-black tracking-widest text-[#A16207]">
                            {slot.name}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={index} className="grid grid-cols-6 items-stretch min-h-[90px]">
                        {/* Time Column */}
                        <div className="p-3 flex flex-col justify-center border-r border-gray-50 bg-gray-50/30">
                          <div className="text-[11px] font-bold text-gray-700">{slot.period}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{slot.time}</div>
                        </div>

                        {/* Days Columns */}
                        {days.map((day) => {
                          const schedule = getWeeklyCard(day, slot.time);
                          return (
                            <div key={day} className="p-2 border-r border-gray-50 flex items-center justify-center">
                              {schedule ? (
                                <div className={`w-full p-2.5 rounded-xl border text-left ${getCohesiveColor(schedule.code)} shadow-sm transition-transform hover:scale-[1.02]`}>
                                  <div className="text-[12px] font-black leading-tight">{schedule.subject}</div>
                                  <div className="text-[10px] opacity-75 mt-1 font-medium">{schedule.teacher}</div>
                                  <div className="text-[10px] opacity-60 mt-0.5 flex items-center gap-1 font-bold">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    {schedule.room}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[11px] text-gray-300 font-medium">
                                  Kosong
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Keterangan / Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-400 pt-2 border-t border-gray-50">
              <span>Keterangan Kelompok:</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1A3D63]"></span> Eksakta & Bahasa Asing</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Umum & Humaniora</span>
            </div>
          </div>
        ) : (
          /* TABLE LIST VIEW */
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
                    // Search & Class filter logic
                    if (selectedClassFilter !== "Semua Kelas" && item.class !== selectedClassFilter) return false;
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
        )}

      </div>
    </div>
  );
};

export default Schedules;
