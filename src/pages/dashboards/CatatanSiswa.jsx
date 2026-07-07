import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

const CatatanSiswa = ({ user }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [classes, setClasses] = useState([]);
  const [studentsData, setStudentsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Fetch classes and students from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { default: api } = await import('../../api/axios');
        const [kelasRes, siswaRes] = await Promise.all([
          api.get('/kelas'),
          api.get('/siswa')
        ]);
        
        const dbClasses = kelasRes.data?.data || [];
        const dbSiswa = siswaRes.data?.data || [];

        const classNames = dbClasses.map(c => c.nama_kelas);
        setClasses(classNames);
        if (classNames.length > 0) {
          setSelectedClass(classNames[0]);
        }

        const groupedData = {};
        classNames.forEach(cName => {
          groupedData[cName] = [];
        });

        let localSaved = null;
        try {
          const savedStr = localStorage.getItem("wali_kelas_students");
          if (savedStr) localSaved = JSON.parse(savedStr);
        } catch(e) {}

        dbSiswa.forEach(siswa => {
          const cls = dbClasses.find(c => c.id === siswa.kelas_id);
          const className = cls ? cls.nama_kelas : "Tanpa Kelas";
          
          if (!groupedData[className]) {
            groupedData[className] = [];
          }

          let existingNote = "";
          let existingDate = null;
          if (localSaved && localSaved[className]) {
            const foundLocal = localSaved[className].find(s => s.id === siswa.id || s.nis === siswa.nis);
            if (foundLocal) {
              existingNote = foundLocal.note || "";
              existingDate = foundLocal.lastUpdated || null;
            }
          }

          groupedData[className].push({
            id: siswa.id, // UUID
            nis: siswa.nis || "-",
            name: siswa.nama_lengkap,
            gender: siswa.jenis_kelamin === "Laki-laki" ? "Laki-laki" : "Perempuan",
            note: existingNote,
            lastUpdated: existingDate,
            avatarBg: "bg-blue-500",
          });
        });

        setStudentsData(groupedData);
        
        // Select first student of first class
        if (classNames.length > 0 && groupedData[classNames[0]]?.length > 0) {
          setSelectedStudentId(groupedData[classNames[0]][0].id);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentClassStudents = studentsData[selectedClass] || [];

  const filteredStudents = useMemo(() => {
    let list = currentClassStudents;
    if (searchQuery.trim()) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.nis && s.nis.includes(searchQuery))
      );
    }
    return list;
  }, [currentClassStudents, searchQuery]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    let found = currentClassStudents.find((s) => s.id === selectedStudentId);
    if (!found) {
      for (const cls of classes) {
        found = (studentsData[cls] || []).find((s) => s.id === selectedStudentId);
        if (found) break;
      }
    }
    return found || null;
  }, [studentsData, selectedClass, selectedStudentId, currentClassStudents, classes]);

  const totalWithNotes = useMemo(() => {
    let count = 0;
    Object.values(studentsData).forEach((list) => {
      list.forEach((s) => {
        if (s.note && s.note.trim() !== "") count++;
      });
    });
    return count;
  }, [studentsData]);

  const handleNoteChange = (e) => {
    const newVal = e.target.value;
    if (!selectedStudent) return;
    
    setStudentsData((prev) => {
      let foundClass = selectedClass;
      for (const cls of classes) {
        if ((prev[cls] || []).some((s) => s.id === selectedStudent.id)) {
          foundClass = cls;
          break;
        }
      }

      const updatedList = (prev[foundClass] || []).map((s) => {
        if (s.id === selectedStudent.id) {
          return { ...s, note: newVal };
        }
        return s;
      });

      return { ...prev, [foundClass]: updatedList };
    });
  };

  const handleSave = () => {
    if (!selectedStudent) return;
    
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    setStudentsData((prev) => {
      let foundClass = selectedClass;
      for (const cls of classes) {
        if ((prev[cls] || []).some((s) => s.id === selectedStudent.id)) {
          foundClass = cls;
          break;
        }
      }

      const updatedList = (prev[foundClass] || []).map((s) => {
        if (s.id === selectedStudent.id) {
          return { ...s, lastUpdated: todayStr };
        }
        return s;
      });

      const newData = { ...prev, [foundClass]: updatedList };
      
      // Save to localStorage immediately
      localStorage.setItem("wali_kelas_students", JSON.stringify(newData));
      
      return newData;
    });

    setNotification(`Catatan untuk ${selectedStudent.name} berhasil disimpan! (Simulasi)`);
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading) {
    return <div className="p-8 font-bold text-gray-500">Memuat data siswa dari database...</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F8FAFC] min-h-screen relative">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs font-semibold text-gray-400 gap-1.5">
            <span>Catatan Siswa</span>
            <span>•</span>
            <span>Semester Ganjil 2023/2024 • Data bersumber dari Database</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4 flex flex-col h-[650px]">
          <div className="space-y-3 flex-shrink-0">
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

            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSearchQuery("");
                  const firstS = studentsData[e.target.value]?.[0];
                  if (firstS) setSelectedStudentId(firstS.id);
                }}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none shadow-sm transition-all"
              >
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Kelas {cls}
                    </option>
                  ))
                ) : (
                  <option value="">Tidak ada kelas</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

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
                          isSelected && !saveSuccess ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {selectedClass}
                      </div>
                    </div>
                    {hasNote && (
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          isSelected && !saveSuccess
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

        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {selectedStudent ? (
            <>
              <div className="bg-[#1A3D63] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-lg border border-white/10">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight leading-tight">{selectedStudent.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-blue-200 font-bold">
                      <span>{selectedStudent.nis}</span>
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

              <div className="p-6 flex-1 flex flex-col space-y-4 min-h-0">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex-shrink-0">
                  Catatan untuk {selectedStudent.name}
                </label>

                <div className="relative flex-1 flex flex-col border border-gray-200 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all bg-slate-50/10">
                  <textarea
                    value={selectedStudent.note}
                    onChange={handleNoteChange}
                    placeholder={`Tuliskan catatan perkembangan akademik dan perilaku ${selectedStudent.name}...`}
                    className="w-full flex-1 p-6 text-sm font-semibold text-gray-700 bg-transparent focus:outline-none resize-none"
                  />

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
