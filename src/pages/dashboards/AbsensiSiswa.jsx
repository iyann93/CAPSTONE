import React, { useState, useMemo, useEffect } from "react";
import ReactDOM, { createPortal } from "react-dom";
import RekapAbsensiSiswa from "./RekapAbsensiSiswa";
import api from '../../api/axios';

const AbsensiSiswa = ({ user, onSaveAttendance, attendanceSessions }) => {
  const [activeTab, setActiveTab] = useState("Input");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState([]);
  const [dbClasses, setDbClasses] = useState([]);
  const [studentsData, setStudentsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Fetch classes and students from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [kelasRes, siswaRes] = await Promise.all([
          api.get('/kelas'),
          api.get('/siswa')
        ]);
        
        const dbClassesData = kelasRes.data?.data || [];
        const dbSiswa = siswaRes.data?.data || [];

        // Parse classes
        const classNames = dbClassesData.map(c => c.nama_kelas);
        setDbClasses(dbClassesData);
        setClasses(classNames);
        if (classNames.length > 0) {
          setSelectedClass(classNames[0]);
        }

        // Group students by class
        const groupedData = {};
        classNames.forEach(cName => {
          groupedData[cName] = [];
        });

        dbSiswa.forEach(siswa => {
          const cls = dbClassesData.find(c => c.id === siswa.kelas_id);
          const className = cls ? cls.nama_kelas : "Tanpa Kelas";
          
          if (!groupedData[className]) {
            groupedData[className] = [];
          }

          groupedData[className].push({
            id: siswa.id, // Must be UUID
            nis: siswa.nis || "-",
            name: siswa.nama_lengkap,
            gender: siswa.jenis_kelamin === "Laki-laki" ? "Laki-laki" : "Perempuan",
            status: "Hadir", // Default
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

  // Fetch existing attendance when class or date changes
  useEffect(() => {
    if (!selectedClass || !selectedDate || !dbClasses.length || loading) return;

    const fetchExistingAbsensi = async () => {
      try {
        
        const cls = dbClasses.find(c => c.nama_kelas === selectedClass);
        if (!cls) return;

        const res = await api.get(`/absensi?tanggal=${selectedDate}&limit=2000`);
        const existingData = res.data?.data || [];
        
        if (existingData.length > 0) {
          setStudentsData(prev => {
            const updatedClassStudents = (prev[selectedClass] || []).map(student => {
              const record = existingData.find(r => r.siswa_id === student.id);
              if (record) {
                return { ...student, status: record.status };
              }
              return { ...student, status: "Hadir" };
            });
            return { ...prev, [selectedClass]: updatedClassStudents };
          });
        } else {
          // Reset to default if no data exists
          setStudentsData(prev => {
            const resetStudents = (prev[selectedClass] || []).map(student => ({ ...student, status: "Hadir" }));
            return { ...prev, [selectedClass]: resetStudents };
          });
        }
      } catch (err) {
        console.error("Error fetching existing absensi:", err);
      }
    };

    fetchExistingAbsensi();
  }, [selectedClass, selectedDate, dbClasses, loading]);

  const handleStatusChange = (studentId, newStatus) => {
    setStudentsData((prev) => {
      const updated = (prev[selectedClass] || []).map((s) => {
        if (s.id === studentId) return { ...s, status: newStatus };
        return s;
      });
      return { ...prev, [selectedClass]: updated };
    });
  };

  const handleMarkAll = (status) => {
    setStudentsData((prev) => {
      const updated = (prev[selectedClass] || []).map((s) => ({ ...s, status }));
      return { ...prev, [selectedClass]: updated };
    });
  };

  const currentStudents = studentsData[selectedClass] || [];

  const counts = useMemo(() => {
    const total = currentStudents.length;
    const hadir = currentStudents.filter((s) => s.status === "Hadir").length;
    const izin = currentStudents.filter((s) => s.status === "Izin").length;
    const sakit = currentStudents.filter((s) => s.status === "Sakit").length;
    const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;
    return { total, hadir, izin, sakit, rate };
  }, [currentStudents]);

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
      
      
      const cls = dbClasses.find(c => c.nama_kelas === selectedClass);
      if (!cls) throw new Error("Kelas tidak ditemukan");
      
      // Fetch jadwal pelajaran to get a valid jadwalId
      const jadwalRes = await api.get('/jadwal-pelajaran');
      const allJadwal = jadwalRes.data?.data || [];
      const jadwal = allJadwal.find(j => j.kelas_id === cls.id) || allJadwal[0];
      
      if (!jadwal) {
        showToast("Gagal: Tidak ada jadwal pelajaran yang tersedia.", "error");
        return;
      }
      
      const payload = currentStudents.map(student => ({
        siswaId: student.id,
        jadwalId: jadwal.id,
        tanggal: selectedDate,
        status: student.status,
        keterangan: ""
      }));
      
      await api.post('/absensi', payload);
      
      if (onSaveAttendance) {
        onSaveAttendance({
          attendanceClass: selectedClass,
          date: selectedDate,
          students: currentStudents
        });
      }
      showToast(`Absensi kelas ${selectedClass} berhasil disimpan ke database!`, "success");
    } catch (error) {
      console.error("Error saving attendance:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      showToast(`Gagal: ${errorMsg}`, "error");
    }
  };

  if (loading) {
    return (
    <div className="p-6 md:p-8 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
      <div className="h-4 bg-gray-100 rounded w-72"></div>
      <div className="bg-white rounded-3xl p-6 space-y-3 border border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>
    </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F8FAFC] min-h-screen relative">
      {/* Toast Notification */}
      {toastMsg && createPortal(
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl text-white text-sm font-bold shadow-2xl flex items-center gap-3 animate-slideDown ${
          toastMsg.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>
          {toastMsg.type === 'error' ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          )}
          {toastMsg.msg}
        </div>,
        document.body
      )}

      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Absensi Siswa</h1>
        <p className="text-sm text-gray-400 font-semibold">
          Semester Ganjil 2023/2024 • Data bersumber dari Database
        </p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("Input")}
          className={`py-3 px-6 font-bold text-sm transition-colors border-b-2 ${
            activeTab === "Input"
              ? "border-[#1A3D63] text-[#1A3D63]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Input Absensi
        </button>
        <button
          onClick={() => setActiveTab("Rekap")}
          className={`py-3 px-6 font-bold text-sm transition-colors border-b-2 ${
            activeTab === "Rekap"
              ? "border-[#1A3D63] text-[#1A3D63]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Rekap Absensi
        </button>
      </div>

      {activeTab === "Rekap" ? (
        <div className="pt-2">
          <RekapAbsensiSiswa user={user} attendanceSessions={attendanceSessions} isEmbedded={true} />
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-sm font-black text-[#1e293b]">Pilih Kelas & Tanggal</h3>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="relative w-full sm:w-[220px]">
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

          <div className="relative w-full sm:w-[200px]">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>

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

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-gray-800">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-black text-[#1e293b]">
                Daftar Siswa — {selectedClass || "Tidak ada kelas"}
              </h3>
            </div>

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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[60px]">No</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[120px]">NIS</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Siswa</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[380px]">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-5 px-4 text-xs font-bold text-gray-400">{idx + 1}</td>
                    <td className="py-5 px-4 text-xs font-bold text-gray-500">{student.nis}</td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-sm ${student.avatarBg}`}>
                          {student.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-black text-gray-800">{student.name}</div>
                          <span className="inline-block mt-1 text-[10px] text-gray-400 font-semibold">{student.gender}</span>
                        </div>
                      </div>
                    </td>
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
                                  isSelected ? "bg-[#1A3D63] text-white shadow-md scale-100" : "text-gray-500 hover:bg-gray-100"
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
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

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1e293b]">
              Simpan absensi kelas {selectedClass || "..."}
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
        </>
      )}
    </div>
  );
};

export default AbsensiSiswa;
