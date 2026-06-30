import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

const AbsensiSiswa = ({ user, onSaveAttendance }) => {
  const [selectedClass, setSelectedClass] = useState("X IPA 1");
  const [selectedDate, setSelectedDate] = useState("2026-06-30");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  // Mock student data grouped by class
  const [studentsData, setStudentsData] = useState({
    "X IPA 1": [
      { id: "2023001", name: "Andi Pratama", gender: "Laki-laki", status: "Hadir", avatarBg: "bg-blue-500" },
      { id: "2023002", name: "Dewi Sartika", gender: "Perempuan", status: "Hadir", avatarBg: "bg-slate-700" },
      { id: "2023003", name: "Ricky Firmansyah", gender: "Laki-laki", status: "Sakit", avatarBg: "bg-amber-600" },
      { id: "2023004", name: "Nurul Hidayah", gender: "Perempuan", status: "Hadir", avatarBg: "bg-red-500" },
      { id: "2023005", name: "Fajar Setiawan", gender: "Laki-laki", status: "Izin", avatarBg: "bg-purple-600" },
      { id: "2023006", name: "Ayu Lestari", gender: "Perempuan", status: "Hadir", avatarBg: "bg-pink-500" },
    ],
    "X IPA 2": [
      { id: "2023007", name: "Bagus Cahyo", gender: "Laki-laki", status: "Hadir", avatarBg: "bg-blue-500" },
      { id: "2023008", name: "Citra Lestari", gender: "Perempuan", status: "Izin", avatarBg: "bg-pink-500" },
      { id: "2023009", name: "Dimas Anggara", gender: "Laki-laki", status: "Sakit", avatarBg: "bg-amber-600" },
    ]
  });

  const classes = Object.keys(studentsData);
  const currentStudents = studentsData[selectedClass] || [];

  // Handle single student attendance change
  const handleStatusChange = (studentId, newStatus) => {
    setStudentsData((prev) => {
      const updated = prev[selectedClass].map((s) => {
        if (s.id === studentId) return { ...s, status: newStatus };
        return s;
      });
      return { ...prev, [selectedClass]: updated };
    });
  };

  // Bulk mark all
  const handleMarkAll = (status) => {
    setStudentsData((prev) => {
      const updated = prev[selectedClass].map((s) => ({ ...s, status }));
      return { ...prev, [selectedClass]: updated };
    });
  };

  // Stats calculation
  const counts = useMemo(() => {
    const total = currentStudents.length;
    const hadir = currentStudents.filter((s) => s.status === "Hadir").length;
    const izin = currentStudents.filter((s) => s.status === "Izin").length;
    const sakit = currentStudents.filter((s) => s.status === "Sakit").length;
    const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;
    return { total, hadir, izin, sakit, rate };
  }, [currentStudents]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return currentStudents;
    return currentStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery)
    );
  }, [currentStudents, searchQuery]);

  const handleSave = () => {
    // Push session data up to GuruDashboard shared state
    if (onSaveAttendance) {
      onSaveAttendance({
        attendanceClass: selectedClass,
        date: selectedDate,
        students: currentStudents
      });
    }
    setNotification(`Absensi kelas ${selectedClass} berhasil disimpan!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F8FAFC] min-h-screen relative">
      {/* Toast Notification — rendered via portal so it always shows at top-right of viewport */}
      {notification && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999 }} className="flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-xl animate-slideIn">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-xs font-black tracking-tight">{notification}</span>
        </div>,
        document.body
      )}

      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Absensi Siswa</h1>
        <p className="text-sm text-gray-400 font-semibold">
          Semester Ganjil 2023/2024 • SMAN 1 Contoh
        </p>
      </div>

      {/* Section 1: Pilih Kelas & Tanggal */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-sm font-black text-[#1e293b]">Pilih Kelas & Tanggal</h3>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Class Select */}
          <div className="relative w-full sm:w-[220px]">
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

          {/* Date Picker */}
          <div className="relative w-full sm:w-[200px]">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>

          {/* Summary Badges & Progress Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A3D63] text-white rounded-2xl text-xs font-black shadow-sm">
              Hadir: {counts.hadir}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black shadow-sm">
              Izin: {counts.izin}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A3D63] text-white rounded-2xl text-xs font-black shadow-sm">
              Sakit: {counts.sakit}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-[150px]">
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A3D63] transition-all duration-500 rounded-full"
                style={{ width: `${counts.rate}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#1A3D63] uppercase tracking-wider whitespace-nowrap">
              {counts.rate}%
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Daftar Siswa */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-gray-800">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-black text-[#1e293b]">
                Daftar Siswa — {selectedClass}
              </h3>
            </div>

            {/* Bulk actions */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tandai semua:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleMarkAll("Hadir")}
                  className="px-3.5 py-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-xl text-[11px] font-black transition-all shadow-sm"
                >
                  Hadir
                </button>
                <button
                  onClick={() => handleMarkAll("Izin")}
                  className="px-3.5 py-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-xl text-[11px] font-black transition-all shadow-sm"
                >
                  Izin
                </button>
                <button
                  onClick={() => handleMarkAll("Sakit")}
                  className="px-3.5 py-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-xl text-[11px] font-black transition-all shadow-sm"
                >
                  Sakit
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-[280px]">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[60px]">
                  No
                </th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[120px]">
                  NIS
                </th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Nama Siswa
                </th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[380px]">
                  Status Kehadiran
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* NO */}
                    <td className="py-5 px-4 text-xs font-bold text-gray-400">
                      {idx + 1}
                    </td>

                    {/* NIS */}
                    <td className="py-5 px-4 text-xs font-bold text-gray-500">
                      {student.id}
                    </td>

                    {/* NAMA SISWA */}
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-sm ${student.avatarBg}`}
                        >
                          {student.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-black text-gray-800">{student.name}</div>
                          <span className="inline-block mt-1 text-[10px] text-gray-400 font-semibold">
                            {student.gender}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* STATUS KEHADIRAN */}
                    <td className="py-5 px-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 shadow-inner">
                          {["Hadir", "Izin", "Sakit"].map((status) => {
                            const isSelected = student.status === status;
                            return (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(student.id, status)}
                                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                                  isSelected
                                    ? "bg-[#1A3D63] text-white shadow-md scale-100"
                                    : "text-gray-500 hover:bg-gray-100"
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>

                        {/* Warnings if absent */}
                        {student.status !== "Hadir" && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
                            <span className="text-[12px]">▲</span>
                            <span>Tidak hadir</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm font-bold text-gray-400">
                    Tidak ada siswa ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Action Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1e293b]">
              Simpan absensi kelas {selectedClass}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              {counts.hadir} Hadir • {counts.izin} Izin • {counts.sakit} Sakit • Total {counts.total} siswa
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={counts.total === 0}
          className="flex items-center justify-center gap-2.5 bg-[#1A3D63] hover:bg-[#122A44] disabled:opacity-50 disabled:pointer-events-none text-white px-7 py-3.5 rounded-2xl text-xs font-black transition-all shadow-lg shadow-[#1A3D63]/15 active:scale-95 w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Simpan Absensi
        </button>
      </div>
    </div>
  );
};

export default AbsensiSiswa;
