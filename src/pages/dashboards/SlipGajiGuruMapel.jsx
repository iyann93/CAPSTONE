import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const SlipGajiGuruMapel = ({ user, onNavigate, defaultData }) => {
  const [selectedPeriode, setSelectedPeriode] = useState(defaultData?.periode || "Mei 2026");
  const [isDownloading, setIsDownloading] = useState(false);
  const slipRef = useRef(null);

  const riwayatMap = {
    "Juli 2026": "01 Jul 2026",
    "Juni 2026": "01 Jun 2026",
    "Mei 2026": "01 Mei 2026",
    "April 2026": "01 Apr 2026",
    "Maret 2026": "01 Mar 2026",
  };

  const periodeOptions = Object.keys(riwayatMap);

  const salaryData = {
    periode: selectedPeriode,
    tanggalTransfer: defaultData?.tglBayar || riwayatMap[selectedPeriode] || "-",
    namaPegawai: user?.fullName || "Dra Sri Wahyuni",
    nip: user?.nip || "196503151990032004",
    jabatan: "Guru Mata Pelajaran",
    golongan: "III/b",
    unitKerja: "SMP MBS PRAMBANAN",
    rekening: "BRI — 00987 6543 2100",

    // Pendapatan
    gajiPokok: 3500000,
    tunjangan: [
      { nama: "Tunjangan Jabatan", nominal: 400000 },
      { nama: "Tunjangan Kehadiran", nominal: 350000 },
      { nama: "Tunjangan Transport", nominal: 250000 },
    ],

    // Potongan
    potongan: [
      { nama: "BPJS Kesehatan", nominal: 87500 },
      { nama: "BPJS Ketenagakerjaan", nominal: 52500 },
      { nama: "PPh 21", nominal: 154500 },
      { nama: "Koperasi", nominal: 100000 },
    ],
  };

  const totalTunjangan = salaryData.tunjangan.reduce((sum, item) => sum + item.nominal, 0);
  const totalPotongan = salaryData.potongan.reduce((sum, item) => sum + item.nominal, 0);
  const gajiBersih = salaryData.gajiPokok + totalTunjangan - totalPotongan;

  const fmt = (n) => "Rp " + n.toLocaleString("id-ID").replace(/,/g, ".");

  useEffect(() => {
    if (defaultData?.autoDownload && slipRef.current && !isDownloading) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [defaultData]);

  const handleDownloadPDF = async () => {
    if (!slipRef.current) return;

    try {
      setIsDownloading(true);

      const dataUrl = await toPng(slipRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        filter: (node) => {
          if (node.tagName === "DIV" && node.dataset && node.dataset.html2canvasIgnore) {
            return false;
          }
          return true;
        },
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const imgWidth = pdfWidth - margin * 2;
      const domWidth = slipRef.current.offsetWidth;
      const domHeight = slipRef.current.offsetHeight;
      const imgHeight = (domHeight * imgWidth) / domWidth;

      pdf.addImage(dataUrl, "PNG", margin, 15, imgWidth, imgHeight);
      pdf.save(`Slip Gaji ${salaryData.namaPegawai}_${salaryData.periode}.pdf`);
    } catch (error) {
      console.error("Gagal men-generate PDF:", error);
      alert(`Maaf, terjadi kesalahan saat mengunduh PDF: ${error.message || error}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {onNavigate && (
            <button
              onClick={() => onNavigate("Riwayat Terima Gaji")}
              className="text-[13px] text-blue-600 font-bold mb-3 flex items-center gap-1.5 hover:text-blue-800 transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Riwayat
            </button>
          )}
          <h1 className="text-[24px] font-bold text-[#1e293b]">Slip Gaji</h1>
          <p className="text-[14px] text-gray-500 mt-1">Lihat rincian slip gaji bulanan Anda.</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 mt-2">
        <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1.5 rounded-md text-[12px] font-bold tracking-wide">
          Sudah Transfer
        </span>
      </div>

      {/* Slip Card Container */}
      <div ref={slipRef} className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">

        {/* Top Dark Banner */}
        <div className="bg-[#1A365D] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-t-xl">
          <div>
            <p className="text-[11px] text-blue-200 uppercase tracking-widest font-bold mb-1">SLIP GAJI</p>
            <h2 className="text-[24px] font-bold">{salaryData.periode}</h2>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[12px] text-blue-200 mb-1">Ditransfer: {salaryData.tanggalTransfer}</p>
            <p className="text-[24px] font-bold tracking-wide">{fmt(gajiBersih)}</p>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="p-8 border-b border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">NIP</p>
              <p className="text-[14px] font-bold text-gray-800">{salaryData.nip}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">NAMA</p>
              <p className="text-[14px] font-bold text-gray-800">{salaryData.namaPegawai}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">JABATAN</p>
              <p className="text-[14px] font-bold text-gray-800">{salaryData.jabatan}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">GOLONGAN</p>
              <p className="text-[14px] font-bold text-gray-800">{salaryData.golongan}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">UNIT KERJA</p>
              <p className="text-[14px] font-bold text-gray-800">{salaryData.unitKerja}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">REKENING</p>
              <p className="text-[14px] font-bold text-gray-800">{salaryData.rekening}</p>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="p-8">

          {/* Gaji Pokok */}
          <div className="flex justify-between items-center pb-6">
            <span className="text-[14px] text-gray-600 font-medium">Gaji Pokok</span>
            <span className="text-[15px] font-bold text-gray-900">{fmt(salaryData.gajiPokok)}</span>
          </div>

          {/* Tunjangan */}
          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-[11px] font-bold text-[#059669] uppercase tracking-widest mb-4">TUNJANGAN</h4>
            <div className="space-y-3">
              {salaryData.tunjangan.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-500 font-medium">{item.nama}</span>
                  <span className="text-[#059669] font-semibold">+{fmt(item.nominal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-dotted border-gray-200">
              <span className="text-[13px] font-bold text-gray-800">Total Tunjangan</span>
              <span className="text-[14px] font-bold text-[#059669]">+{fmt(totalTunjangan)}</span>
            </div>
          </div>

          {/* Potongan */}
          <div className="pt-8 mt-2">
            <h4 className="text-[11px] font-bold text-[#DC2626] uppercase tracking-widest mb-4">POTONGAN</h4>
            <div className="space-y-3">
              {salaryData.potongan.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-500 font-medium">{item.nama}</span>
                  <span className="text-[#DC2626] font-semibold">-{fmt(item.nominal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-dotted border-gray-200 mb-2">
              <span className="text-[13px] font-bold text-gray-800">Total Potongan</span>
              <span className="text-[14px] font-bold text-[#DC2626]">-{fmt(totalPotongan)}</span>
            </div>
          </div>

        </div>

        {/* Gaji Bersih Summary */}
        <div className="bg-[#F0FDF4] border-t border-[#DCFCE7] p-6 flex justify-between items-center">
          <div>
            <p className="text-[13px] font-bold text-[#166534]">Gaji Bersih Diterima</p>
            <p className="text-[11px] text-[#22C55E] mt-0.5">Gaji Pokok + Tunjangan − Potongan</p>
          </div>
          <p className="text-[22px] font-bold text-[#166534]">{fmt(gajiBersih)}</p>
        </div>

        {/* Action Buttons */}
        <div data-html2canvas-ignore="true" className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`flex-1 bg-[#1A365D] hover:bg-[#122A44] text-white py-3 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${isDownloading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isDownloading ? (
              <span>Memproses PDF...</span>
            ) : (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlipGajiGuruMapel;



