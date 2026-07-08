import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

const InputNilai = ({ user }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
  
  const [classes, setClasses] = useState([]);
  const [mapels, setMapels] = useState([]);
  const [semesters, setSemesters] = useState([]);
  
  const [dbClasses, setDbClasses] = useState([]);
  const [dbMapels, setDbMapels] = useState([]);
  const [dbSemesters, setDbSemesters] = useState([]);
  
  const [studentsData, setStudentsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch classes, students, mapels, and semesters from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { default: api } = await import('../../api/axios');
        const [kelasRes, siswaRes, mapelRes, semesterRes] = await Promise.all([
          api.get('/kelas').catch(e => ({ data: { data: [] } })),
          api.get('/siswa').catch(e => ({ data: { data: [] } })),
          api.get('/mapel').catch(e => ({ data: { data: [] } })),
          api.get('/semester').catch(e => ({ data: { data: [] } }))
        ]);
        
        const dbClassList = kelasRes.data?.data || [];
        const dbSiswaList = siswaRes.data?.data || [];
        const dbMapelList = mapelRes.data?.data || [];
        const dbSemesterList = semesterRes.data?.data || [];

        setDbClasses(dbClassList);
        setDbMapels(dbMapelList);
        setDbSemesters(dbSemesterList);

        const classNames = dbClassList.map(c => c.nama_kelas);
        setClasses(classNames);
        if (classNames.length > 0) setSelectedClass(classNames[0]);

        const mapelNames = dbMapelList.map(m => m.nama);
        setMapels(mapelNames);
        if (mapelNames.length > 0) setSelectedMapel(mapelNames[0]);

        const semesterNames = dbSemesterList.map(s => s.nama_semester);
        setSemesters(semesterNames);
        const activeSem = dbSemesterList.find(s => s.is_aktif);
        if (activeSem) setSelectedSemester(activeSem.nama_semester);
        else if (semesterNames.length > 0) setSelectedSemester(semesterNames[0]);

        // Group students by class
        const groupedData = {};
        classNames.forEach(cName => {
          groupedData[cName] = [];
        });

        dbSiswaList.forEach(siswa => {
          const cls = dbClassList.find(c => c.id === siswa.kelas_id);
          const className = cls ? cls.nama_kelas : "Tanpa Kelas";
          
          if (!groupedData[className]) {
            groupedData[className] = [];
          }

          groupedData[className].push({
            id: siswa.id, // UUID
            nis: siswa.nis || "-",
            name: siswa.nama_lengkap,
            gender: siswa.jenis_kelamin === "Laki-laki" ? "L" : "P",
            nilai_id: null,
            harian: "",
            uts: "",
            uas: "",
            catatan: "",
            avatarBg: "bg-blue-500",
          });
        });

        setStudentsData(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch existing grades when class changes
  useEffect(() => {
    if (!selectedClass || loading) return;

    const fetchExistingNilai = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const cls = dbClasses.find(c => c.nama_kelas === selectedClass);
        if (!cls) return;

        const semId = dbSemesters.length > 0 ? dbSemesters[0].id : "00000002-0000-0000-0000-000000000001";
        const mapelId = dbMapels.find(m => m.nama === selectedMapel)?.id || dbMapels[0]?.id;
        if (!mapelId) return;

        const res = await api.get(`/nilai/kelas/${cls.id}?semester_id=${semId}&mata_pelajaran_id=${mapelId}`);
        const existingData = res.data?.data || [];
        
        setStudentsData(prev => {
          const updatedList = (prev[selectedClass] || []).map(student => {
            const record = existingData.find(r => r.siswa_id === student.id);
            if (record) {
              return { 
                ...student, 
                nilai_id: record.id,
                harian: record.nilai_harian !== null ? record.nilai_harian.toString() : "",
                uts: record.nilai_uts !== null ? record.nilai_uts.toString() : "",
                uas: record.nilai_uas !== null ? record.nilai_uas.toString() : "",
                catatan: record.catatan || ""
              };
            }
            return { 
              ...student, 
              nilai_id: null,
              harian: "", uts: "", uas: "", catatan: "" 
            };
          });
          return { ...prev, [selectedClass]: updatedList };
        });
      } catch (err) {
        console.error("Error fetching existing nilai:", err);
      }
    };

    fetchExistingNilai();
  }, [selectedClass, selectedMapel, dbClasses, dbMapels, dbSemesters, loading]);

  const handleGradeChange = (studentId, field, value) => {
    const sanitizedVal = value.replace(/[^0-9]/g, "");
    if (sanitizedVal !== "" && parseInt(sanitizedVal) > 100) return;

    setStudentsData((prev) => {
      const updatedList = (prev[selectedClass] || []).map((student) => {
        if (student.id === studentId) {
          return { ...student, [field]: sanitizedVal };
        }
        return student;
      });
      return { ...prev, [selectedClass]: updatedList };
    });
  };

  const handleNoteChange = (studentId, value) => {
    setStudentsData((prev) => {
      const updatedList = (prev[selectedClass] || []).map((student) => {
        if (student.id === studentId) {
          return { ...student, catatan: value };
        }
        return student;
      });
      return { ...prev, [selectedClass]: updatedList };
    });
  };

  const currentStudents = studentsData[selectedClass] || [];
  const totalStudents = currentStudents.length;
  
  const filledStudentsCount = useMemo(() => {
    return currentStudents.filter((s) => s.harian !== "" || s.uts !== "" || s.uas !== "").length;
  }, [currentStudents]);

  const filledPercentage = totalStudents > 0 ? Math.round((filledStudentsCount / totalStudents) * 100) : 0;

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return currentStudents;
    return currentStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery)
    );
  }, [currentStudents, searchQuery]);

  const handleSave = async () => {
    try {
      const { default: api } = await import('../../api/axios');
      
      const cls = dbClasses.find(c => c.nama_kelas === selectedClass);
      if (!cls) throw new Error("Data kelas tidak ditemukan");

      const semId = dbSemesters.length > 0 ? dbSemesters[0].id : "00000002-0000-0000-0000-000000000001";
      const mapelId = dbMapels.find(m => m.nama === selectedMapel)?.id;
      if (!mapelId) throw new Error("Mata pelajaran belum dipilih");

      const studentsToSave = currentStudents.filter(s => s.harian !== "" || s.uts !== "" || s.uas !== "");
      
      if (studentsToSave.length === 0) {
        setNotification("Gagal: Tidak ada nilai yang diinput.");
        setTimeout(() => setNotification(null), 4000);
        return;
      }

      setNotification("Menyimpan nilai ke database...");

      for (const student of studentsToSave) {
        const payload = {
          siswaId: student.id,
          mataPelajaranId: mapelId,
          semesterId: semId,
          nilaiHarian: parseInt(student.harian || 0),
          nilaiUts: parseInt(student.uts || 0),
          nilaiUas: parseInt(student.uas || 0),
          catatan: student.catatan
        };

        if (student.nilai_id) {
          // Update existing
          await api.put(`/nilai/${student.nilai_id}`, payload);
        } else {
          // Create new
          const res = await api.post('/nilai', payload);
          // Update local state with new ID if successfully inserted
          if (res.data?.data?.id) {
            setStudentsData(prev => {
              const updatedList = (prev[selectedClass] || []).map(s => {
                if (s.id === student.id) return { ...s, nilai_id: res.data.data.id };
                return s;
              });
              return { ...prev, [selectedClass]: updatedList };
            });
          }
        }
      }

      setNotification(`Berhasil menyimpan nilai untuk kelas ${selectedClass}!`);
    } catch (error) {
      console.error("Error saving grades:", error);
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.msg).join(', ')
        : error.response?.data?.message || error.message || "Terjadi kesalahan";
      setNotification(`Gagal: ${errorMsg}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading) {
    return <div className="p-8">Memuat data dari database...</div>;
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

      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Input Nilai</h1>
        <p className="text-sm text-gray-400 font-semibold">
          Data bersumber dari Database dan tersimpan secara real-time
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-sm font-black text-[#1e293b]">Pilih Konteks Nilai</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-[240px]">
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSearchQuery("");
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
          
          <div className="relative w-full sm:w-[240px]">
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none shadow-sm transition-all"
            >
              {mapels.length > 0 ? (
                mapels.map((mpl) => (
                  <option key={mpl} value={mpl}>
                    {mpl}
                  </option>
                ))
              ) : (
                <option value="">Tidak ada mapel</option>
              )}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 w-full pl-2">
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

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-black text-[#1e293b]">
              Daftar Siswa — {selectedClass || "Tidak ada kelas"}
            </h3>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[50px]">No</th>
                <th className="py-4 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[90px]">NIS</th>
                <th className="py-4 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Siswa</th>
                <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">Harian</th>
                <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">UTS</th>
                <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">UAS</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[280px]">Catatan Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-4 px-3 text-xs font-bold text-gray-400">{idx + 1}</td>
                    <td className="py-4 px-3 text-xs font-bold text-gray-500">{student.nis}</td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-sm ${student.avatarBg}`}>
                          {student.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-black text-gray-800">{student.name}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100 rounded">
                            {student.gender}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <input
                        type="text"
                        value={student.harian}
                        onChange={(e) => handleGradeChange(student.id, 'harian', e.target.value)}
                        placeholder="—"
                        className="w-[70px] bg-[#EBF3FA] text-[#1A3D63] text-center font-extrabold text-xs rounded-xl py-2 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
                      />
                    </td>
                    <td className="py-4 px-2 text-center">
                      <input
                        type="text"
                        value={student.uts}
                        onChange={(e) => handleGradeChange(student.id, 'uts', e.target.value)}
                        placeholder="—"
                        className="w-[70px] bg-[#EBF3FA] text-[#1A3D63] text-center font-extrabold text-xs rounded-xl py-2 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
                      />
                    </td>
                    <td className="py-4 px-2 text-center">
                      <input
                        type="text"
                        value={student.uas}
                        onChange={(e) => handleGradeChange(student.id, 'uas', e.target.value)}
                        placeholder="—"
                        className="w-[70px] bg-[#1A3D63] text-white text-center font-extrabold text-xs rounded-xl py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-md"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="text"
                        value={student.catatan}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        placeholder="Catatan nilai..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm font-bold text-gray-400">
                    Tidak ada siswa ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1e293b]">
              Simpan nilai kelas {selectedClass || "..."}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              {filledStudentsCount} dari {totalStudents} siswa telah memiliki nilai
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
