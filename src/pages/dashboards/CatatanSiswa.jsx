import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

const CatatanSiswa = ({ user }) => {
  const [selectedClass, setSelectedClass] = useState("X IPA 1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("2023001");
  const [notification, setNotification] = useState(null);

  // Mock student records
  const [studentsData, setStudentsData] = useState({
    "X IPA 1": [
      { id: "2023001", name: "Andi Pratama", gender: "Laki-laki", note: "Aktif dan rajin. Kemampuan aljabar meningkat pesat.", lastUpdated: "15 Nov 2023", avatarBg: "bg-blue-500" },
      { id: "2023002", name: "Dewi Sartika", gender: "Perempuan", note: "Nilai tertinggi di kelas. Sangat direkomendasikan mengikuti olimpiade.", lastUpdated: "12 Nov 2023", avatarBg: "bg-slate-700" },
      { id: "2023003", name: "Ricky Firmansyah", gender: "Laki-laki", note: "Perlu bimbingan tambahan. Kesulitan pada materi limit.", lastUpdated: "10 Nov 2023", avatarBg: "bg-amber-600" },
      { id: "2023004", name: "Nurul Hidayah", gender: "Perempuan", note: "", lastUpdated: null, avatarBg: "bg-red-500" },
      { id: "2023005", name: "Fajar Setiawan", gender: "Laki-laki", note: "Konsisten mengerjakan tugas.", lastUpdated: "08 Nov 2023", avatarBg: "bg-purple-600" },
      { id: "2023006", name: "Ayu Lestari", gender: "Perempuan", note: "Juara 2 olimpiade kota. Sangat berbakat.", lastUpdated: "05 Nov 2023", avatarBg: "bg-pink-500" },
    ],
    "X IPA 2": [
      { id: "2023007", name: "Bagus Cahyo", gender: "Laki-laki", note: "Paham materi matriks dengan baik.", lastUpdated: "18 Nov 2023", avatarBg: "bg-blue-500" },
      { id: "2023008", name: "Citra Lestari", gender: "Perempuan", note: "", lastUpdated: null, avatarBg: "bg-pink-500" },
      { id: "2023009", name: "Dimas Anggara", gender: "Laki-laki", note: "Perlu remedial materi trigonometri.", lastUpdated: "14 Nov 2023", avatarBg: "bg-amber-600" },
    ]
  });

  const classes = Object.keys(studentsData);
  const currentClassStudents = studentsData[selectedClass] || [];

  // Filter students in list
  const filteredStudents = useMemo(() => {
    let list = currentClassStudents;
    if (searchQuery.trim()) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.includes(searchQuery)
      );
    }
    return list;
  }, [currentClassStudents, searchQuery]);

  // Selected student object
  const selectedStudent = useMemo(() => {
    // Search first in current class
    let found = currentClassStudents.find((s) => s.id === selectedStudentId);
    if (!found) {
      // Fallback search in all classes
      for (const cls of classes) {
        found = studentsData[cls].find((s) => s.id === selectedStudentId);
        if (found) break;
      }
    }
    return found || currentClassStudents[0];
  }, [studentsData, selectedClass, selectedStudentId, currentClassStudents]);

  // Total students with notes
  const totalWithNotes = useMemo(() => {
    let count = 0;
    Object.values(studentsData).forEach((list) => {
      list.forEach((s) => {
        if (s.note && s.note.trim() !== "") count++;
      });
    });
    return count;
  }, [studentsData]);

  // Handle textarea change
  const handleNoteChange = (e) => {
    const newVal = e.target.value;
    setStudentsData((prev) => {
      // Find class of selected student
      let foundClass = selectedClass;
      for (const cls of classes) {
        if (prev[cls].some((s) => s.id === selectedStudent.id)) {
          foundClass = cls;
          break;
        }
      }

      const updatedList = prev[foundClass].map((s) => {
        if (s.id === selectedStudent.id) {
          return { ...s, note: newVal };
        }
        return s;
      });

      return { ...prev, [foundClass]: updatedList };
    });
  };

  // Handle Save
  const handleSave = () => {
    // Update lastUpdated date to today
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    setStudentsData((prev) => {
      let foundClass = selectedClass;
      for (const cls of classes) {
        if (prev[cls].some((s) => s.id === selectedStudent.id)) {
          foundClass = cls;
          break;
        }
      }

      const updatedList = prev[foundClass].map((s) => {
        if (s.id === selectedStudent.id) {
          return { ...s, lastUpdated: todayStr };
        }
        return s;
      });

      return { ...prev, [foundClass]: updatedList };
    });

    setNotification(`Catatan untuk ${selectedStudent.name} berhasil disimpan!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F8FAFC] min-h-screen relative">
      {/* Toast Notification — portal */}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs font-semibold text-gray-400 gap-1.5">
            <span>Catatan Siswa</span>
            <span>•</span>
            <span>Semester Ganjil 2023/2024 • SMAN 1 Contoh</span>
          </div>
          <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Catatan Siswa</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            Berikan catatan perkembangan akademik dan perilaku siswa.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-500 shadow-sm">
          <span>{totalWithNotes} siswa sudah memiliki catatan</span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Students List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4 flex flex-col h-[650px]">
          {/* Filters */}
          <div className="space-y-3 flex-shrink-0">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            {/* Dropdown Select Class */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSearchQuery("");
                  // Select first student of the new class
                  const firstS = studentsData[e.target.value]?.[0];
                  if (firstS) setSelectedStudentId(firstS.id);
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

          {/* Student items list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isSelected = student.id === selectedStudent?.id;
                const hasNote = student.note && student.note.trim() !== "";

                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3.5 border ${
                      isSelected
                        ? "bg-[#1A3D63] text-white border-transparent shadow-lg shadow-[#1A3D63]/10"
                        : "bg-white hover:bg-slate-50 border-gray-100 text-gray-800"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shadow-sm flex-shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : `${student.avatarBg} text-white`
                      }`}
                    >
                      {student.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black truncate">{student.name}</div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                          isSelected ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {selectedClass}
                      </div>
                    </div>
                    {hasNote && (
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-white/10 text-white border border-white/20"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        Ada catatan
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 text-sm font-bold text-gray-400">
                Tidak ada siswa ditemukan
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex-shrink-0 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {filteredStudents.length} siswa ditampilkan
            </span>
          </div>
        </div>

        {/* Right Side: Detail Panel / Textarea form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {selectedStudent ? (
            <>
              {/* Header Panel */}
              <div className="bg-[#1A3D63] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-lg border border-white/10">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight leading-tight">{selectedStudent.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-blue-200 font-bold">
                      <span>{selectedStudent.id}</span>
                      <span>•</span>
                      <span>{selectedClass}</span>
                      <span>•</span>
                      <span>{selectedStudent.gender}</span>
                    </div>
                  </div>
                </div>

                {selectedStudent.lastUpdated && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    Catatan terakhir {selectedStudent.lastUpdated}
                  </span>
                )}
              </div>

              {/* Body Panel */}
              <div className="p-6 flex-1 flex flex-col space-y-4 min-h-0">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex-shrink-0">
                  Catatan untuk {selectedStudent.name}
                </label>

                {/* Textarea container */}
                <div className="relative flex-1 flex flex-col border border-gray-200 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all bg-slate-50/10">
                  <textarea
                    value={selectedStudent.note}
                    onChange={handleNoteChange}
                    placeholder={`Tuliskan catatan perkembangan akademik dan perilaku ${selectedStudent.name}...`}
                    className="w-full flex-1 p-6 text-sm font-semibold text-gray-700 bg-transparent focus:outline-none resize-none"
                  />

                  {/* Placeholder list helper when empty */}
                  {!selectedStudent.note && (
                    <div className="absolute inset-0 p-6 pointer-events-none text-xs text-gray-400 font-semibold mt-10">
                      <p className="font-bold text-gray-500 mb-2">Contoh:</p>
                      <ul className="list-disc list-inside space-y-1.5">
                        <li>Kemampuan memahami materi meningkat</li>
                        <li>Perlu bimbingan pada topik tertentu</li>
                        <li>Aktif dalam diskusi kelas</li>
                        <li>Rekomendasi tindak lanjut</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Panel */}
              <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0 bg-slate-50/35">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Siap disimpan</span>
                </div>

                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 bg-[#1A3D63] hover:bg-[#122A44] text-white px-7 py-3.5 rounded-2xl text-xs font-black transition-all shadow-lg shadow-[#1A3D63]/15 active:scale-95 w-full sm:w-auto"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Simpan Catatan
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-sm font-bold text-gray-400">
              Pilih siswa terlebih dahulu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatatanSiswa;
