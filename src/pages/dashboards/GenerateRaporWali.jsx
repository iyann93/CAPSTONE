import React, { useState } from "react";

const GenerateRaporWali = ({ user }) => {
  const [studentsData, setStudentsData] = useState(() => {
    const saved = localStorage.getItem("wali_kelas_students");
    if (saved) return JSON.parse(saved);
    return {
      "VII A": [
        { id: "2023001", name: "Andi Pratama", gender: "Laki-laki", note: "Aktif dan rajin. Kemampuan aljabar meningkat pesat.", lastUpdated: "15 Nov 2023", avatarBg: "bg-blue-500", statusRapor: "Belum Terbit", hadir: 90, mapel: 12 },
        { id: "2023002", name: "Dewi Sartika", gender: "Perempuan", note: "Nilai tertinggi di kelas. Sangat direkomendasikan mengikuti olimpiade.", lastUpdated: "12 Nov 2023", avatarBg: "bg-slate-700", statusRapor: "Terbit", hadir: 100, mapel: 12 },
        { id: "2023003", name: "Ricky Firmansyah", gender: "Laki-laki", note: "", lastUpdated: null, avatarBg: "bg-amber-600", statusRapor: "Belum Terbit", hadir: 85, mapel: 10 },
        { id: "2023004", name: "Nurul Hidayah", gender: "Perempuan", note: "Sangat baik", lastUpdated: "12 Nov 2023", avatarBg: "bg-red-500", statusRapor: "Terbit", hadir: 98, mapel: 12 },
      ]
    };
  });

  const students = studentsData["VII A"];
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeDetailModal, setActiveDetailModal] = useState(null); // 'mapel' | 'absensi' | null

  // Dummy detail data
  const [expandedMapel, setExpandedMapel] = useState(null);
  
  const mockDetailMapel = [
    { mapel: "Pendidikan Agama Islam", kkm: 75, harian: 85, uts: 89, uas: 90, nilai: 88, predikat: "B",
      breakdown: [{name: "Tugas 1", score: 85}, {name: "Tugas 2", score: 88}, {name: "Kuis 1", score: 82}]
    },
    { mapel: "Pendidikan Pancasila", kkm: 75, harian: 90, uts: 92, uas: 88, nilai: 90, predikat: "A",
      breakdown: [{name: "Tugas 1", score: 92}, {name: "Tugas 2", score: 90}, {name: "Kuis 1", score: 88}]
    },
    { mapel: "Bahasa Indonesia", kkm: 75, harian: 80, uts: 86, uas: 89, nilai: 85, predikat: "B",
      breakdown: [{name: "Tugas 1", score: 78}, {name: "Tugas 2", score: 82}, {name: "Kuis 1", score: 80}]
    },
    { mapel: "Matematika", kkm: 70, harian: 75, uts: 78, uas: 81, nilai: 78, predikat: "C",
      breakdown: [{name: "Tugas 1", score: 70}, {name: "Tugas 2", score: 80}, {name: "Kuis 1", score: 75}]
    },
    { mapel: "Ilmu Pengetahuan Alam", kkm: 70, harian: 82, uts: 80, uas: 84, nilai: 82, predikat: "B",
      breakdown: [{name: "Tugas 1", score: 85}, {name: "Tugas 2", score: 80}, {name: "Kuis 1", score: 81}]
    },
    { mapel: "Ilmu Pengetahuan Sosial", kkm: 75, harian: 88, uts: 84, uas: 86, nilai: 86, predikat: "B",
      breakdown: [{name: "Tugas 1", score: 90}, {name: "Tugas 2", score: 88}, {name: "Kuis 1", score: 86}]
    },
    { mapel: "Bahasa Inggris", kkm: 75, harian: 92, uts: 90, uas: 94, nilai: 92, predikat: "A",
      breakdown: [{name: "Tugas 1", score: 95}, {name: "Tugas 2", score: 90}, {name: "Kuis 1", score: 91}]
    },
  ];

  const mockDetailAbsensi = {
    hadir: 90,
    izin: 4,
    sakit: 6,
    alpa: 0,
    totalHari: 100
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      const updatedList = students.map(s => s.id === selectedStudent.id ? { ...s, statusRapor: "Terbit" } : s);
      const newData = { ...studentsData, "VII A": updatedList };
      setStudentsData(newData);
      localStorage.setItem("wali_kelas_students", JSON.stringify(newData));
      
      setPublishing(false);
      setShowPreview(false);
      setSelectedStudent(null);
      alert("Rapor berhasil diterbitkan dan siap diakses oleh orang tua!");
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-screen relative">
      {/* Detail Modal Overlay */}
      {activeDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[650px] shadow-xl flex flex-col overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#1F3A5F] text-white">
              <h3 className="text-[16px] font-bold">
                {activeDetailModal === 'mapel' ? `Detail Nilai Mapel - ${selectedStudent.name}` : activeDetailModal === 'absensi' ? `Detail Absensi - ${selectedStudent.name}` : `Catatan Wali Kelas - ${selectedStudent.name}`}
              </h3>
              <button onClick={() => setActiveDetailModal(null)} className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeDetailModal === 'mapel' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <span className="text-[13px] text-blue-800 font-semibold">Total Mapel Terinput:</span>
                    <span className="text-[14px] font-bold text-blue-700">{selectedStudent.mapel} / 12 Mapel</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium italic">Klik pada baris mata pelajaran untuk melihat rincian nilai harian.</p>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-y border-gray-200">
                        <th className="py-2 px-3 text-left text-[11px] font-bold text-gray-500">MATA PELAJARAN</th>
                        <th className="py-2 px-2 text-center text-[10px] font-bold text-gray-500">KKM</th>
                        <th className="py-2 px-2 text-center text-[10px] font-bold text-gray-500">HARIAN</th>
                        <th className="py-2 px-2 text-center text-[10px] font-bold text-gray-500">UTS</th>
                        <th className="py-2 px-2 text-center text-[10px] font-bold text-gray-500">UAS</th>
                        <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">AKHIR</th>
                        <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">PREDIKAT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockDetailMapel.map((m, i) => (
                        <React.Fragment key={i}>
                          <tr onClick={() => setExpandedMapel(expandedMapel === i ? null : i)} className="hover:bg-gray-50/50 cursor-pointer transition-colors group">
                            <td className="py-3 px-3 text-[12px] font-bold text-gray-700 group-hover:text-[#1A3D63] flex items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${expandedMapel === i ? 'rotate-90 text-[#1A3D63]' : 'text-gray-300'}`}><path d="M9 18l6-6-6-6"/></svg>
                              {m.mapel}
                            </td>
                            <td className="py-3 px-2 text-[11px] text-gray-400 font-semibold text-center">{m.kkm}</td>
                            <td className="py-3 px-2 text-[12px] text-gray-600 font-semibold text-center">{m.harian}</td>
                            <td className="py-3 px-2 text-[12px] text-gray-600 font-semibold text-center">{m.uts}</td>
                            <td className="py-3 px-2 text-[12px] text-gray-600 font-semibold text-center">{m.uas}</td>
                            <td className="py-3 px-2 text-[13px] font-bold text-[#1F3A5F] text-center">{m.nilai}</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.predikat === 'A' ? 'bg-green-100 text-green-700' : m.predikat === 'B' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                {m.predikat}
                              </span>
                            </td>
                          </tr>
                          {expandedMapel === i && (
                            <tr className="bg-slate-50/50">
                              <td colSpan="7" className="p-4 border-b border-gray-100">
                                <div className="pl-6">
                                  <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Rincian Komponen Nilai Harian</div>
                                  <div className="grid grid-cols-3 gap-3">
                                    {m.breakdown.map((b, idx) => (
                                      <div key={idx} className="bg-white border border-gray-200 p-2 rounded-lg flex justify-between items-center shadow-sm">
                                        <span className="text-[11px] text-gray-600 font-medium">{b.name}</span>
                                        <span className="text-[12px] font-bold text-[#1A3D63]">{b.score}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activeDetailModal === 'absensi' ? (
                <div className="space-y-6">
                   <div className="flex items-center justify-center">
                     <div className="w-32 h-32 relative flex items-center justify-center rounded-full border-8 border-green-500/20">
                       <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                         <circle cx="60" cy="60" r="56" fill="transparent" stroke="#22c55e" strokeWidth="8" strokeDasharray="351.85" strokeDashoffset={351.85 - (351.85 * mockDetailAbsensi.hadir) / 100} />
                       </svg>
                       <div className="text-center">
                         <span className="text-[24px] font-black text-green-600">{mockDetailAbsensi.hadir}%</span>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Kehadiran</p>
                       </div>
                     </div>
                   </div>
                   <div className="grid grid-cols-4 gap-3 text-center">
                     <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Hadir</p>
                       <p className="text-[16px] font-black text-green-700">{mockDetailAbsensi.hadir}</p>
                     </div>
                     <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Izin</p>
                       <p className="text-[16px] font-black text-amber-700">{mockDetailAbsensi.izin}</p>
                     </div>
                     <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Sakit</p>
                       <p className="text-[16px] font-black text-blue-700">{mockDetailAbsensi.sakit}</p>
                     </div>
                     <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Alpa</p>
                       <p className="text-[16px] font-black text-red-700">{mockDetailAbsensi.alpa}</p>
                     </div>
                   </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  {selectedStudent.note ? (
                    <p className="text-[15px] text-gray-800 font-semibold italic leading-relaxed">"{selectedStudent.note}"</p>
                  ) : (
                    <p className="text-[14px] text-gray-400 font-medium">Siswa ini belum diberikan catatan oleh Wali Kelas.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
              <button onClick={() => setActiveDetailModal(null)} className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Rapor Siswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">Kelola, periksa kelengkapan, dan terbitkan rapor akademik siswa kelas perwalian Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Student List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-[16px] font-bold text-gray-800">Daftar Siswa Kelas VII A</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {students.map(s => (
              <button 
                key={s.id}
                onClick={() => { setSelectedStudent(s); setShowPreview(false); }}
                className={`w-full text-left p-3.5 rounded-xl transition-colors border flex items-center justify-between ${selectedStudent?.id === s.id ? 'bg-[#1A3D63] text-white shadow-md' : 'bg-white hover:bg-gray-50 border-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${selectedStudent?.id === s.id ? 'bg-white/20' : s.avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
                    {s.name[0]}
                  </div>
                  <div>
                    <h3 className={`text-[13px] font-bold ${selectedStudent?.id === s.id ? 'text-white' : 'text-gray-800'}`}>{s.name}</h3>
                    <p className={`text-[11px] ${selectedStudent?.id === s.id ? 'text-blue-200' : 'text-gray-400'}`}>NIS: {s.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${s.statusRapor === "Terbit" ? (selectedStudent?.id === s.id ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600') : (selectedStudent?.id === s.id ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500')}`}>
                  {s.statusRapor}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Action Area */}
        <div className="lg:col-span-7 flex flex-col h-[600px]">
          {selectedStudent ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden animate-fadeIn">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#1F3A5F]">Detail Pemeriksaan Rapor</h2>
                  <p className="text-[13px] text-gray-500 mt-1">{selectedStudent.name}</p>
                </div>
                {selectedStudent.statusRapor === "Terbit" && (
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[12px] font-bold flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Telah Terbit
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Checking Status */}
                <div className="space-y-4">
                  <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Kelengkapan Data</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={() => setActiveDetailModal('mapel')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                          Nilai Mapel
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                        </span>
                        <span className={`text-[11px] font-bold ${selectedStudent.mapel === 12 ? 'text-green-600' : 'text-red-500'}`}>
                          {selectedStudent.mapel}/12
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${selectedStudent.mapel === 12 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${(selectedStudent.mapel/12)*100}%`}}></div></div>
                    </button>
                    
                    <button onClick={() => setActiveDetailModal('absensi')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                          Absensi
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                        </span>
                        <span className="text-[11px] font-bold text-green-600">{selectedStudent.hadir}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: `${selectedStudent.hadir}%`}}></div></div>
                    </button>

                    <button onClick={() => setActiveDetailModal('catatan')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                          Catatan Wali
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                        </span>
                        <span className={`text-[11px] font-bold ${selectedStudent.note ? 'text-green-600' : 'text-red-500'}`}>
                          {selectedStudent.note ? "Sudah Diisi" : "Belum Diisi"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${selectedStudent.note ? 'bg-green-500' : 'bg-red-500'}`} style={{width: selectedStudent.note ? '100%' : '0%'}}></div></div>
                    </button>
                  </div>
                </div>

                {(!selectedStudent.note || selectedStudent.mapel < 12) && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[13px] font-bold flex gap-2 items-start">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Data belum lengkap! Harap hubungi Guru Mapel terkait atau isi catatan wali kelas terlebih dahulu sebelum dapat menerbitkan rapor.
                  </div>
                )}

                {showPreview && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center animate-fadeIn">
                     <div className="w-16 h-16 bg-[#1A3D63] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <h3 className="text-[16px] font-bold text-gray-800">Preview Dokumen Rapor</h3>
                    <p className="text-[13px] text-gray-500 mt-1">Rapor Semester Ganjil 2023/2024 - {selectedStudent.name}</p>
                    <div className="mt-4 inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-600">
                      📄 rapor_ganjil_2324_{selectedStudent.id}.pdf
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
                {!showPreview ? (
                  <button 
                    onClick={() => setShowPreview(true)}
                    disabled={!selectedStudent.note || selectedStudent.mapel < 12}
                    className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${selectedStudent.note && selectedStudent.mapel === 12 ? 'bg-[#1A3D63] text-white hover:bg-[#15304f]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    Generate Rapor
                  </button>
                ) : (
                  <>
                    <button onClick={() => setShowPreview(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all">Batal</button>
                    {selectedStudent.statusRapor !== "Terbit" && (
                       <button 
                        onClick={handlePublish}
                        disabled={publishing}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 shadow-sm"
                      >
                        {publishing ? (
                          <>
                             <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                             Menyimpan...
                          </>
                        ) : "Simpan & Terbitkan"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <p className="text-[14px] font-bold text-gray-400">Pilih siswa untuk melihat dan mencetak rapor</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateRaporWali;
