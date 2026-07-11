import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getLogoRoundUrl, fetchImageAsBase64 } from "../../utils/logo";
import api from "../../api/axios";

const RaporSiswa = ({ user }) => {
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded] = useState([]);
  const [preview, setPreview] = useState(null);
  const [raporData, setRaporData] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentName = user?.anak?.nama || user?.nama || "Siswa";
  const studentId = user?.anak?.id || user?.userId;

  useEffect(() => {
    const fetchRapor = async () => {
      if (!studentId) { setLoading(false); return; }
      try {
        setLoading(true);
        const res = await api.get(`/rapor/siswa/${studentId}`).catch(() => ({ data: { data: [] } }));
        const data = res.data?.data || [];

        const mapped = data.map(r => ({
          id: r.id,
          siswaId: r.siswa_id,
          kelasId: r.kelas_id,
          semesterId: r.semester_id,
          semester: r.semester_nama || "—",
          tanggal: r.published_at ? new Date(r.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "—",
          status: r.is_published ? "Tersedia" : "Belum Tersedia",
          rataRata: r.rata_rata ? parseFloat(r.rata_rata).toFixed(1) : null,
          peringkat: r.peringkat || null,
          kelas: r.nama_kelas,
          keteranganWali: r.keterangan_wali || ""
        }));

        setRaporData(mapped);
      } catch (err) {
        console.error("Gagal mengambil data rapor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRapor();
  }, [studentId]);

  const studentClass = raporData.length > 0 ? raporData[0].kelas : (user?.anak?.kelas || "—");

  const handleDownload = async (rapor) => {
    if (rapor.status !== "Tersedia") return;
    setDownloading(rapor.id);
    try {
      // Fetch nilai dan catatan secara bersamaan
      const [nilaiRes, catatanRes] = await Promise.all([
        api.get(`/nilai/kelas/${rapor.kelasId}?semester_id=${rapor.semesterId}`)
          .catch(() => ({ data: { data: [] } })),
        api.get(`/catatan-siswa?siswa_id=${rapor.siswaId}`)
          .catch(() => ({ data: { data: [] } }))
      ]);
      const allNilai = nilaiRes.data?.data || [];
      const myNilai = allNilai.filter(n => n.siswa_id === rapor.siswaId || n.siswa_id === studentId);
      
      // Ambil catatan wali kelas terbaru (dari catatan-siswa, bukan dari rapor)
      const catatanArr = catatanRes.data?.data || [];
      const catatanObj = catatanArr.find(c => c.siswa_id === rapor.siswaId || c.siswa_id === studentId);
      const catatanWali = catatanObj?.isi_catatan || rapor.keteranganWali || "";

      // Build PDF
      const doc = new jsPDF();

      // Logo
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
      doc.text("Alamat: Jl. Raya Piyungan - Prambanan Km 4.5, Bokoharjo, Prambanan, Sleman, DI Yogyakarta 55572", 115, 30, { align: "center" });
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
      doc.text(`Semester ${rapor.semester}`, 105, 57, { align: "center" });

      // --- DATA SISWA ---
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text(`Nama Siswa    : ${studentName}`, 14, 66);
      doc.text(`Kelas         : ${rapor.kelas}`, 140, 66);
      doc.text(`Fase          : D (SMP)`, 140, 72);

      // A. Sikap
      doc.setFont("times", "bold");
      doc.text("A. Sikap", 14, 84);
      doc.setFont("times", "normal");
      const sikapText = `Deskripsi: ${studentName} menunjukkan sikap spiritual dan sosial yang baik dalam mengikuti pembelajaran, menjunjung tinggi nilai gotong royong, dan berinteraksi secara sopan di lingkungan sekolah.`;
      const splitSikap = doc.splitTextToSize(sikapText, 182);
      doc.text(splitSikap, 14, 90);

      // B. Pengetahuan & Keterampilan
      doc.setFont("times", "bold");
      doc.text("B. Pengetahuan & Keterampilan", 14, 108);

      const tableBody = myNilai.map((n, i) => {
        const akhir = n.nilai_akhir || (((n.nilai_harian || 0) * 0.3) + ((n.nilai_uts || 0) * 0.3) + ((n.nilai_uas || 0) * 0.4)).toFixed(0);
        const na = parseFloat(akhir);
        return [i + 1, n.nama_mapel || n.mapel_nama || "-", 75, na.toFixed(0)];
      });

      autoTable(doc, {
        startY: 112,
        head: [['No', 'Mata Pelajaran', 'KKM', 'Nilai']],
        body: tableBody.length > 0 ? tableBody : [['-', 'Belum ada nilai', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          2: { halign: 'center', cellWidth: 25 },
          3: { halign: 'center', cellWidth: 25 },
        },
        styles: { font: 'times', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0] }
      });

      const finalY = doc.lastAutoTable.finalY || 150;

      // C. Ketidakhadiran (placeholder)
      doc.setFont("times", "bold");
      doc.text("C. Ketidakhadiran", 14, finalY + 15);
      autoTable(doc, {
        startY: finalY + 20,
        body: [['Sakit', '0 hari'], ['Izin', '0 hari'], ['Tanpa Keterangan', '0 hari']],
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold', fillColor: [248, 248, 248] },
          1: { cellWidth: 40, halign: 'center' }
        },
        styles: { font: 'times', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0] },
        margin: { left: 14 }
      });

      // D. Catatan Wali Kelas
      const afterAbsenY = doc.lastAutoTable.finalY || (finalY + 50);
      doc.setFont("times", "bold");
      doc.text("D. Catatan Wali Kelas", 120, finalY + 15);
      doc.setFont("times", "italic");
      doc.setLineWidth(0.1);
      doc.rect(120, finalY + 18, 76, 25);
      const catatanText = catatanWali ? `"${catatanWali}"` : "(Belum ada catatan)";
      const splitCatatan = doc.splitTextToSize(catatanText, 72);
      doc.text(splitCatatan, 122, finalY + 24);

      doc.save(`rapor_${rapor.semester.replace(/\s/g, '_')}_${studentName.replace(/\s/g, '_')}.pdf`);
      setDownloaded(prev => [...prev, rapor.id]);
    } catch (err) {
      console.error("Gagal download PDF:", err);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Unduh Rapor</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Unduh Rapor Siswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">{studentName} · Kelas {studentClass} · Daftar rapor yang tersedia untuk diunduh</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
        <div>
          <p className="text-[13px] font-bold text-blue-800">Informasi Rapor</p>
          <p className="text-[13px] text-blue-600 mt-0.5">Rapor tersedia dalam format PDF. Unduh dan simpan sebagai arsip perkembangan belajar putra/putri Anda.</p>
        </div>
      </div>

      {/* Rapor List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 flex items-center justify-center bg-white rounded-2xl border border-gray-100">
             <div className="flex flex-col items-center gap-3 text-gray-500">
               <svg className="animate-spin h-8 w-8 text-[#1A3D63]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className="text-sm font-bold animate-pulse">Memuat data rapor...</span>
             </div>
          </div>
        ) : raporData.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
             </div>
             <p className="text-[14px] font-bold text-gray-500">Belum ada rapor yang tersedia</p>
             <p className="text-[13px] text-gray-400 mt-1">Rapor akan muncul setelah diterbitkan oleh Wali Kelas</p>
          </div>
        ) : raporData.map((rapor) => {
          const isAvailable = rapor.status === "Tersedia";
          const isDownloading = downloading === rapor.id;
          const isDownloaded = downloaded.includes(rapor.id);

          return (
            <div key={rapor.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isAvailable ? "border-gray-100 hover:shadow-md" : "border-gray-100 opacity-70"}`}>
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isAvailable ? "bg-[#1A3D63]" : "bg-gray-200"}`}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-[16px] font-bold text-gray-800">Rapor {rapor.semester}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isAvailable ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-500"}`}>
                      {rapor.status}
                    </span>
                    {isDownloaded && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        ✓ Sudah Diunduh
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[13px] text-gray-400 flex items-center gap-1">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      Tanggal Rilis: {rapor.tanggal}
                    </span>
                    {rapor.rataRata && (
                      <span className="text-[13px] text-gray-400 flex items-center gap-1">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        Rata-rata: <strong className="text-gray-700">{rapor.rataRata}</strong>
                      </span>
                    )}
                    {rapor.peringkat && (
                      <span className="text-[13px] text-gray-400 flex items-center gap-1">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                        Peringkat: <strong className="text-gray-700">#{rapor.peringkat}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAvailable && (
                    <button
                      onClick={() => setPreview(rapor)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Pratinjau
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(rapor)}
                    disabled={!isAvailable || isDownloading}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-colors ${
                      !isAvailable
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isDownloading
                        ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                        : isDownloaded
                        ? "bg-green-50 text-green-700 border border-green-100 hover:bg-green-100"
                        : "bg-[#1A3D63] text-white hover:bg-[#163256]"
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        Mengunduh...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        {isDownloaded ? "Unduh Ulang" : "Unduh PDF"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Pratinjau */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[560px] shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#1e293b]">Pratinjau Rapor — {preview.semester}</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src={getLogoRoundUrl()} alt="Logo" className="w-12 h-12" />
                  <div className="text-left">
                    <h4 className="text-[16px] font-bold text-gray-800">RAPOR AKADEMIK</h4>
                    <p className="text-[13px] text-gray-500">Semester {preview.semester}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Nama Siswa</p>
                    <p className="text-[13px] font-bold text-gray-800">{studentName}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Kelas</p>
                    <p className="text-[13px] font-bold text-gray-800">{studentClass}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Rata-rata Nilai</p>
                    <p className="text-[13px] font-bold text-green-600">{preview.rataRata || "—"}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Peringkat Kelas</p>
                    <p className="text-[13px] font-bold text-blue-600">{preview.peringkat ? `#${preview.peringkat}` : "—"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setPreview(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">
                Tutup
              </button>
              <button
                onClick={() => { handleDownload(preview); setPreview(null); }}
                className="flex-1 py-3 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaporSiswa;
