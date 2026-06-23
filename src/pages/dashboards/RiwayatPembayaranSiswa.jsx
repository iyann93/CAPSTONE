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

const RiwayatPembayaranSiswa = ({ onNavigate }) => {
  const [tagihan, setTagihan] = useState(() => {
    const saved = localStorage.getItem("orangtua_tagihan_v3");
    return saved ? JSON.parse(saved) : initTagihan;
  });
  const [filter, setFilter] = useState("Semua");
  const [detail, setDetail] = useState(null);

  const baseTagihan = tagihan.filter(t => t.status !== "Belum Lunas");
  const filtered = filter === "Semua" ? baseTagihan : baseTagihan.filter(t => t.status === filter);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Riwayat Pembayaran</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Riwayat Pembayaran</h1>
          <p className="text-[14px] text-gray-500 mt-1">Ahmad Fauzi · Kelas VIII A · Tahun Ajaran 2025/2026</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          {["Semua", "Menunggu", "Lunas"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${filter === f ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f === "Menunggu" ? "Proses Verifikasi" : f}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {["BULAN", "NOMINAL", "JATUH TEMPO", "TGL BAYAR", "STATUS", "DETAIL"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 text-[13px] font-semibold text-gray-800">{t.bulan}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-gray-700">{fmt(t.nominal)}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-500">{t.jatuhTempo}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-500">{t.tglBayar || "—"}</td>
                  <td className="px-5 py-4">
                    {t.status === "Lunas" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Lunas
                      </span>
                    ) : t.status === "Menunggu" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>Proses Verifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Belum Lunas
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDetail(t)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors" title="Lihat Detail">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#1e293b]">Detail Tagihan</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                ["Bulan", detail.bulan],
                ["Nominal SPP", fmt(detail.nominal)],
                ["Jatuh Tempo", detail.jatuhTempo],
                ["Tanggal Bayar", detail.tglBayar || "Belum dibayar"],
                ["Status", detail.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500">{k}</span>
                  <span className={`text-[13px] font-bold ${k === "Status" && detail.status === "Lunas" ? "text-green-600" : k === "Status" && detail.status === "Menunggu" ? "text-blue-600" : k === "Status" ? "text-amber-600" : "text-gray-800"}`}>{v === "Menunggu" ? "Proses Verifikasi" : v}</span>
                </div>
              ))}
            </div>
            
            {detail.bukti && (
              <div className="px-6 pb-4">
                <p className="text-[13px] text-gray-500 mb-2 font-bold">Bukti Pembayaran</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <img src={detail.bukti} alt="Bukti Pembayaran" className="w-full h-auto object-cover max-h-40" />
                </div>
              </div>
            )}

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setDetail(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">Tutup</button>
              {detail.status === "Belum Lunas" && (
                <button onClick={() => { setDetail(null); onNavigate("Tagihan SPP"); }} className="flex-1 py-3 bg-[#1A3D63] text-white rounded-xl font-bold hover:bg-[#163256]">Bayar Sekarang</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPembayaranSiswa;
