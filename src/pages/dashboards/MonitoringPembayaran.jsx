import React, { useState } from "react";

const mockSiswa = [
  { id: 1, nama: "Ahmad Fauzi", nis: "2022001", kelas: "VIII-A", bulanTunggak: 2, nominal: 1000000, lastBayar: "Mei 2024", status: "Tunggak" },
  { id: 2, nama: "Budi Santosa", nis: "2022002", kelas: "VII-B", bulanTunggak: 1, nominal: 500000, lastBayar: "Jun 2024", status: "Tunggak" },
  { id: 3, nama: "Citra Lestari", nis: "2021003", kelas: "IX-A", bulanTunggak: 3, nominal: 1500000, lastBayar: "Apr 2024", status: "Tunggak" },
  { id: 4, nama: "Dewi Rahayu", nis: "2022004", kelas: "VIII-B", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 5, nama: "Eko Prasetyo", nis: "2022005", kelas: "VII-A", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 6, nama: "Fitri Handayani", nis: "2021006", kelas: "IX-B", bulanTunggak: 1, nominal: 500000, lastBayar: "Jun 2024", status: "Tunggak" },
  { id: 7, nama: "Galih Kusuma", nis: "2022007", kelas: "VIII-A", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 8, nama: "Hana Safitri", nis: "2021008", kelas: "IX-A", bulanTunggak: 2, nominal: 1000000, lastBayar: "Mei 2024", status: "Tunggak" },
  { id: 9, nama: "Irfan Maulana", nis: "2022009", kelas: "VII-B", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 10, nama: "Julia Pratiwi", nis: "2021010", kelas: "IX-B", bulanTunggak: 4, nominal: 2000000, lastBayar: "Mar 2024", status: "Tunggak" },
];

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
const KELAS_FILTER = ["Semua", "VII-A", "VII-B", "VIII-A", "VIII-B", "IX-A", "IX-B"];
const SEMESTER_FILTER = ["Genap 2023/2024", "Ganjil 2023/2024", "Genap 2022/2023"];

