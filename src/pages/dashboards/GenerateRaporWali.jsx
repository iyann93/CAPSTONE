import React, { useState, useEffect, useMemo } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getLogoRoundUrl, fetchImageAsBase64 } from "../../utils/logo";

const GenerateRaporWali = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [activeSemester, setActiveSemester] = useState(null);

  const [studentsData, setStudentsData] = useState([]);
  const [nilaiData, setNilaiData] = useState([]);
  const [absensiData, setAbsensiData] = useState([]);
  const [catatanData, setCatatanData] = useState([]);
  const [raporData, setRaporData] = useState([]);
  const [totalMapel, setTotalMapel] = useState(0);
  const [filterOption, setFilterOption] = useState("Semua Siswa");
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });

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

        const active = (semRes.data?.data || []).find(s => s.is_aktif);
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
      const [siswaRes, nilaiRes, absRes, catRes, raporRes, jadwalRes] = await Promise.all([
        api.get(`/siswa?kelas_id=${selectedClassId}&limit=1000`),
        api.get(`/nilai/kelas/${selectedClassId}?semester_id=${activeSemester.id}`),
        api.get(`/absensi/rekap/semester?semester_id=${activeSemester.id}&kelas_id=${selectedClassId}`),
        api.get(`/catatan-siswa?limit=1000`),
        api.get(`/rapor/kelas/${selectedClassId}?semester_id=${activeSemester.id}`),
        api.get(`/jadwal-pelajaran?kelas_id=${selectedClassId}&semester_id=${activeSemester.id}&limit=1000`)
      ]);

      const jadwalData = jadwalRes.data?.data || [];
      const uniqueMapels = [...new Set(jadwalData.map(j => j.mata_pelajaran_id))].filter(Boolean);
      setTotalMapel(uniqueMapels.length);

      setStudentsData(siswaRes.data?.data || []);
      setNilaiData(nilaiRes.data?.data || []);
      setAbsensiData(absRes.data?.data || []);
      setCatatanData(catRes.data?.data || []);
      setRaporData(raporRes.data?.data || []);
    } catch (e) {
      console.error("Gagal mengambil data kelas DETAIL:", e.response?.data || e.message || e);
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

    const abs = absensiData.find(a => a.siswa_id === sId) || { total_hadir: 0, total_izin: 0, total_sakit: 0, total_alpha: 0 };
    const totalAbsensi = parseInt(abs.total_hadir) + parseInt(abs.total_izin) + parseInt(abs.total_sakit) + parseInt(abs.total_alpha);
    const persentaseHadir = totalAbsensi > 0 ? Math.round((parseInt(abs.total_hadir) / totalAbsensi) * 100) : 0;
    
    const catatan = catatanData.find(c => c.siswa_id === sId)?.isi_catatan || "";
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
      await api.post('/rapor/generate', {
        mode: 'siswa',
        siswaId: selectedStudent.id,
        kelasId: selectedClassId,
        semesterId: activeSemester.id,
        keteranganWali: currentDetails.catatan
      });
      await api.post('/rapor/publish', {
        kelasId: selectedClassId,
        semesterId: activeSemester.id,
        siswaId: selectedStudent.id
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

  const handleUnpublish = () => {
    if (!selectedStudent || !activeSemester) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Batalkan Terbitan Rapor?',
      message: `Yakin ingin membatalkan penerbitan rapor ${selectedStudent.nama_lengkap}? Orang tua/siswa tidak akan bisa mengakses rapor ini sementara waktu.`,
      type: 'warning',
      onConfirm: async () => {
        try {
          const { default: api } = await import('../../api/axios');
          await api.post('/rapor/unpublish', {
            siswaId: selectedStudent.id,
            semesterId: activeSemester.id
          });
          await fetchClassData();
          alert(`Rapor ${selectedStudent.nama_lengkap} berhasil dibatalkan penerbitannya.`);
        } catch (e) {
          console.error(e);
          alert("Gagal membatalkan penerbitan rapor.");
        }
      }
    });
  };

  const handleGenerateAll = () => {
    if (!selectedClassId || !activeSemester) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Generate Massal',
      message: 'Yakin ingin men-generate rapor seluruh siswa yang datanya lengkap di kelas ini?',
      type: 'info',
      onConfirm: async () => {
        setIsGeneratingAll(true);
        try {
          const { default: api } = await import('../../api/axios');
          await api.post('/rapor/generate', { mode: 'kelas', kelasId: selectedClassId, semesterId: activeSemester.id });
          await fetchClassData();
          alert("Rapor seluruh kelas berhasil digenerate!");
        } catch (e) {
          console.error(e);
          alert("Gagal men-generate rapor massal.");
        } finally {
          setIsGeneratingAll(false);
        }
      }
    });
  };

  const handleDownloadPDF = async () => {
    if (!selectedStudent || !currentDetails) return;
    setDownloading(true);
    try {
        const doc = new jsPDF();
        const base64Logo = await fetchImageAsBase64(getLogoRoundUrl());
        if (base64Logo) {
          doc.addImage(base64Logo, 'PNG', 15, 10, 24, 24);
        }
        
        // --- KOP SURAT ---
        doc.setFont("times", "bold");
        doc.setFontSize(10);
        doc.text("MAJELIS PENDIDIKAN DASAR DAN MENENGAH PDM KABUPATEN SLEMAN", 115, 14, { align: "center" });
        doc.text("PONDOK PESANTREN MODERN", 115, 19, { align: "center" });
        doc.setFontSize(12);
        doc.text("SMP MUHAMMADIYAH BOARDING SCHOOL (MBS) PRAMBANAN", 115, 25, { align: "center" });
        doc.setFontSize(8);
        doc.setFont("times", "normal");
        doc.text("NPSN: 20400000", 115, 30, { align: "center" });
        doc.text("Alamat: Jl. Raya Piyungan - Prambanan Km 4.5, Bokoharjo, Prambanan, Sleman, DI Yogyakarta 55572", 115, 34, { align: "center" });
        doc.text("Telp: (0274) 123456 | Email: info@mbsprambanan.sch.id | Website: mbsprambanan.sch.id", 115, 38, { align: "center" });
        
        // Garis Ganda
        doc.setLineWidth(1.0);
        doc.line(14, 42, 196, 42); // Garis tebal
        doc.setLineWidth(0.3);
        doc.line(14, 43.2, 196, 43.2); // Garis tipis bawahnya
        doc.setLineWidth(0.1); // Reset

        // --- JUDUL LAPORAN ---
        doc.setFont("times", "bold");
        doc.setFontSize(12);
        doc.text("LAPORAN HASIL BELAJAR", 105, 52, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Semester ${activeSemester?.tipe} Tahun Ajaran ${activeSemester?.tahun_ajaran}`, 105, 57, { align: "center" });
        
        // --- DATA SISWA ---
        doc.setFont("times", "normal");
        doc.text(`Nama Siswa    : ${selectedStudent.nama_lengkap}`, 14, 66);
        doc.text(`NISN / NIS    : ${selectedStudent.nisn || '-'} / ${selectedStudent.nis || '-'}`, 14, 72);
        const clsName = classes.find(c => c.id === selectedClassId)?.nama_kelas || "-";
        doc.text(`Kelas         : ${clsName}`, 140, 66);
        doc.text(`Fase          : D (SMP)`, 140, 72);
        
        // --- A. SIKAP ---
        doc.setFont("times", "bold");
        doc.text("A. Sikap", 14, 84);
        doc.setFont("times", "normal");
        const sikapText = `Deskripsi: ${selectedStudent.nama_lengkap} menunjukkan sikap spiritual dan sosial yang ${currentDetails.absensi.persenHadir >= 90 ? 'sangat baik' : 'baik'} dalam mengikuti pembelajaran.`;
        const splitSikap = doc.splitTextToSize(sikapText, 182);
        doc.text(splitSikap, 14, 90);
        
        // --- B. PENGETAHUAN ---
        doc.setFont("times", "bold");
        doc.text("B. Pengetahuan & Keterampilan", 14, 108);
        const tableBody = currentDetails.mapelList.map((m, i) => [i + 1, m.mapel, m.kkm, m.nilai]);
        autoTable(doc, {
            startY: 112,
            head: [['No', 'Mata Pelajaran', 'KKM', 'Nilai']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
            styles: { font: 'times', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0] }
        });
        const finalY = doc.lastAutoTable.finalY || 150;
        doc.setFont("times", "bold");
        doc.text("C. Ketidakhadiran", 14, finalY + 15);
        autoTable(doc, {
            startY: finalY + 20,
            body: [['Sakit', `${currentDetails.absensi.sakit} hari`], ['Izin', `${currentDetails.absensi.izin} hari`], ['Tanpa Keterangan', `${currentDetails.absensi.alpa} hari`]],
            theme: 'grid',
            tableWidth: 100,
            columnStyles: {
              0: { cellWidth: 60, fontStyle: 'bold', fillColor: [248, 248, 248] },
              1: { cellWidth: 40, halign: 'center' }
            },
            styles: { font: 'times', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0] },
            margin: { left: 14 }
        });
        doc.setFont("times", "bold");
        doc.text("D. Catatan Wali Kelas", 120, finalY + 15);
        doc.setFont("times", "italic");
        doc.setLineWidth(0.1);
        doc.rect(120, finalY + 18, 76, 25);
        doc.text(doc.splitTextToSize(`"${currentDetails.catatan}"`, 72), 122, finalY + 24);
        doc.save(`Rapor_${selectedStudent.nama_lengkap}_Semester_${activeSemester?.tipe || ''}.pdf`);
    } catch (err) {
        console.error(err);
        alert("Gagal membuat PDF.");
    } finally {
        setDownloading(false);
    }
  };

  const isStudentComplete = (sId) => {
    const sNilai = nilaiData.filter(n => n.siswa_id === sId);
    const hasAllMapel = totalMapel > 0 ? sNilai.length >= totalMapel : sNilai.length > 0;
    const abs = absensiData.find(a => a.siswa_id === sId);
    const hasAbsensi = abs && (parseInt(abs.total_hadir) + parseInt(abs.total_izin) + parseInt(abs.total_sakit) + parseInt(abs.total_alpha)) > 0;
    return hasAllMapel && hasAbsensi;
  };

  const filteredStudents = useMemo(() => {
    if (filterOption === "Semua Siswa") return studentsData;
    if (filterOption === "Data Lengkap") return studentsData.filter(s => isStudentComplete(s.id));
    return studentsData.filter(s => !isStudentComplete(s.id));
  }, [studentsData, filterOption, nilaiData, absensiData, totalMapel]);

  const canGenerateAll = studentsData.length > 0 && studentsData.every(s => isStudentComplete(s.id));

  const getStudentStatusRapor = (sId) => {
    const r = raporData.find(x => x.siswa_id === sId);
    return r?.is_published ? "Terbit" : "Belum Terbit";
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-screen">
      {activeDetailModal && selectedStudent && currentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[650px] shadow-xl flex flex-col overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center bg-[#1F3A5F] text-white">
              <h3 className="text-[16px] font-bold">{activeDetailModal === 'mapel' ? `Detail Nilai - ${selectedStudent.nama_lengkap}` : 'Detail Lainnya'}</h3>
              <button onClick={() => setActiveDetailModal(null)} className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeDetailModal === 'mapel' && (
                <table className="w-full border-collapse">
                  <thead><tr className="bg-gray-50 border-y border-gray-200"><th className="py-2 px-3 text-left text-[11px] font-bold text-gray-500">MATA PELAJARAN</th><th className="py-2 text-center text-[10px] font-bold text-gray-500">KKM</th><th className="py-2 text-center text-[10px] font-bold text-gray-500">AKHIR</th></tr></thead>
                  <tbody>{currentDetails.mapelList.map((m, i) => (<tr key={i} className="border-b"><td className="py-3 px-3 text-[12px]">{m.mapel}</td><td className="py-3 text-center text-[11px]">{m.kkm}</td><td className="py-3 text-center text-[12px] font-bold">{m.nilai}</td></tr>))}</tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Rapor Siswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">Kelola, periksa kelengkapan, dan terbitkan rapor akademik.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span className="text-[13px] font-bold text-gray-600">Semester {activeSemester?.tipe || "Aktif"}</span>
        </div>
        <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold rounded-lg p-2 outline-none cursor-pointer hover:bg-gray-50">
          {classes.map(cls => <option key={cls.id} value={cls.id}>Kelas {cls.nama_kelas}</option>)}
        </select>
        <button onClick={handleGenerateAll} disabled={!canGenerateAll || isGeneratingAll} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${canGenerateAll ? 'bg-[#1A3D63] text-white hover:bg-[#122a47]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {isGeneratingAll ? "..." : "Generate Massal"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between">
            <h2 className="text-[16px] font-bold text-gray-800">Daftar Siswa</h2>
            <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)} className="bg-white border border-gray-200 text-gray-600 text-[12px] font-bold rounded-lg p-1.5 outline-none cursor-pointer">
              <option>Semua Siswa</option>
              <option>Data Lengkap</option>
              <option>Data Belum Lengkap</option>
            </select>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {filteredStudents.map(student => {
              const sId = student.id;
              const statusRapor = getStudentStatusRapor(sId);
              const avatarBg = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-purple-500", "bg-indigo-500"][sId.charCodeAt(0) % 6] || "bg-[#1A3D63]";
              return (
                <div key={sId} onClick={() => setSelectedStudent(student)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedStudent?.id === sId ? 'bg-[#1A3D63] text-white' : 'bg-white hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-sm`}>{student.nama_lengkap[0]}</div>
                    <div>
                      <h3 className="text-[13px] font-bold">{student.nama_lengkap}</h3>
                      <p className={`text-[11px] ${selectedStudent?.id === sId ? 'text-blue-200' : 'text-gray-400'}`}>NIS: {student.nis}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusRapor === 'Terbit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{statusRapor}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col h-[600px]">
          {selectedStudent && currentDetails ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#1F3A5F]">Detail Rapor</h2>
                  <p className="text-[13px] text-gray-500 mt-1">{selectedStudent.nama_lengkap}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!showPreview && (
                  <div className="space-y-4">
                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Kelengkapan Data</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
                      <button onClick={() => setActiveDetailModal('mapel')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                        <div className="flex flex-wrap items-center justify-between mb-2">
                          <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                            Nilai Mapel
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                          </span>
                          <span className={`text-[11px] font-bold ${currentDetails.mapelCount >= totalMapel && totalMapel > 0 ? 'text-green-600' : 'text-amber-500'}`}>
                            {currentDetails.mapelCount} / {totalMapel || '?'} Mapel
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${currentDetails.mapelCount >= totalMapel && totalMapel > 0 ? 'bg-green-500' : 'bg-amber-400'}`} style={{width: `${totalMapel > 0 ? Math.min((currentDetails.mapelCount/totalMapel)*100, 100) : 0}%`}}></div></div>
                      </button>
                      
                      <button onClick={() => setActiveDetailModal('absensi')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                        <div className="flex flex-wrap items-center justify-between mb-2">
                          <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                            Absensi
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                          </span>
                          <span className="text-[11px] font-bold text-green-600">{currentDetails.absensi.persenHadir}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: `${currentDetails.absensi.persenHadir}%`}}></div></div>
                      </button>

                      <button onClick={() => setActiveDetailModal('catatan')} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group">
                        <div className="flex flex-wrap items-center justify-between mb-2">
                          <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors flex items-center gap-1">
                            Catatan Wali
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                          </span>
                          <span className={`text-[11px] font-bold ${currentDetails.catatan ? 'text-green-600' : 'text-gray-400'}`}>
                            {currentDetails.catatan ? "Sudah Diisi" : "Belum Diisi (Opsional)"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${currentDetails.catatan ? 'bg-green-500 w-full' : 'bg-transparent'}`}></div></div>
                      </button>
                    </div>
                  </div>
                )}

                {!showPreview && !isStudentComplete(selectedStudent.id) && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[13px] font-bold flex gap-2 items-start">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Data belum lengkap! Harap periksa apakah semua nilai mata pelajaran atau data absensi sudah terisi.
                  </div>
                )}

                {showPreview && (
                  <div id="rapor-preview-container" className="bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-sm p-8 text-left animate-fadeIn font-serif text-sm relative mt-4 mx-2">
                    <div className="absolute top-6 right-6 border-2 border-red-500 text-red-500 font-bold px-3 py-1 transform rotate-12 opacity-30 text-[12px] tracking-widest uppercase">
                      Preview Draft
                    </div>
                    <div className="text-center mb-6 border-b-2 border-gray-800 pb-4 relative">
                      <img src={getLogoRoundUrl()} alt="Logo" className="absolute left-0 top-0 w-12 h-12" />
                      <h3 className="text-[18px] font-bold text-gray-900 uppercase tracking-widest">Laporan Hasil Belajar</h3>
                      <p className="text-gray-600 mt-1">Semester {activeSemester?.tipe} Tahun Ajaran {activeSemester?.tahun_ajaran}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-800 text-[12px]">
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
                            <th className="border border-gray-300 py-1.5 px-2 text-center w-16">KKM</th>
                            <th className="border border-gray-300 py-1.5 px-2 text-center w-24">Nilai</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentDetails.mapelList.map((m, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="border border-gray-300 py-1.5 px-2 text-center text-gray-500">{i+1}</td>
                              <td className="border border-gray-300 py-1.5 px-2 font-medium">{m.mapel}</td>
                              <td className="border border-gray-300 py-1.5 px-2 text-center">{m.kkm}</td>
                              <td className="border border-gray-300 py-1.5 px-2 text-center font-bold">{m.nilai}</td>
                            </tr>
                          ))}
                          {currentDetails.mapelList.length === 0 && (
                            <tr><td colSpan="4" className="border border-gray-300 py-2 text-center text-gray-500">Belum ada nilai.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="p-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50">
                <div>
                  {currentDetails.statusRapor === "Terbit" && (
                    <button
                      onClick={handleUnpublish}
                      className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[12px] font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                    >
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                      Batalkan Terbit
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                {!showPreview ? (
                  <button 
                    onClick={() => setShowPreview(true)}
                    disabled={!isStudentComplete(selectedStudent.id)}
                    className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${isStudentComplete(selectedStudent.id) ? 'bg-[#1A3D63] text-white hover:bg-[#15304f]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    title={isStudentComplete(selectedStudent.id) ? "" : "Data nilai mapel atau absensi belum lengkap"}
                  >
                    Generate Rapor Individu
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
                        ) : "Simpan & Terbitkan Siswa"}
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

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-zoomIn">
            <div className="p-6 text-center space-y-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${confirmDialog.type === 'danger' ? 'bg-red-50 text-red-500' : confirmDialog.type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-[#1A3D63] text-white'}`}>
                {confirmDialog.type === 'danger' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                ) : confirmDialog.type === 'warning' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                )}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900">{confirmDialog.title}</h3>
                <p className="text-[13px] text-gray-500 mt-2">{confirmDialog.message}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                Batal
              </button>
              <button 
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  setConfirmDialog({...confirmDialog, isOpen: false});
                }} 
                className={`flex-1 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-colors shadow-sm ${confirmDialog.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : confirmDialog.type === 'warning' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#1A3D63] hover:bg-[#0f2942]'}`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateRaporWali;
