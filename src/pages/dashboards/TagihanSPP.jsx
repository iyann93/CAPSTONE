import React, { useState } from "react";

const initTagihan = [
  { id: 1, bulan: "Juli 2024", nominal: 500000, jatuhTempo: "10 Jul 2024", status: "Belum Lunas", denda: 0 },
  { id: 2, bulan: "Juni 2024", nominal: 500000, jatuhTempo: "10 Jun 2024", status: "Lunas", tglBayar: "8 Jun 2024", denda: 0 },
  { id: 3, bulan: "Mei 2024", nominal: 500000, jatuhTempo: "10 Mei 2024", status: "Lunas", tglBayar: "7 Mei 2024", denda: 0 },
  { id: 4, bulan: "April 2024", nominal: 500000, jatuhTempo: "10 Apr 2024", status: "Lunas", tglBayar: "5 Apr 2024", denda: 0 },
  { id: 5, bulan: "Maret 2024", nominal: 500000, jatuhTempo: "10 Mar 2024", status: "Lunas", tglBayar: "9 Mar 2024", denda: 0 },
  { id: 6, bulan: "Februari 2024", nominal: 500000, jatuhTempo: "10 Feb 2024", status: "Lunas", tglBayar: "8 Feb 2024", denda: 0 },
];

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

const TagihanSPP = ({ onNavigate }) => {
  const [tagihan, setTagihan] = useState(() => {
    const saved = localStorage.getItem("orangtua_tagihan");
    return saved ? JSON.parse(saved) : initTagihan;
  });
  const [filter, setFilter] = useState("Semua");
  const [detail, setDetail] = useState(null);

  const lunas = tagihan.filter(t => t.status === "Lunas").length;
  const belumLunas = tagihan.filter(t => t.status === "Belum Lunas").length;
  const totalLunas = tagihan.filter(t => t.status === "Lunas").reduce((a, c) => a + c.nominal, 0);
  const totalBelum = tagihan.filter(t => t.status === "Belum Lunas").reduce((a, c) => a + c.nominal, 0);

  const filtered = filter === "Semua" ? tagihan : tagihan.filter(t => t.status === filter);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Tagihan SPP</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Tagihan SPP</h1>
          <p className="text-[14px] text-gray-500 mt-1">Ahmad Fauzi · Kelas XI IPA 2 · Tahun Ajaran 2023/2024</p>
        </div>
        <button
          onClick={() => onNavigate("Bayar SPP")}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl text-[13px] font-bold shadow-sm transition-colors"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Bayar SPP
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tagihan", val: tagihan.length, sub: "bulan", color: "text-blue-200", valColor: "text-white" },
          { label: "Sudah Lunas", val: lunas, sub: fmt(totalLunas), color: "text-green-200", valColor: "text-green-300" },
          { label: "Belum Lunas", val: belumLunas, sub: fmt(totalBelum), color: "text-amber-200", valColor: "text-amber-300" },
          { label: "Nominal/Bulan", val: "Rp 500.000", sub: "Tetap per bulan", color: "text-purple-200", valColor: "text-purple-200" },
        ].map((card, i) => (
          <div key={i} className="bg-[#1A3D63] rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-2">{card.label}</p>
            <p className={`text-[26px] font-black leading-tight ${card.valColor}`}>{card.val}</p>
            <p className={`text-[12px] mt-1 ${card.color}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Tagihan Belum Lunas - Alert */}
      {belumLunas > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-amber-800">{belumLunas} tagihan belum lunas</p>
            <p className="text-[12px] text-amber-600 mt-0.5">Segera selesaikan pembayaran sebelum jatuh tempo untuk menghindari denda.</p>
          </div>
          <button onClick={() => onNavigate("Bayar SPP")} className="flex-shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[12px] font-bold transition-colors">
            Bayar
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          {["Semua", "Belum Lunas", "Lunas"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${filter === f ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f}</button>
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
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Belum Lunas
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDetail(t)} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50 transition-colors">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Detail
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
                  <span className={`text-[13px] font-bold ${k === "Status" && detail.status === "Lunas" ? "text-green-600" : k === "Status" ? "text-amber-600" : "text-gray-800"}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setDetail(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">Tutup</button>
              {detail.status !== "Lunas" && (
                <button onClick={() => { setDetail(null); onNavigate("Bayar SPP"); }} className="flex-1 py-3 bg-[#1A3D63] text-white rounded-xl font-bold hover:bg-[#163256]">Bayar Sekarang</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagihanSPP;