const MonitoringPembayaran = () => {
  const [kelas, setKelas] = useState("Semua");
  const [semester, setSemester] = useState("Genap 2023/2024");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [exported, setExported] = useState(false);

  const filtered = mockSiswa.filter(s => {
    const kOk = kelas === "Semua" || s.kelas === kelas;
    const stOk = statusFilter === "Semua" || s.status === statusFilter;
    const sOk = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    return kOk && stOk && sOk;
  });

  const totalTunggak = filtered.filter(s => s.status === "Tunggak").length;
  const totalLunas = filtered.filter(s => s.status === "Lunas").length;
  const totalNominal = filtered.filter(s => s.status === "Tunggak").reduce((a, c) => a + c.nominal, 0);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
    alert(`✅ Laporan pembayaran ${semester} — Kelas: ${kelas} berhasil diekspor!`);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400">Dashboard &gt; <span className="text-[#2A4365] font-semibold">Monitoring Pembayaran</span></div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Monitoring Pembayaran &amp; Tunggakan</h1>
          <p className="text-[14px] text-gray-500 mt-1">Pantau status SPP seluruh siswa dan tunggakan aktif</p>
        </div>
        <button onClick={handleExport} className={`px-4 py-2.5 rounded-xl text-[12px] font-bold shadow-sm transition-colors uppercase tracking-wider ${exported ? "bg-green-50 text-green-700 border border-green-100" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          {exported ? "Berhasil Diekspor" : "Ekspor Laporan"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Siswa Lunas", val: totalLunas, sub: "dari " + filtered.length + " siswa", bg: "bg-[#1A3D63]" },
          { label: "Siswa Menunggak", val: totalTunggak, sub: "perlu perhatian", bg: "bg-[#1A3D63]" },
          { label: "Total Tunggakan", val: fmt(totalNominal), sub: semester, bg: "bg-[#1A3D63]" },
        ].map((c, i) => (
          <div key={i} className={`${c.bg} rounded-2xl p-5 shadow-sm`}>
            <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">{c.label}</p>
            <p className="text-[26px] font-black leading-tight text-white">{c.val}</p>
            <p className="text-[12px] mt-1 text-white/60">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Semester</label>
          <select value={semester} onChange={e => setSemester(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100">
            {SEMESTER_FILTER.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Kelas</label>
          <select value={kelas} onChange={e => setKelas(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100">
            {KELAS_FILTER.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Status</label>
          <div className="flex gap-2">
            {[["Semua", "Semua"], ["Tunggak", "Menunggak"], ["Lunas", "Lunas"]].map(([val, label]) => (
              <button key={val} onClick={() => setStatusFilter(val)} className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-colors ${statusFilter === val ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="ml-auto">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Pencarian</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Cari nama / NIS..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 w-52"/>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>{["NIS", "NAMA SISWA", "KELAS", "STATUS", "BLN TUNGGAK", "TOTAL TUNGGAKAN", "TERAKHIR BAYAR", "DETAIL"].map(h => (
                <th key={h} className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3.5 text-[12px] text-gray-400 font-mono">{s.nis}</td>
                  <td className="px-4 py-3.5 text-[13px] font-bold text-gray-800">{s.nama}</td>
                  <td className="px-4 py-3.5"><span className="text-[12px] text-gray-500 font-medium">{s.kelas}</span></td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.status === "Lunas" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                      {s.status === "Tunggak" ? "⚠ Menunggak" : "✓ Lunas"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-bold text-center">{s.bulanTunggak > 0 ? <span className="text-red-500">{s.bulanTunggak} bulan</span> : <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-3.5 text-[13px] font-bold">{s.nominal > 0 ? <span className="text-red-600">{fmt(s.nominal)}</span> : <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{s.lastBayar}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setDetail(s)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[10px] uppercase tracking-wider font-bold hover:bg-gray-50 transition-colors">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400 text-[13px]">Tidak ada data siswa ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden">

            {/* Header Gradient */}
            <div className={`relative px-6 pt-6 pb-7 ${detail.status === "Lunas" ? "bg-gradient-to-br from-[#1A3D63] to-[#1d6a3a]" : "bg-gradient-to-br from-[#1A3D63] to-[#7f1d1d]"}`}>
              <button
                onClick={() => setDetail(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-[22px] shadow-lg">
                  {detail.nama.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-white font-bold text-[18px] leading-tight">{detail.nama}</p>
                  <p className="text-white/65 text-[13px] mt-0.5">{detail.nis} · {detail.kelas}</p>
                  <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${detail.status === "Lunas" ? "bg-green-400/30 text-green-100" : "bg-red-400/30 text-red-100"}`}>
                    {detail.status === "Lunas" ? "✓ Lunas" : "⚠ Menunggak"}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pt-5 pb-4 space-y-4">

              {/* Info Rows */}
              <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 overflow-hidden border border-gray-100">
                {[
                  { icon: "📅", label: "Semester", value: semester, extra: "" },
                  { icon: "💳", label: "Terakhir Bayar", value: detail.lastBayar, extra: "" },
                  { icon: "📆", label: "Bulan Menunggak", value: detail.bulanTunggak > 0 ? `${detail.bulanTunggak} bulan` : "—", extra: detail.bulanTunggak > 0 ? "text-red-600 font-bold" : "text-gray-400" },
                  { icon: "💰", label: "Total Tunggakan", value: detail.nominal > 0 ? fmt(detail.nominal) : "—", extra: detail.nominal > 0 ? "text-red-600 font-bold" : "text-gray-400" },
                ].map(({ icon, label, value, extra }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[15px]">{icon}</span>
                      <span className="text-[13px] text-gray-500">{label}</span>
                    </div>
                    <span className={`text-[13px] font-semibold text-gray-800 ${extra}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Alert Menunggak */}
              {detail.status === "Tunggak" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-amber-700 mb-0.5">Perlu Tindak Lanjut</p>
                    <p className="text-[12px] text-amber-600 leading-relaxed">Koordinasikan dengan Bendahara untuk verifikasi dan penyelesaian tunggakan pembayaran siswa ini.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              <button
                onClick={() => setDetail(null)}
                className="w-full py-3 bg-gradient-to-r from-[#1A3D63] to-[#2563a8] hover:from-[#163256] hover:to-[#1d5490] text-white rounded-xl font-bold text-[14px] transition-all shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringPembayaran;


