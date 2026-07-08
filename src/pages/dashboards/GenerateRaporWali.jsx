import React, { useState, useEffect, useMemo } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GenerateRaporWali = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [activeSemester, setActiveSemester] = useState(null);

  const [studentsData, setStudentsData] = useState([]);
  const [nilaiData, setNilaiData] = useState([]);
  const [absensiData, setAbsensiData] = useState([]);
  const [catatanData, setCatatanData] = useState([]);
  const [raporData, setRaporData] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeDetailModal, setActiveDetailModal] = useState(null);
  const [expandedMapel, setExpandedMapel] = useState(null);

  // Initialization
  useEffect(() => {
    const init = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const [kelasRes, semRes] = await Promise.all([
          api.get('/kelas'),
          api.get('/semester')
        ]);
        const dbClasses = kelasRes.data?.data || [];
        setClasses(dbClasses);
        if (dbClasses.length > 0) setSelectedClassId(dbClasses[0].id);

        const active = (semRes.data?.data || []).find(s => s.is_active);
        setActiveSemester(active);
      } catch (e) {
        console.error("Gagal inisialisasi:", e);
      }
    };
    init();
  }, []);

  // Fetch data per class
  const fetchClassData = async () => {
    if (!selectedClassId || !activeSemester) return;
    try {
      const { default: api } = await import('../../api/axios');
      const [siswaRes, nilaiRes, absRes, catRes, raporRes] = await Promise.all([
        api.get(`/siswa?kelas_id=${selectedClassId}&limit=1000`),
        api.get(`/nilai/kelas/${selectedClassId}?semester_id=${activeSemester.id}`),
        api.get(`/absensi/rekap/semester?semester_id=${activeSemester.id}&kelas_id=${selectedClassId}`),
        api.get(`/catatan-siswa?limit=1000`),
        api.get(`/rapor/kelas/${selectedClassId}?semester_id=${activeSemester.id}`)
      ]);

      setStudentsData(siswaRes.data?.data || []);
      setNilaiData(nilaiRes.data?.data || []);
      setAbsensiData(absRes.data?.data || []);
      setCatatanData(catRes.data?.data || []);
      setRaporData(raporRes.data?.data || []);
    } catch (e) {
      console.error("Gagal mengambil data kelas:", e);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [selectedClassId, activeSemester]);

  // Derived Data for Selected Student
  const currentDetails = useMemo(() => {
    if (!selectedStudent) return null;
    const sId = selectedStudent.id;
    
    // Nilai Mapel
    const studentNilai = nilaiData.filter(n => n.siswa_id === sId);
    const detailMapel = studentNilai.map(n => {
      const akhir = n.nilai_akhir || ((n.nilai_harian*0.3) + (n.nilai_uts*0.3) + (n.nilai_uas*0.4)).toFixed(0);
      const na = parseFloat(akhir);
      return {
        mapel: n.nama_mapel,
        kkm: 75,
        harian: parseFloat(n.nilai_harian).toFixed(0),
        uts: parseFloat(n.nilai_uts).toFixed(0),
        uas: parseFloat(n.nilai_uas).toFixed(0),
        nilai: na.toFixed(0),
        predikat: na >= 90 ? 'A' : na >= 80 ? 'B' : na >= 70 ? 'C' : 'D',
        breakdown: [
          {name: "Tugas/Harian", score: parseFloat(n.nilai_harian).toFixed(0)},
          {name: "UTS", score: parseFloat(n.nilai_uts).toFixed(0)},
          {name: "UAS", score: parseFloat(n.nilai_uas).toFixed(0)}
        ]
      };
    });

    // Absensi
    const abs = absensiData.find(a => a.siswa_id === sId) || { total_hadir: 0, total_izin: 0, total_sakit: 0, total_alpha: 0 };
    const totalAbsensi = parseInt(abs.total_hadir) + parseInt(abs.total_izin) + parseInt(abs.total_sakit) + parseInt(abs.total_alpha);
    const persentaseHadir = totalAbsensi > 0 ? Math.round((parseInt(abs.total_hadir) / totalAbsensi) * 100) : 0;
    
    // Catatan
    const catatan = catatanData.find(c => c.siswa_id === sId)?.isi_catatan || "";
    
    // Status Rapor
    const rapor = raporData.find(r => r.siswa_id === sId);
    const statusRapor = rapor?.is_published ? "Terbit" : "Belum Terbit";
    
    return {
      mapelList: detailMapel,
      mapelCount: detailMapel.length,
      absensi: {
        hadir: parseInt(abs.total_hadir) || 0,
        izin: parseInt(abs.total_izin) || 0,
        sakit: parseInt(abs.total_sakit) || 0,
        alpa: parseInt(abs.total_alpha) || 0,
        persenHadir: persentaseHadir
      },
      catatan,
      statusRapor,
      avatarBg: ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-purple-500", "bg-indigo-500"][sId.charCodeAt(0) % 6] || "bg-[#1A3D63]"
    };
  }, [selectedStudent, nilaiData, absensiData, catatanData, raporData]);

  const handlePublish = async () => {
    if (!selectedClassId || !activeSemester) return;
    setPublishing(true);
    try {
      const { default: api } = await import('../../api/axios');
      // Step 1: Generate rapor for the class
      await api.post('/rapor/generate', {
        mode: 'kelas',
        kelasId: selectedClassId,
        semesterId: activeSemester.id
      });
      // Step 2: Publish rapor for the class
      await api.post('/rapor/publish', {
        kelasId: selectedClassId,
        semesterId: activeSemester.id
      });
      
      await fetchClassData();
      setShowPreview(false);
      alert("Rapor berhasil diterbitkan dan siap diakses oleh orang tua!");
    } catch (e) {
      console.error(e);
      alert("Gagal menerbitkan rapor.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedStudent || !currentDetails) return;
    setDownloading(true);
    try {
        const doc = new jsPDF();
        
        // Header
        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.text("LAPORAN HASIL BELAJAR", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Semester ${activeSemester?.tipe} Tahun Ajaran ${activeSemester?.tahun_ajaran}`, 105, 26, { align: "center" });
        
        doc.setLineWidth(0.5);
        doc.line(14, 30, 196, 30);
        
        // Student Info
        doc.setFont("times", "normal");
        doc.text(`Nama Siswa    : ${selectedStudent.nama_lengkap}`, 14, 40);
        doc.text(`NISN / NIS    : ${selectedStudent.nisn || '-'} / ${selectedStudent.nis || '-'}`, 14, 46);
        
        const clsName = classes.find(c => c.id === selectedClassId)?.nama_kelas || "-";
        doc.text(`Kelas         : ${clsName}`, 140, 40);
        doc.text(`Fase          : D (SMP)`, 140, 46);
        
        // A. Sikap
        doc.setFont("times", "bold");
        doc.text("A. Sikap", 14, 60);
        doc.setFont("times", "normal");
        const sikapText = `Deskripsi: ${selectedStudent.nama_lengkap} menunjukkan sikap spiritual dan sosial yang ${currentDetails.absensi.persenHadir >= 90 ? 'sangat baik' : 'baik'} dalam mengikuti pembelajaran, menjunjung tinggi nilai gotong royong, dan berinteraksi secara sopan di lingkungan sekolah.`;
        const splitSikap = doc.splitTextToSize(sikapText, 182);
        doc.text(splitSikap, 14, 66);
        
        // B. Pengetahuan & Keterampilan
        doc.setFont("times", "bold");
        doc.text("B. Pengetahuan & Keterampilan", 14, 85);
        
        const tableBody = currentDetails.mapelList.map((m, i) => [
            i + 1, m.mapel, m.nilai, m.predikat
        ]);
        
        autoTable(doc, {
            startY: 90,
            head: [['No', 'Mata Pelajaran', 'Nilai', 'Predikat']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 },
                2: { halign: 'center', cellWidth: 30 },
                3: { halign: 'center', cellWidth: 30 },
            },
            styles: { font: 'times', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0] }
        });
        
        const finalY = doc.lastAutoTable.finalY || 150;
        
        // C. Ketidakhadiran
        doc.setFont("times", "bold");
        doc.text("C. Ketidakhadiran", 14, finalY + 15);
        
        autoTable(doc, {
            startY: finalY + 20,
            body: [
                ['Sakit', `${currentDetails.absensi.sakit} hari`],
                ['Izin', `${currentDetails.absensi.izin} hari`],
                ['Tanpa Keterangan', `${currentDetails.absensi.alpa} hari`]
            ],
            theme: 'grid',
            columnStyles: {
                0: { cellWidth: 60, fontStyle: 'bold', fillColor: [248, 248, 248] },
                1: { cellWidth: 40, halign: 'center' }
            },
            styles: { font: 'times', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0] },
            margin: { left: 14 }
        });
        
        // D. Catatan Wali Kelas
        doc.setFont("times", "bold");
        doc.text("D. Catatan Wali Kelas", 120, finalY + 15);
        
        doc.setFont("times", "italic");
        doc.rect(120, finalY + 18, 76, 25);
        const splitCatatan = doc.splitTextToSize(`"${currentDetails.catatan}"`, 72);
        doc.text(splitCatatan, 122, finalY + 24);
        
        // Save
        doc.save(`rapor_${activeSemester?.tipe}_${selectedStudent.id}.pdf`);
    } catch (err) {
        console.error(err);
        alert("Gagal membuat PDF: " + err.message);
    } finally {
        setDownloading(false);
    }
  };

  const getStudentStatusRapor = (sId) => {
    const r = raporData.find(x => x.siswa_id === sId);
    return r?.is_published ? "Terbit" : "Belum Terbit";
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-screen relative">
      {/* Detail Modal Overlay */}
      {activeDetailModal && selectedStudent && currentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[650px] shadow-xl flex flex-col overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#1F3A5F] text-white">
              <h3 className="text-[16px] font-bold">
                {activeDetailModal === 'mapel' ? `Detail Nilai Mapel - ${selectedStudent.nama_lengkap}` : activeDetailModal === 'absensi' ? `Detail Absensi - ${selectedStudent.nama_lengkap}` : `Catatan Wali Kelas - ${selectedStudent.nama_lengkap}`}
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
                    <span className="text-[14px] font-bold text-blue-700">{currentDetails.mapelCount} Mapel</span>
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
                      {currentDetails.mapelList.length === 0 ? (
                        <tr><td colSpan="7" className="py-4 text-center text-[12px] text-gray-500">Belum ada nilai yang diinput.</td></tr>
                      ) : currentDetails.mapelList.map((m, i) => (
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
                         <circle cx="60" cy="60" r="56" fill="transparent" stroke="#22c55e" strokeWidth="8" strokeDasharray="351.85" strokeDashoffset={351.85 - (351.85 * currentDetails.absensi.persenHadir) / 100} />
                       </svg>
                       <div className="text-center">
                         <span className="text-[24px] font-black text-green-600">{currentDetails.absensi.persenHadir}%</span>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Kehadiran</p>
                       </div>
                     </div>
                   </div>
                   <div className="grid grid-cols-4 gap-3 text-center">
                     <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Hadir</p>
                       <p className="text-[16px] font-black text-green-700">{currentDetails.absensi.hadir}</p>
                     </div>
                     <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Izin</p>
                       <p className="text-[16px] font-black text-amber-700">{currentDetails.absensi.izin}</p>
                     </div>
                     <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Sakit</p>
                       <p className="text-[16px] font-black text-blue-700">{currentDetails.absensi.sakit}</p>
                     </div>
                     <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                       <p className="text-[11px] font-bold text-gray-500 mb-1">Alpa</p>
                       <p className="text-[16px] font-black text-red-700">{currentDetails.absensi.alpa}</p>
                     </div>
                   </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  {currentDetails.catatan ? (
                    <p className="text-[15px] text-gray-800 font-semibold italic leading-relaxed">"{currentDetails.catatan}"</p>
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
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50 rounded-t-2xl">
            <h2 className="text-[15px] font-bold text-gray-800">Daftar Siswa</h2>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedStudent(null);
                setShowPreview(false);
              }}
              className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold rounded-lg focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2 outline-none cursor-pointer"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.nama_kelas}</option>
              ))}
            </select>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {studentsData.map(s => {
              const statusRapor = getStudentStatusRapor(s.id);
              const avatarBg = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-purple-500", "bg-indigo-500"][s.id.charCodeAt(0) % 6] || "bg-[#1A3D63]";
              return (
                <button 
                  key={s.id}
                  onClick={() => { setSelectedStudent(s); setShowPreview(false); }}
                  className={`w-full text-left p-3.5 rounded-xl transition-colors border flex items-center justify-between ${selectedStudent?.id === s.id ? 'bg-[#1A3D63] text-white shadow-md' : 'bg-white hover:bg-gray-50 border-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${selectedStudent?.id === s.id ? 'bg-white/20' : avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
                      {s.nama_lengkap[0]}
                    </div>
                    <div>
                      <h3 className={`text-[13px] font-bold ${selectedStudent?.id === s.id ? 'text-white' : 'text-gray-800'}`}>{s.nama_lengkap}</h3>
                      <p className={`text-[11px] ${selectedStudent?.id === s.id ? 'text-blue-200' : 'text-gray-400'}`}>NIS: {s.nis || "-"}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${statusRapor === "Terbit" ? (selectedStudent?.id === s.id ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600') : (selectedStudent?.id === s.id ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500')}`}>
                    {statusRapor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Action Area */}
        <div className="lg:col-span-7 flex flex-col h-[600px]">
          {selectedStudent && currentDetails ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden animate-fadeIn">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#1F3A5F]">Detail Pemeriksaan Rapor</h2>
                  <p className="text-[13px] text-gray-500 mt-1">{selectedStudent.nama_lengkap}</p>
                </div>
                {currentDetails.statusRapor === "Terbit" && (
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
                        <span className={`text-[11px] font-bold ${currentDetails.mapelCount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {currentDetails.mapelCount} Mapel
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${currentDetails.mapelCount > 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${Math.min((currentDetails.mapelCount/12)*100, 100)}%`}}></div></div>
                    </button>
                    
                    <button onClick={() => setActiveDetailModal('absensi')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                          Absensi
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                        </span>
                        <span className="text-[11px] font-bold text-green-600">{currentDetails.absensi.persenHadir}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: `${currentDetails.absensi.persenHadir}%`}}></div></div>
                    </button>

                    <button onClick={() => setActiveDetailModal('catatan')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                          Catatan Wali
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                        </span>
                        <span className={`text-[11px] font-bold ${currentDetails.catatan ? 'text-green-600' : 'text-red-500'}`}>
                          {currentDetails.catatan ? "Sudah Diisi" : "Belum Diisi"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${currentDetails.catatan ? 'bg-green-500' : 'bg-red-500'}`} style={{width: currentDetails.catatan ? '100%' : '0%'}}></div></div>
                    </button>
                  </div>
                </div>

                {(!currentDetails.catatan || currentDetails.mapelCount === 0) && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[13px] font-bold flex gap-2 items-start">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Data belum lengkap! Harap hubungi Guru Mapel terkait atau isi catatan wali kelas terlebih dahulu sebelum dapat menerbitkan rapor.
                  </div>
                )}

                {showPreview && (
                  <div id="rapor-preview-container" className="bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-sm p-8 text-left animate-fadeIn font-serif text-sm relative mt-4 mx-2">
                    <div className="absolute top-6 right-6 border-2 border-red-500 text-red-500 font-bold px-3 py-1 transform rotate-12 opacity-30 text-[12px] tracking-widest uppercase">
                      Preview Draft
                    </div>
                    <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
                      <h3 className="text-[18px] font-bold text-gray-900 uppercase tracking-widest">Laporan Hasil Belajar</h3>
                      <p className="text-gray-600 mt-1">Semester {activeSemester?.tipe} Tahun Ajaran {activeSemester?.tahun_ajaran}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-800 text-[12px]">
                      <div>
                        <table className="w-full">
                          <tbody>
                            <tr><td className="w-24 pb-1">Nama Siswa</td><td className="w-4 pb-1">:</td><td className="font-bold pb-1 uppercase">{selectedStudent.nama_lengkap}</td></tr>
                            <tr><td className="pb-1">NISN / NIS</td><td className="pb-1">:</td><td className="pb-1">{selectedStudent.nisn || "-"} / {selectedStudent.nis || "-"}</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <table className="w-full">
                          <tbody>
                            <tr><td className="w-24 pb-1">Kelas</td><td className="w-4 pb-1">:</td><td className="pb-1">{classes.find(c => c.id === selectedClassId)?.nama_kelas}</td></tr>
                            <tr><td className="pb-1">Fase</td><td className="pb-1">:</td><td className="pb-1">D (SMP)</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-5">
                      <h4 className="font-bold text-gray-800 border-b border-gray-400 pb-1 mb-2">A. Sikap</h4>
                      <div className="p-2 text-[12px] leading-relaxed text-gray-700 bg-gray-50 border border-gray-100">
                         <strong>Deskripsi:</strong> {selectedStudent.nama_lengkap} menunjukkan sikap spiritual dan sosial yang {currentDetails.absensi.persenHadir >= 90 ? 'sangat baik' : 'baik'} dalam mengikuti pembelajaran, menjunjung tinggi nilai gotong royong, dan berinteraksi secara sopan di lingkungan sekolah.
                      </div>
                    </div>

                    <div className="mb-5">
                      <h4 className="font-bold text-gray-800 border-b border-gray-400 pb-1 mb-2">B. Pengetahuan & Keterampilan</h4>
                      <table className="w-full border-collapse border border-gray-300 text-[12px]">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 py-1.5 px-2 text-center w-10">No</th>
                            <th className="border border-gray-300 py-1.5 px-2 text-left">Mata Pelajaran</th>
                            <th className="border border-gray-300 py-1.5 px-2 text-center w-16">Nilai</th>
                            <th className="border border-gray-300 py-1.5 px-2 text-center w-24">Predikat</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentDetails.mapelList.map((m, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="border border-gray-300 py-1.5 px-2 text-center text-gray-500">{i+1}</td>
                              <td className="border border-gray-300 py-1.5 px-2 font-medium">{m.mapel}</td>
                              <td className="border border-gray-300 py-1.5 px-2 text-center font-bold">{m.nilai}</td>
                              <td className="border border-gray-300 py-1.5 px-2 text-center">{m.predikat}</td>
                            </tr>
                          ))}
                          {currentDetails.mapelList.length === 0 && (
                            <tr><td colSpan="4" className="border border-gray-300 py-2 text-center text-gray-500">Belum ada nilai.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-800 border-b border-gray-400 pb-1 mb-2">C. Ketidakhadiran</h4>
                        <table className="w-full border-collapse border border-gray-300 text-[12px]">
                          <tbody>
                            <tr><td className="border border-gray-300 py-1.5 px-3 w-32 bg-gray-50">Sakit</td><td className="border border-gray-300 py-1.5 px-2 text-center">{currentDetails.absensi.sakit} hari</td></tr>
                            <tr><td className="border border-gray-300 py-1.5 px-3 bg-gray-50">Izin</td><td className="border border-gray-300 py-1.5 px-2 text-center">{currentDetails.absensi.izin} hari</td></tr>
                            <tr><td className="border border-gray-300 py-1.5 px-3 bg-gray-50">Tanpa Keterangan</td><td className="border border-gray-300 py-1.5 px-2 text-center">{currentDetails.absensi.alpa} hari</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 border-b border-gray-400 pb-1 mb-2">D. Catatan Wali Kelas</h4>
                        <div className="border border-gray-300 bg-gray-50 p-3 text-[12px] min-h-[90px] italic leading-relaxed text-gray-700">
                          "{currentDetails.catatan}"
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
                {!showPreview ? (
                  <button 
                    onClick={() => setShowPreview(true)}
                    disabled={!currentDetails.catatan || currentDetails.mapelCount === 0}
                    className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${currentDetails.catatan && currentDetails.mapelCount > 0 ? 'bg-[#1A3D63] text-white hover:bg-[#15304f]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    Generate Rapor
                  </button>
                ) : (
                  <>
                    <button onClick={() => setShowPreview(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all">Batal</button>
                    {currentDetails.statusRapor !== "Terbit" && (
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
                        ) : "Simpan & Terbitkan Kelas"}
                      </button>
                    )}
                    <button 
                      onClick={handleDownloadPDF} 
                      disabled={downloading}
                      className="px-6 py-2.5 bg-[#1A3D63] hover:bg-[#15304f] text-white rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                      {downloading ? (
                        <>
                           <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                           Menyiapkan PDF...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Download PDF
                        </>
                      )}
                    </button>
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
