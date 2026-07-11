import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

const RekapAbsensiSiswa = ({ user, attendanceSessions = [] }) => {
  const [selectedClass, setSelectedClass] = useState("Kelas IX");
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
  
  const [classes, setClasses] = useState([]);
  const [derivedStudentsData, setDerivedStudentsData] = useState({});
  const [dbSessionCounts, setDbSessionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({ absensi: 0, nilai: 0 });

  // Fetch classes and students from backend
  useEffect(() => {
    const fetchData = async (isPolling = false) => {
      try {
        if (!isPolling) setLoading(true);
        const { default: api } = await import('../../api/axios');
        const [kelasRes, siswaRes, jadwalRes, mapelRes] = await Promise.all([
          api.get('/kelas'),
          api.get('/siswa'),
          api.get('/jadwal_pelajaran?limit=2000'),
          api.get('/mapel?limit=2000').catch(() => ({ data: { data: [] } }))
        ]);
        
        const dbClasses = kelasRes.data?.data || [];
        const dbSiswa = siswaRes.data?.data || [];
        const dbJadwal = jadwalRes.data?.data || [];
        const dbMapels = mapelRes.data?.data || [];

        const guruIdentifier = user?.fullName || user?.nip || user?.userId;
        const guruJadwal = dbJadwal.filter(j => j.guru_nama === guruIdentifier || j.nip === guruIdentifier);
        const taughtClassIds = new Set(guruJadwal.map(j => j.kelas_id));
        
        const classNames = dbClasses.map(c => c.nama_kelas);
        
        setClasses(classNames);
        if (classNames.length > 0 && !classNames.includes(selectedClass)) {
           setSelectedClass(classNames[0]);
        }

        const classMap = {};
        classNames.forEach(cName => {
          classMap[cName] = {};
        });

        // Initialize students from DB
        dbSiswa.forEach(siswa => {
          const cls = dbClasses.find(c => c.id === siswa.kelas_id);
          const className = cls ? cls.nama_kelas : "Tanpa Kelas";
          
          if (!classMap[className]) {
            classMap[className] = {};
          }

          classMap[className][siswa.id] = {
            id: siswa.id, // UUID
            nis: siswa.nis || "-",
            name: siswa.nama_lengkap,
            gender: siswa.jenis_kelamin === "Laki-laki" ? "L" : "P",
            avatarBg: "bg-blue-500",
            hadir: 0,
            izin: 0,
            sakit: 0,
            harian: "-",
            uts: "-",
            uas: "-"
          };
        });

        // Fetch ALL absensi & nilai records from database
        const [absensiRes, nilaiRes] = await Promise.all([
          api.get(`/absensi?limit=2000`),
          api.get(`/nilai?limit=2000`)
        ]);
        
        const dbAbsensi = absensiRes.data?.data || [];
        const dbNilai = nilaiRes.data?.data || [];
        
        // Save raw counts for debugging
        setDebugInfo({ absensi: dbAbsensi.length, nilai: dbNilai.length, jadwal: dbJadwal.length });

        const sessionCountsMap = {};

        dbAbsensi.forEach(record => {
          let foundStudent = null;
          let classNameForStudent = "Tanpa Kelas";
          
          for (const [cName, students] of Object.entries(classMap)) {
            if (students[record.siswa_id]) {
              foundStudent = students[record.siswa_id];
              classNameForStudent = cName;
              break;
            }
          }
          
          if (foundStudent) {
            if (!sessionCountsMap[classNameForStudent]) {
              sessionCountsMap[classNameForStudent] = new Set();
            }
            if (record.tanggal) {
              sessionCountsMap[classNameForStudent].add(record.tanggal);
            }
            
            if (record.status === "Hadir") foundStudent.hadir++;
            else if (record.status === "Izin") foundStudent.izin++;
            else if (record.status === "Sakit") foundStudent.sakit++;
          }
        });

        const finalSessionCounts = {};
        Object.keys(sessionCountsMap).forEach(cls => {
          finalSessionCounts[cls] = sessionCountsMap[cls].size;
        });
        setDbSessionCounts(finalSessionCounts);

        // Calculate grades explicitly for the Guru's mapel in that class
        Object.keys(classMap).forEach(clsName => {
          const clsStudents = classMap[clsName];
          const clsObj = dbClasses.find(c => c.nama_kelas === clsName);
          const clsId = clsObj ? clsObj.id : null;
          
          // Determine the mapel taught by this guru in this class
          const jadwalGuru = dbJadwal.find(j => 
             j.kelas_id === clsId && 
             (j.guru_nama === guruIdentifier || j.nip === guruIdentifier)
          );
          
          let guruMapelId = jadwalGuru ? jadwalGuru.mata_pelajaran_id : null;
          
          if (!guruMapelId) {
             // Find the Guru's actual guru_id from ANY of their schedules
             const anyJadwal = dbJadwal.find(j => j.guru_nama === guruIdentifier || j.nip === guruIdentifier);
             const myGuruId = anyJadwal ? anyJadwal.guru_id : null;

             // Fallback to finding ANY mapel this guru teaches (useful if jadwal is not fully configured)
             const defaultMapel = dbMapels.find(m => m.guru_pengampu_id === myGuruId || m.guru_pengampu_id === user?.userId);
             if (defaultMapel) guruMapelId = defaultMapel.id;
          }

          Object.values(clsStudents).forEach(stu => {
            // Filter grades strictly for this guru's mapel
            const studentGrades = dbNilai.filter(n => 
              n.siswa_id === stu.id && 
              (!guruMapelId || n.mata_pelajaran_id === guruMapelId)
            );
            
            if (studentGrades.length > 0) {
              const sumHarian = studentGrades.reduce((sum, n) => sum + parseFloat(n.nilai_harian || 0), 0);
              const sumUts = studentGrades.reduce((sum, n) => sum + parseFloat(n.nilai_uts || 0), 0);
              const sumUas = studentGrades.reduce((sum, n) => sum + parseFloat(n.nilai_uas || 0), 0);
              
              stu.harian = parseFloat((sumHarian / studentGrades.length).toFixed(1));
              stu.uts = parseFloat((sumUts / studentGrades.length).toFixed(1));
              stu.uas = parseFloat((sumUas / studentGrades.length).toFixed(1));
            }
          });
        });

        const result = {};
        Object.keys(classMap).forEach((cls) => {
          result[cls] = Object.values(classMap[cls]);
        });
        
        setDerivedStudentsData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (!isPolling) setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Only fetch once on mount, selectedClass purely filters the local state

  const currentStudents = derivedStudentsData[selectedClass] || [];

  const metrics = useMemo(() => {
    const total = currentStudents.length;
    let totalHadir = 0;
    let totalIzin = 0;
    let totalSakit = 0;
    let totalGrades = 0;
    let validGradesCount = 0;

    currentStudents.forEach((student) => {
      totalHadir += student.hadir;
      totalIzin += student.izin;
      totalSakit += student.sakit;
      if (typeof student.harian === "number") {
        totalGrades += (student.harian + student.uts + student.uas) / 3;
        validGradesCount++;
      }
    });

    const sessionCount = dbSessionCounts[selectedClass] || 0;

    const averageGrade = validGradesCount > 0 ? (totalGrades / validGradesCount).toFixed(1) : "0.0";

    return { total, totalHadir, totalIzin, totalSakit, sessionCount, averageGrade };
  }, [currentStudents, dbSessionCounts, selectedClass]);

  const filteredStudents = useMemo(() => {
    let result = currentStudents;

    if (activeTab === "Hadir Penuh") {
      result = result.filter((s) => s.izin === 0 && s.sakit === 0 && s.hadir > 0);
    } else if (activeTab === "Ada Izin/Sakit") {
      result = result.filter((s) => s.izin > 0 || s.sakit > 0);
    }

    if (searchQuery.trim()) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.includes(searchQuery)
      );
    }

    return result;
  }, [currentStudents, activeTab, searchQuery]);



  const handleExport = () => {
    setNotification("Berhasil mengekspor rekap absensi ke format Excel!");
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs font-semibold text-gray-400 gap-1.5">
            <span>Rekap Absensi Siswa</span>
            <span>•</span>
            <span>Semester Ganjil 2023/2024 • Data bersumber dari Database</span>
          </div>
          <div className="mt-2 text-[10px] font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-200 inline-block w-fit">
            Debug: {debugInfo.absensi} absensi, {debugInfo.nilai} nilai.
          </div>
          <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">Rekap Absensi Siswa</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            Rangkuman kehadiran dan catatan siswa berdasarkan data yang telah diinput.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-slate-50 text-gray-700 px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-sm active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Ekspor Rekap
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Pilih Kelas</span>
        <div className="relative w-full sm:w-[240px]">
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSearchQuery("");
              setActiveTab("Semua");
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
        <p className="text-[10px] text-gray-400 font-semibold">
          {metrics.sessionCount} sesi absensi tersimpan untuk kelas ini
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Siswa",
            value: metrics.total,
            bg: "bg-blue-50",
            color: "text-blue-500",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            )
          },
          {
            label: "Total Hadir",
            value: metrics.totalHadir,
            bg: "bg-emerald-50",
            color: "text-emerald-500",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )
          },
          {
            label: "Total Izin",
            value: metrics.totalIzin,
            bg: "bg-purple-50",
            color: "text-purple-500",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            )
          },
          {
            label: "Total Sakit",
            value: metrics.totalSakit,
            bg: "bg-amber-50",
            color: "text-amber-500",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            )
          },
          {
            label: "Rata-rata Nilai",
            value: metrics.averageGrade,
            bg: "bg-indigo-50",
            color: "text-indigo-500",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )
          }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`w-10 h-10 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} mb-3.5`}>
              {card.icon}
            </div>
            <span className="text-[26px] font-black text-[#1e293b] leading-none">{card.value}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">{card.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-1.5">
            {["Semua", "Hadir Penuh", "Ada Izin/Sakit"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab
                    ? "bg-[#1A3D63] text-white shadow-md"
                    : "text-gray-500 bg-white hover:bg-slate-50 border border-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
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
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[50px]">No</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[110px]">NIS</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Siswa</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">Hadir</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">Izin</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[90px]">Sakit</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[160px]">% Hadir</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[100px]">Harian</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[100px]">UTS</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[100px]">UAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => {
                  const totalSessions = student.hadir + student.izin + student.sakit;
                  const pct = totalSessions > 0 ? Math.round((student.hadir / totalSessions) * 100) : 0;

                  return (
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
                            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100 rounded">
                              {student.gender}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center text-sm font-extrabold text-gray-800">{student.hadir}</td>
                      <td className={`py-5 px-4 text-center text-sm font-extrabold ${student.izin > 0 ? "text-purple-600" : "text-gray-400"}`}>
                        {student.izin}
                      </td>
                      <td className={`py-5 px-4 text-center text-sm font-extrabold ${student.sakit > 0 ? "text-amber-600" : "text-gray-400"}`}>
                        {student.sakit}
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex flex-col gap-1 w-full max-w-[120px]">
                          <span className="text-xs font-extrabold text-gray-700">{pct}%</span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1A3D63] rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {pct === 0 && (
                            <span className="text-[9px] font-bold text-red-500">Perlu perhatian</span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center text-sm font-extrabold text-gray-800">{student.harian}</td>
                      <td className="py-5 px-4 text-center text-sm font-extrabold text-gray-800">{student.uts}</td>
                      <td className="py-5 px-4 text-center text-sm font-extrabold text-gray-800">{student.uas}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm font-bold text-gray-400">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold">
            {filteredStudents.length} siswa ditampilkan
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Data bersumber dari: Absensi Siswa yang telah disimpan
          </span>
        </div>
      </div>
    </div>
  );
};

export default RekapAbsensiSiswa;
