import React, { useState } from "react";

const initTagihan = [
  { id: 1, bulan: "Januari 2026", nominal: 1250000, jatuhTempo: "10 Jan 2026", status: "Belum Lunas", denda: 0 },
  { id: 2, bulan: "Desember 2025", nominal: 1250000, jatuhTempo: "10 Des 2025", status: "Menunggu", tglBayar: "9 Des 2025", denda: 0, bukti: "https://via.placeholder.com/300x200?text=Bukti+Transfer" },
  { id: 3, bulan: "November 2025", nominal: 1250000, jatuhTempo: "10 Nov 2025", status: "Lunas", tglBayar: "7 Nov 2025", denda: 0, bukti: "https://via.placeholder.com/300x200?text=Bukti+Transfer" },
  { id: 4, bulan: "Oktober 2025", nominal: 1250000, jatuhTempo: "10 Okt 2025", status: "Lunas", tglBayar: "5 Okt 2025", denda: 0 },
  { id: 5, bulan: "September 2025", nominal: 1250000, jatuhTempo: "10 Sep 2025", status: "Lunas", tglBayar: "9 Sep 2025", denda: 0 },
  { id: 6, bulan: "Agustus 2025", nominal: 1250000, jatuhTempo: "10 Agu 2025", status: "Lunas", tglBayar: "8 Agu 2025", denda: 0 },
  { id: 7, bulan: "Juli 2025", nominal: 1250000, jatuhTempo: "10 Jul 2025", status: "Lunas", tglBayar: "5 Jul 2025", denda: 0 },
];

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

const TagihanSPP = ({ onNavigate }) => {
  const [tagihan, setTagihan] = useState(() => {
    const saved = localStorage.getItem("orangtua_tagihan_v3");
    return saved ? JSON.parse(saved) : initTagihan;
  });

  // States untuk Upload Bukti
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Silakan unggah bukti transfer terlebih dahulu.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Bukti pembayaran berhasil diunggah!");
      setFile(null);
    }, 2000);
  };

  const lunas = tagihan.filter(t => t.status === "Lunas").length;
  const belumLunas = tagihan.filter(t => t.status === "Belum Lunas").length;
  const totalLunas = tagihan.filter(t => t.status === "Lunas").reduce((a, c) => a + c.nominal, 0);
  const totalBelum = tagihan.filter(t => t.status === "Belum Lunas").reduce((a, c) => a + c.nominal, 0);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Tagihan SPP</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Tagihan SPP</h1>
          <p className="text-[14px] text-gray-500 mt-1">Ahmad Fauzi · Kelas VIII A · Tahun Ajaran 2025/2026</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Tagihan", val: fmt(totalBelum), sub: `${belumLunas} bulan belum dibayar` },
          { label: "Total Sudah Dibayar", val: fmt(totalLunas), sub: `Total keseluruhan dana` },
          { label: "Jatuh Tempo Terdekat", val: belumLunas > 0 ? tagihan.find(t => t.status === "Belum Lunas")?.jatuhTempo || "10 Jul 2025" : "Tidak ada tagihan", sub: "Segera lunasi sebelum tanggal ini", highlight: true },
        ].map((card, i) => (
          <div key={i} className={`rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all ${
            card.highlight ? "bg-red-50 border border-red-100 ring-1 ring-red-100" : "bg-white border border-gray-100"
          }`}>
            <div className="flex items-center gap-1.5 mb-2">
              {card.highlight && (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className={`text-[11px] font-bold uppercase tracking-wider ${card.highlight ? "text-red-600" : "text-gray-400"}`}>{card.label}</p>
            </div>
            <p className={`text-[26px] font-black leading-tight ${card.highlight ? "text-red-600" : "text-[#1e293b]"}`}>{card.val}</p>
            {card.sub && <p className={`text-[12px] mt-1 font-medium ${card.highlight ? "text-red-500" : "text-gray-500"}`}>{card.sub}</p>}
          </div>
        ))}
      </div>



      {/* Pembayaran Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info Rekening Bendahara */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-[16px] font-bold text-gray-800">Tujuan Pembayaran</h3>
          <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-bold text-[#1A3D63] text-lg shrink-0">
                BCA
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-gray-800">Bank Central Asia (BCA)</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">a/n MBS Prambanan</p>
                
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[22px] font-black text-[#1A3D63] tracking-wider">882145679901</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-100 text-[12px] text-gray-500">
              <strong className="text-gray-700">Instruksi:</strong> Silakan lakukan transfer ke nomor rekening di atas sejumlah tagihan, lalu unggah buktinya pada form bukti pembayaran.
            </div>
          </div>
        </div>

        {/* Upload Proof */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full space-y-4">
          <h3 className="text-[16px] font-bold text-gray-800">Unggah Bukti Pembayaran</h3>
          
          <div className="flex-1 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer transition-colors relative bg-gray-50/50">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-50 text-[#1A3D63] rounded-full flex items-center justify-center mx-auto">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-700">{file ? file.name : "Pilih File Bukti Bayar"}</p>
                <p className="text-[11px] text-gray-400 mt-1">Format JPG, PNG, atau PDF (Max 2MB)</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-3.5 text-[14px] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
              loading ? "bg-blue-100 text-blue-400 cursor-not-allowed" : !file ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Mengunggah Bukti..." : "Kirim Konfirmasi Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TagihanSPP;
