import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getOperasional } from "../../api/finance";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

// Icons
const InfoIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const WakilKepalaSarpras = ({ user }) => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('wakil_sarpras_tab');
    if (savedTab) {
      localStorage.removeItem('wakil_sarpras_tab');
      return savedTab;
    }
    return "anggaran";
  });
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  
  // State for Laporan
  const [laporanPeriode, setLaporanPeriode] = useState("2025/2026");
  const [showLaporanModal, setShowLaporanModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [pemasukanData, setPemasukanData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOperasional();
        if (Array.isArray(data)) {
          // Sarpras hanya mencatat pengeluaran operasional (bukan Gaji Pegawai)
          setPengeluaranData(data.filter(d => d.tipe === 'pengeluaran' && d.kategori !== 'Gaji Pegawai'));
          setPemasukanData(data.filter(d => d.tipe === 'pemasukan'));
        }
      } catch (err) {
        console.error("Gagal memuat data operasional:", err);
      }
    };
    fetchData();
  }, []);
  
  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleCetakLaporan = async () => {
    setIsGeneratingPdf(true);
    
    // Simple toast mock
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg z-50 text-sm font-medium';
    toast.textContent = 'Membuat dokumen laporan PDF...';
    document.body.appendChild(toast);

    try {
      const element = document.getElementById("pdf-report-sarpras-template");
      if (!element) throw new Error("Template laporan tidak ditemukan.");
      
      const imgData = await htmlToImage.toPng(element, { quality: 1, backgroundColor: "#ffffff", pixelRatio: 2 });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`Laporan_Penggunaan_Anggaran_Sarpras_${laporanPeriode.replace(/\//g, "-")}.pdf`);
      
      toast.style.backgroundColor = '#10B981';
      toast.textContent = 'Laporan PDF berhasil diunduh!';
      
    } catch (e) {
      console.error(e);
      toast.style.backgroundColor = '#EF4444';
      toast.textContent = 'Gagal mengunduh laporan PDF';
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => document.body.removeChild(toast), 3000);
    }
  };

  // Data Anggaran dari Total Pemasukan Bendahara
  const totalDanaBOS = pemasukanData.filter(d => d.kategori === 'Dana BOS').reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const TOTAL_ANGGARAN = totalDanaBOS * 0.7; // 70% of Dana BOS goes to Sarpras, 30% to gaji
  const REALISASI = pengeluaranData.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const SISA_ANGGARAN = Math.max(0, TOTAL_ANGGARAN - REALISASI);
  
  const chartData = [
    { name: "Realisasi", value: REALISASI, color: "#1F3A5F" },
    { name: "Sisa Anggaran", value: SISA_ANGGARAN, color: "#F59E0B" }
  ];

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3">
          <p className="text-xs font-bold text-gray-500 mb-1">{payload[0].name}</p>
          <p className="text-sm font-bold text-[#1F3A5F]">
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F5F7FA] min-h-full font-sans">
      <div>
        <h1 className="text-[28px] font-bold text-[#1F3A5F] tracking-tight">Sarana & Prasarana</h1>
        <p className="text-[14px] text-gray-500 mt-1">Monitoring anggaran, riwayat pengeluaran, dan pelaporan operasional Sarpras.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-fit">
        {[
          { id: "anggaran", label: "Anggaran" },
          { id: "pengeluaran", label: "Pengeluaran" },
          { id: "laporan", label: "Laporan" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all border-none cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-[#1F3A5F] shadow-sm"
                : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: ANGGARAN */}
      {activeTab === "anggaran" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-50 border-l-4 border-l-[#1F3A5F]">
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Anggaran Sarpras</h3>
              <p className="text-[32px] font-black text-[#1F3A5F] tracking-tight">{formatRupiah(TOTAL_ANGGARAN)}</p>
              <p className="text-[12px] text-gray-500 mt-1">Tahun Ajaran 2025/2026</p>
            </div>
            <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-50 border-l-4 border-l-[#1F3A5F]">
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Realisasi Penggunaan</h3>
              <p className="text-[32px] font-black text-[#1F3A5F] tracking-tight">{formatRupiah(REALISASI)}</p>
              <p className="text-[12px] text-gray-500 mt-1">{TOTAL_ANGGARAN > 0 ? ((REALISASI / TOTAL_ANGGARAN) * 100).toFixed(1) : 0}% dari anggaran</p>
            </div>
            <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-50 border-l-4 border-l-[#F59E0B]">
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sisa Anggaran</h3>
              <p className="text-[32px] font-black text-[#1F3A5F] tracking-tight">{formatRupiah(SISA_ANGGARAN)}</p>
              <p className="text-[12px] text-gray-500 mt-1">Status: Aman</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 p-6">
              <h2 className="text-[16px] font-bold text-[#1F3A5F] mb-6">Proporsi Anggaran</h2>
              <div className="h-[250px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-[#1F3A5F]">{TOTAL_ANGGARAN > 0 ? ((REALISASI / TOTAL_ANGGARAN) * 100).toFixed(0) : 0}%</span>
                  <span className="text-[10px] font-bold text-gray-400">Terpakai</span>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {chartData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-[12px] font-bold text-gray-600">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 p-6">
              <h2 className="text-[16px] font-bold text-[#1F3A5F] mb-4">Informasi Anggaran</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5"><InfoIcon /></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">Pagu anggaran Sarpras ditetapkan sebesar <span className="font-bold text-gray-800">{formatRupiah(TOTAL_ANGGARAN)}</span> untuk tahun ajaran ini (berasal dari 70% total Dana BOS).</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5"><InfoIcon /></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">Penggunaan anggaran saat ini masih berada dalam batas toleransi (<span className="font-bold text-gray-800">di bawah 50%</span> pada semester ganjil).</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5"><InfoIcon /></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">Semua pengeluaran yang tercatat sudah diverifikasi dan divalidasi oleh Bendahara Sekolah.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: PENGELUARAN */}
      {activeTab === "pengeluaran" && (
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 overflow-hidden animate-fadeIn">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#1F3A5F]">Riwayat Pengeluaran Sarpras</h2>
            <div className="flex gap-2">
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-600 focus:outline-none focus:border-[#1F3A5F] bg-white cursor-pointer">
                <option>Semua Kategori</option>
                <option>Perawatan Gedung</option>
                <option>ATK</option>
                <option>Listrik</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Keterangan Pengeluaran</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nominal</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pengeluaranData.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">{(tx.tanggal.includes('T') || tx.tanggal.includes('-')) ? formatTanggal(tx.tanggal) : tx.tanggal}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-[13px] font-bold text-gray-800">{tx.nama}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{tx.keterangan || "Tidak ada rincian"}</p>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium text-[11px]">
                        {tx.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-[#1F3A5F] whitespace-nowrap">{formatRupiah(tx.nominal)}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => setSelectedDetailItem(tx)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1F3A5F] rounded-lg text-[11px] font-bold transition-colors border-none cursor-pointer">
                        <EyeIcon /> Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {pengeluaranData.length === 0 && (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-500">Belum ada pengeluaran terbaru.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: LAPORAN */}
      {activeTab === "laporan" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* Laporan Penggunaan Anggaran */}
          <div className="bg-[#1F3A5F] rounded-[16px] shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full -ml-8 -mb-8" />
            <div className="relative z-10">
              <h2 className="text-[16px] font-bold mb-1">Laporan Penggunaan Anggaran</h2>
              <p className="text-[12px] text-blue-200 mb-5">Rekapitulasi total pengeluaran vs anggaran Sarpras.</p>
              <div className="space-y-3">
                <select 
                  value={laporanPeriode}
                  onChange={(e) => setLaporanPeriode(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                >
                  <option className="text-gray-800" value="2025/2026">Tahun Ajaran 2025/2026</option>
                  <option className="text-gray-800" value="2024/2025">Tahun Ajaran 2024/2025</option>
                </select>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowLaporanModal(true)}
                    className="flex-1 bg-white hover:bg-gray-100 text-[#1F3A5F] px-4 py-2.5 rounded-xl text-[12px] font-bold transition-colors border-none cursor-pointer"
                  >
                    Lihat Laporan
                  </button>
                  <button 
                    onClick={handleCetakLaporan}
                    disabled={isGeneratingPdf}
                    className={`flex items-center justify-center bg-[#F59E0B] hover:bg-[#d97706] text-white px-4 py-2.5 rounded-xl text-[12px] font-bold transition-colors gap-2 border-none cursor-pointer ${isGeneratingPdf ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <DownloadIcon /> {isGeneratingPdf ? "Memproses..." : "PDF"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Pengeluaran */}
      {selectedDetailItem && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Detail Pengeluaran</h2>
                <p className="text-[11px] text-gray-500 mt-1">Informasi lengkap transaksi arus kas.</p>
              </div>
              <button 
                onClick={() => setSelectedDetailItem(null)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-xl transition-colors border border-gray-200 cursor-pointer"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tanggal</div>
                  <div className="text-sm font-semibold text-gray-800">{(selectedDetailItem.tanggal.includes('T') || selectedDetailItem.tanggal.includes('-')) ? formatTanggal(selectedDetailItem.tanggal) : selectedDetailItem.tanggal}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Kategori</div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">{selectedDetailItem.kategori}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Pengeluaran</div>
                <div className="text-sm font-bold text-gray-800">{selectedDetailItem.nama}</div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nominal</div>
                  <div className="text-lg font-black text-emerald-600">{formatRupiah(selectedDetailItem.nominal)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sumber Dana</div>
                  <div className="text-sm font-semibold text-gray-700">{selectedDetailItem.sumberDana || "-"}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Bukti Transaksi</div>
                {selectedDetailItem.bukti && selectedDetailItem.bukti.length > 0 ? (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {selectedDetailItem.bukti.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div 
                          className="w-10 h-10 rounded-lg bg-white text-blue-600 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer border border-gray-200 hover:opacity-80 transition-opacity shadow-sm"
                          onClick={() => {
                            setSelectedPreviewFile(file);
                            setShowPreviewModal(true);
                          }}
                          title="Klik untuk melihat pratinjau penuh"
                        >
                          {file.match(/\.(jpg|jpeg|png|gif)$/i) || file.startsWith('data:image') ? (
                            <img src={file} alt="Thumbnail" className="w-full h-full object-cover" />
                          ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-800 truncate">{file.startsWith('data:') ? 'Bukti Transaksi' : file}</div>
                          <div className="text-[10px] text-gray-500">Klik ikon gambar untuk melihat lampiran</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">Tidak ada bukti transaksi yang dilampirkan.</div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Keterangan</div>
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                  {selectedDetailItem.keterangan || "Tidak ada keterangan."}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <button 
                onClick={() => setSelectedDetailItem(null)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer border-none"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Modal Preview Bukti Transaksi */}
      {showPreviewModal && selectedPreviewFile && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 truncate max-w-[200px] sm:max-w-[300px]">
                    {typeof selectedPreviewFile === 'string' 
                      ? (selectedPreviewFile.startsWith('data:') ? 'Bukti Transaksi' : selectedPreviewFile) 
                      : selectedPreviewFile?.name}
                  </h3>
                  <p className="text-[10px] text-gray-500">Pratinjau Dokumen</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedPreviewFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-xl transition-colors border border-gray-200 cursor-pointer shrink-0"
              >
                <IconX />
              </button>
            </div>
            
            <div className="bg-gray-100 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
              {selectedPreviewFile && typeof selectedPreviewFile !== 'string' && selectedPreviewFile.type?.includes('image') ? (
                <img src={selectedPreviewFile.preview || URL.createObjectURL(selectedPreviewFile)} alt="Preview Bukti" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
              ) : selectedPreviewFile && typeof selectedPreviewFile === 'string' && (selectedPreviewFile.match(/\.(jpg|jpeg|png|gif)$/i) || selectedPreviewFile.startsWith('data:image')) ? (
                <img src={selectedPreviewFile} alt="Preview Bukti" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
              ) : selectedPreviewFile && typeof selectedPreviewFile !== 'string' && selectedPreviewFile.type?.includes('pdf') ? (
                <object data={selectedPreviewFile.preview || URL.createObjectURL(selectedPreviewFile)} type="application/pdf" className="w-full h-[70vh] rounded-lg shadow-sm">
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-gray-500 text-sm font-medium">Browser Anda mungkin tidak mendukung pratinjau langsung PDF.</p>
                    <a href={selectedPreviewFile.preview || URL.createObjectURL(selectedPreviewFile)} target="_blank" rel="noreferrer" className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">Unduh / Buka PDF di Tab Baru</a>
                  </div>
                </object>
              ) : selectedPreviewFile && typeof selectedPreviewFile === 'string' && (selectedPreviewFile.toLowerCase().includes('.pdf') || selectedPreviewFile.startsWith('data:application/pdf')) ? (
                <object data={selectedPreviewFile} type="application/pdf" className="w-full h-[70vh] rounded-lg shadow-sm">
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-gray-500 text-sm font-medium">Browser Anda mungkin tidak mendukung pratinjau langsung PDF.</p>
                    <a href={selectedPreviewFile} target="_blank" rel="noreferrer" className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">Unduh / Buka PDF di Tab Baru</a>
                  </div>
                </object>
              ) : (
                <>
                  <div className="w-24 h-24 mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-400 text-center max-w-[80%] break-words">Menampilkan Pratinjau: {typeof selectedPreviewFile === 'string' ? selectedPreviewFile : selectedPreviewFile?.name}</p>
                  <p className="text-xs text-gray-400 mt-2 text-center">Pratinjau khusus untuk file gambar (JPG/PNG). Dokumen PDF akan dapat dilihat saat diunduh.</p>
                </>
              )}
            </div>
          </div>
        </div>
      , document.body)}

      {/* Modal Preview Laporan — dirender via Portal ke document.body */}
      {showLaporanModal && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            display: 'flex',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Sticky Header — tidak terpotong */}
            <div
              style={{
                flexShrink: 0,
                borderBottom: '1px solid #F3F4F6',
                background: '#F9FAFB',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1F3A5F', margin: 0 }}>Pratinjau Laporan Penggunaan Anggaran</h3>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={handleCetakLaporan}
                  disabled={isGeneratingPdf}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', backgroundColor: isGeneratingPdf ? '#d97706' : '#F59E0B',
                    color: '#fff', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                    border: 'none', cursor: isGeneratingPdf ? 'not-allowed' : 'pointer',
                    opacity: isGeneratingPdf ? 0.6 : 1, whiteSpace: 'nowrap'
                  }}
                >
                  <DownloadIcon /> {isGeneratingPdf ? 'Memproses...' : 'Unduh PDF'}
                </button>
                <button
                  onClick={() => setShowLaporanModal(false)}
                  style={{
                    padding: '8px 16px', backgroundColor: '#E5E7EB',
                    color: '#374151', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Scrollable Preview Area */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
                background: '#F3F4F6',
                padding: '24px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }}
            >
              <div
                className="bg-white font-sans"
                style={{
                  width: '794px',
                  minWidth: '794px',
                  padding: '48px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E7EB'
                }}
              >
                {/* Header MBS */}
                <div className="flex items-center justify-between border-b-4 border-gray-800 pb-4 mb-8">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <img src="/Logo MBS Prambanan.png" alt="Logo MBS Prambanan" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center flex-1">
                    <h1 className="text-2xl font-bold uppercase tracking-widest">Muhammadiyah Boarding School (MBS) Prambanan</h1>
                    <p className="text-sm mt-1">Jl. Raya Piyungan - Prambanan Km 4.5, Sleman, DI Yogyakarta</p>
                    <p className="text-sm">Telp: (0274) 123456 | Email: info@mbsprambanan.sch.id</p>
                  </div>
                  <div className="w-32 h-32 invisible"></div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold uppercase underline">LAPORAN PENGGUNAAN ANGGARAN SARANA & PRASARANA</h2>
                  <p className="text-sm mt-1">Tahun Ajaran: {laporanPeriode}</p>
                </div>

                {/* Ringkasan */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="p-3 border border-gray-800 rounded">
                    <div className="text-xs font-bold uppercase mb-1">Total Anggaran</div>
                    <div className="text-lg font-black">{formatRupiah(TOTAL_ANGGARAN)}</div>
                  </div>
                  <div className="p-3 border border-gray-800 rounded">
                    <div className="text-xs font-bold uppercase mb-1">Total Realisasi</div>
                    <div className="text-lg font-black">{formatRupiah(REALISASI)}</div>
                  </div>
                  <div className="p-3 border border-gray-800 rounded">
                    <div className="text-xs font-bold uppercase mb-1">Sisa Anggaran</div>
                    <div className="text-lg font-black">{formatRupiah(SISA_ANGGARAN)}</div>
                  </div>
                </div>

                {/* Data Table */}
                <table className="w-full text-left border-collapse border border-gray-800 mb-12">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-10 text-center">No</th>
                      <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-24">Tanggal</th>
                      <th className="border border-gray-800 p-3 text-xs font-bold uppercase">Nama Pengeluaran</th>
                      <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-24">Kategori</th>
                      <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-32 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengeluaranData.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-800 p-3 text-xs text-center">{index + 1}</td>
                        <td className="border border-gray-800 p-3 text-xs">{(item.tanggal.includes('T') || item.tanggal.includes('-')) ? formatTanggal(item.tanggal) : item.tanggal}</td>
                        <td className="border border-gray-800 p-3 text-xs">{item.nama}</td>
                        <td className="border border-gray-800 p-3 text-xs">{item.kategori}</td>
                        <td className="border border-gray-800 p-3 text-xs text-right">{formatRupiah(item.nominal)}</td>
                      </tr>
                    ))}
                    {pengeluaranData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="border border-gray-800 p-4 text-center text-sm">Tidak ada transaksi.</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td colSpan="4" className="border border-gray-800 p-3 text-sm font-bold text-right">TOTAL REALISASI</td>
                      <td className="border border-gray-800 p-3 text-sm font-bold text-right">{formatRupiah(REALISASI)}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="flex justify-between mt-4 pb-12">
                  <div className="text-left w-48">
                    <p className="text-sm mb-1 invisible">Sleman, ........................</p>
                    <p className="text-sm mb-24">Kepala Sekolah</p>
                    <p className="text-sm font-bold underline">H. Wahyu Pratama, M.Pd.</p>
                    <p className="text-sm">NIP. 19750815 200012 1 002</p>
                  </div>
                  <div className="text-left w-48">
                    <p className="text-sm mb-1 invisible">Sleman, ........................</p>
                    <p className="text-sm mb-24">Wakil Kepala Bid. Sarpras</p>
                    <p className="text-sm font-bold underline">{user?.fullName || "Drs. Hendra Kurniawan"}</p>
                    <p className="text-sm">NIP. {user?.nip || "196905102000031005"}</p>
                  </div>
                  <div className="text-left w-48">
                    <p className="text-sm mb-1">Sleman, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p className="text-sm mb-24">Bendahara Sekolah</p>
                    <p className="text-sm font-bold underline">Siti Aminah</p>
                    <p className="text-sm">NIP. 19800101 200501 2 001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Template PDF Tersembunyi (Digunakan oleh html-to-image) */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div id="pdf-report-sarpras-template" className="bg-white p-12 text-gray-800 w-[794px] h-[1123px] flex flex-col font-sans">
          {/* Header MBS */}
          <div className="flex items-center justify-between border-b-4 border-gray-800 pb-4 mb-8">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="/Logo MBS Prambanan.png" alt="Logo MBS Prambanan" className="w-full h-full object-contain" />
            </div>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold uppercase tracking-widest">Muhammadiyah Boarding School (MBS) Prambanan</h1>
              <p className="text-sm mt-1">Jl. Raya Piyungan - Prambanan Km 4.5, Sleman, DI Yogyakarta</p>
              <p className="text-sm">Telp: (0274) 123456 | Email: info@mbsprambanan.sch.id</p>
            </div>
            <div className="w-32 h-32 invisible"></div>
          </div>
          
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold uppercase underline">LAPORAN PENGGUNAAN ANGGARAN SARANA & PRASARANA</h2>
            <p className="text-sm mt-1">Tahun Ajaran: {laporanPeriode}</p>
          </div>
          
          {/* Ringkasan */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="p-3 border border-gray-800 rounded">
              <div className="text-xs font-bold uppercase mb-1">Total Anggaran</div>
              <div className="text-lg font-black">{formatRupiah(TOTAL_ANGGARAN)}</div>
            </div>
            <div className="p-3 border border-gray-800 rounded">
              <div className="text-xs font-bold uppercase mb-1">Total Realisasi</div>
              <div className="text-lg font-black">{formatRupiah(REALISASI)}</div>
            </div>
            <div className="p-3 border border-gray-800 rounded">
              <div className="text-xs font-bold uppercase mb-1">Sisa Anggaran</div>
              <div className="text-lg font-black">{formatRupiah(SISA_ANGGARAN)}</div>
            </div>
          </div>

          {/* Data Table */}
          <table className="w-full text-left border-collapse border border-gray-800 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-10 text-center">No</th>
                <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-24">Tanggal</th>
                <th className="border border-gray-800 p-3 text-xs font-bold uppercase">Nama Pengeluaran</th>
                <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-24">Kategori</th>
                <th className="border border-gray-800 p-3 text-xs font-bold uppercase w-32 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {pengeluaranData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-800 p-3 text-xs text-center">{index + 1}</td>
                  <td className="border border-gray-800 p-3 text-xs">{(item.tanggal.includes('T') || item.tanggal.includes('-')) ? formatTanggal(item.tanggal) : item.tanggal}</td>
                  <td className="border border-gray-800 p-3 text-xs">{item.nama}</td>
                  <td className="border border-gray-800 p-3 text-xs">{item.kategori}</td>
                  <td className="border border-gray-800 p-3 text-xs text-right">{formatRupiah(item.nominal)}</td>
                </tr>
              ))}
              {pengeluaranData.length === 0 && (
                <tr>
                  <td colSpan="5" className="border border-gray-800 p-4 text-center text-sm">Tidak ada transaksi.</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td colSpan="4" className="border border-gray-800 p-3 text-sm font-bold text-right">TOTAL REALISASI</td>
                <td className="border border-gray-800 p-3 text-sm font-bold text-right">{formatRupiah(REALISASI)}</td>
              </tr>
            </tfoot>
          </table>
          
          {/* Signatures */}
          <div className="flex justify-between mt-4 pb-12">
            <div className="text-left w-48">
              <p className="text-sm mb-1 invisible">Sleman, ........................</p>
              <p className="text-sm mb-24">Kepala Sekolah</p>
              <p className="text-sm font-bold underline">H. Wahyu Pratama, M.Pd.</p>
              <p className="text-sm">NIP. 19750815 200012 1 002</p>
            </div>
            <div className="text-left w-48">
              <p className="text-sm mb-1 invisible">Sleman, ........................</p>
              <p className="text-sm mb-24">Wakil Kepala Bid. Sarpras</p>
              <p className="text-sm font-bold underline">{user?.fullName || "Drs. Hendra Kurniawan"}</p>
              <p className="text-sm">NIP. {user?.nip || "196905102000031005"}</p>
            </div>
            <div className="text-left w-48">
              <p className="text-sm mb-1">Sleman, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p className="text-sm mb-24">Bendahara Sekolah</p>
              <p className="text-sm font-bold underline">Siti Aminah</p>
              <p className="text-sm">NIP. 19800101 200501 2 001</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WakilKepalaSarpras;
