import React, { useState, useMemo } from "react";

const InputNilai = ({ user }) => {
  const [selectedClass, setSelectedClass] = useState("X IPA 1");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  // Mock student data grouped by class
  const [studentsData, setStudentsData] = useState({
    "X IPA 1": [
      { id: "2023001", name: "Andi Pratama", gender: "L", grade: "87", note: "Aktif dan rajin. Kemampuan aljabar meningkat pesat.", avatarBg: "bg-blue-500" },
      { id: "2023002", name: "Dewi Sartika", gender: "P", grade: "94", note: "Nilai tertinggi di kelas. Sangat direkomendasikan mengikuti olimpiade.", avatarBg: "bg-slate-700" },
      { id: "2023003", name: "Ricky Firmansyah", gender: "L", grade: "72", note: "Perlu bimbingan tambahan. Kesulitan pada materi limit.", avatarBg: "bg-amber-600" },
      { id: "2023004", name: "Nurul Hidayah", gender: "P", grade: "85", note: "", avatarBg: "bg-red-500" },
      { id: "2023005", name: "Fajar Setiawan", gender: "L", grade: "79", note: "Konsisten mengerjakan tugas.", avatarBg: "bg-purple-600" },
      { id: "2023006", name: "Ayu Lestari", gender: "P", grade: "91", note: "Juara 2 olimpiade kota. Sangat berbakat.", avatarBg: "bg-pink-500" },
    ],
    "X IPA 2": [
      { id: "2023007", name: "Bagus Cahyo", gender: "L", grade: "82", note: "Paham materi matriks dengan baik.", avatarBg: "bg-blue-500" },
      { id: "2023008", name: "Citra Lestari", gender: "P", grade: "", note: "", avatarBg: "bg-pink-500" },
      { id: "2023009", name: "Dimas Anggara", gender: "L", grade: "65", note: "Perlu remedial materi trigonometri.", avatarBg: "bg-amber-600" },
    ],
    "XI IPA 1": [
      { id: "2023010", name: "Eka Saputra", gender: "L", grade: "90", note: "Sangat antusias belajar.", avatarBg: "bg-purple-600" },
      { id: "2023011", name: "Fitri Handayani", gender: "P", grade: "88", note: "Aktif bertanya saat kelas.", avatarBg: "bg-pink-500" },
    ]
  });

  const classes = Object.keys(studentsData);

  // Handle grade change
  const handleGradeChange = (studentId, value) => {
    // Limit to digits and max 100
    const sanitizedVal = value.replace(/[^0-9]/g, "");
    if (sanitizedVal !== "" && parseInt(sanitizedVal) > 100) return;

    setStudentsData((prev) => {
      const updatedList = prev[selectedClass].map((student) => {
        if (student.id === studentId) {
          return { ...student, grade: sanitizedVal };
        }
        return student;
      });
      return { ...prev, [selectedClass]: updatedList };
    });
  };

  // Handle note change
  const handleNoteChange = (studentId, value) => {
    setStudentsData((prev) => {
      const updatedList = prev[selectedClass].map((student) => {
        if (student.id === studentId) {
          return { ...student, note: value };
        }
        return student;
      });
      return { ...prev, [selectedClass]: updatedList };
    });
  };

  // Current list of students
  const currentStudents = studentsData[selectedClass] || [];

  // Statistics calculation
  const totalStudents = currentStudents.length;
  const filledStudentsCount = useMemo(() => {
    return currentStudents.filter((s) => s.grade !== "").length;
  }, [currentStudents]);

  const filledPercentage = totalStudents > 0 ? Math.round((filledStudentsCount / totalStudents) * 100) : 0;

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return currentStudents;
    return currentStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery)
    );
  }, [currentStudents, searchQuery]);

  // Handle Save
  const handleSave = () => {
    setNotification(`Berhasil menyimpan nilai untuk kelas ${selectedClass}!`);
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
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Input Nilai</h1>
        <p className="text-sm text-gray-400 font-semibold">
          Semester Ganjil 2023/2024 • SMAN 1 Contoh
        </p>
      </div>

      {/* Section 1: Pilih Kelas */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-sm font-black text-[#1e293b]">Pilih Kelas</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
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

          <div className="flex items-center gap-3 flex-1 w-full">
            <div className="flex-1 max-w-[200px] h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A3D63] transition-all duration-500 rounded-full"
                style={{ width: `${filledPercentage}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#1A3D63] uppercase tracking-wider whitespace-nowrap">
              {filledPercentage}% terisi
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Daftar Siswa */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-black text-[#1e293b]">
              Daftar Siswa — {selectedClass}
            </h3>
          </div>

          {/* Search bar */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
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
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[180px]">
                  Nilai Rata-rata (0-100)
                </th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[380px]">
                  Catatan Guru (Opsional)
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
                          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100 rounded">
                            {student.gender}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* NILAI */}
                    <td className="py-5 px-4 text-center">
                      <div className="inline-block">
                        <input
                          type="text"
                          value={student.grade}
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          placeholder="—"
                          className="w-[85px] bg-[#1A3D63] text-white text-center font-extrabold text-sm rounded-full py-2.5 border-0 focus:outline-none focus:ring-4 focus:ring-[#1A3D63]/30 transition-all shadow-md"
                        />
                      </div>
                    </td>

                    {/* CATATAN */}
                    <td className="py-5 px-4">
                      <input
                        type="text"
                        value={student.note}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        placeholder="Tambahkan catatan tentang siswa ini..."
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm font-bold text-gray-400">
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
              Simpan nilai kelas {selectedClass}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              {filledStudentsCount} dari {totalStudents} siswa telah diisi
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={totalStudents === 0}
          className="flex items-center justify-center gap-2.5 bg-[#1A3D63] hover:bg-[#122A44] disabled:opacity-50 disabled:pointer-events-none text-white px-7 py-3.5 rounded-2xl text-xs font-black transition-all shadow-lg shadow-[#1A3D63]/15 active:scale-95 w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Simpan Nilai
        </button>
      </div>
    </div>
  );
};

export default InputNilai;
