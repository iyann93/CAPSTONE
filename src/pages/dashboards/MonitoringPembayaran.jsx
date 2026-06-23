import React, { useState } from "react";

const mockSiswa = [
  { id: 1, nama: "Ahmad Fauzi", nis: "2022001", kelas: "XI IPA 2", bulanTunggak: 2, nominal: 1000000, lastBayar: "Mei 2024", status: "Tunggak" },
  { id: 2, nama: "Budi Santosa", nis: "2022002", kelas: "X IPS 1", bulanTunggak: 1, nominal: 500000, lastBayar: "Jun 2024", status: "Tunggak" },
  { id: 3, nama: "Citra Lestari", nis: "2021003", kelas: "XII IPA 1", bulanTunggak: 3, nominal: 1500000, lastBayar: "Apr 2024", status: "Tunggak" },
  { id: 4, nama: "Dewi Rahayu", nis: "2022004", kelas: "XI IPA 1", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 5, nama: "Eko Prasetyo", nis: "2022005", kelas: "X IPA 1", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 6, nama: "Fitri Handayani", nis: "2021006", kelas: "XII IPA 2", bulanTunggak: 1, nominal: 500000, lastBayar: "Jun 2024", status: "Tunggak" },
  { id: 7, nama: "Galih Kusuma", nis: "2022007", kelas: "XI IPS 1", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 8, nama: "Hana Safitri", nis: "2021008", kelas: "XII IPA 1", bulanTunggak: 2, nominal: 1000000, lastBayar: "Mei 2024", status: "Tunggak" },
  { id: 9, nama: "Irfan Maulana", nis: "2022009", kelas: "X IPS 1", bulanTunggak: 0, nominal: 0, lastBayar: "Jun 2024", status: "Lunas" },
  { id: 10, nama: "Julia Pratiwi", nis: "2021010", kelas: "XII IPA 2", bulanTunggak: 4, nominal: 2000000, lastBayar: "Mar 2024", status: "Tunggak" },
];

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
const KELAS_FILTER = ["Semua", "X IPA 1", "X IPS 1", "XI IPA 1", "XI IPA 2", "XI IPS 1", "XII IPA 1", "XII IPA 2"];
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
          <h1 className="text-[26px] font-bold text-[#1e293b]">Monitoring Pembayaran & Tunggakan</h1>
          <p className="text-[14px] text-gray-500 mt-1">Pantau status SPP seluruh siswa dan tunggakan aktif</p>
        </div>
        <button onClick={handleExport} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors ${exported ? "bg-green-100 text-green-700" : "bg-[#1A3D63] hover:bg-[#163256] text-white"}`}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {exported ? "Berhasil Diekspor!" : "Ekspor Laporan"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Siswa Lunas", val: totalLunas, sub: "dari " + filtered.length + " siswa", bg: "bg-[#1A3D63]", valColor: "text-green-300", subColor: "text-blue-300" },
          { label: "Siswa Tunggak", val: totalTunggak, sub: "perlu perhatian", bg: "bg-[#1A3D63]", valColor: "text-red-300", subColor: "text-blue-300" },
          { label: "Total Tunggakan", val: fmt(totalNominal), sub: semester, bg: "bg-[#1A3D63]", valColor: "text-amber-300", subColor: "text-blue-300" },
        ].map((c, i) => (
          <div key={i} className={`${c.bg} rounded-2xl p-5 shadow-sm`}>
            <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-2">{c.label}</p>
            <p className={`text-[26px] font-black leading-tight ${c.valColor}`}>{c.val}</p>
            <p className={`text-[12px] mt-1 ${c.subColor}`}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
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
            {["Semua", "Tunggak", "Lunas"].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-colors ${statusFilter === f ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="ml-auto relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Cari nama / NIS..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 w-48 mt-5"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>{["NIS", "NAMA SISWA", "KELAS", "STATUS", "BLN TUNGGAK", "TOTAL TUNGGAKAN", "TERAKHIR BAYAR", "DETAIL"].map(h => (
                <th key={h} className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className={`transition-colors ${s.status === "Tunggak" ? "hover:bg-red-50/20" : "hover:bg-gray-50/50"}`}>
                  <td className="px-4 py-3.5 text-[12px] text-gray-400 font-mono">{s.nis}</td>
                  <td className="px-4 py-3.5 text-[13px] font-bold text-gray-800">{s.nama}</td>
                  <td className="px-4 py-3.5"><span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold">{s.kelas}</span></td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.status === "Lunas" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                      {s.status === "Tunggak" ? "⚠ Tunggak" : "✓ Lunas"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-bold text-center">{s.bulanTunggak > 0 ? <span className="text-red-500">{s.bulanTunggak} bulan</span> : <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-3.5 text-[13px] font-bold">{s.nominal > 0 ? <span className="text-red-600">{fmt(s.nominal)}</span> : <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{s.lastBayar}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setDetail(s)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[11px] font-bold hover:bg-gray-50">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#1e293b]">Detail Pembayaran Siswa</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#1A3D63] rounded-2xl flex items-center justify-center text-white font-black text-[20px]">
                  {detail.nama.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-gray-800">{detail.nama}</p>
                  <p className="text-[13px] text-gray-400">{detail.nis} · {detail.kelas}</p>
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${detail.status === "Lunas" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                <p className="text-[12px] font-bold uppercase tracking-wider mb-1 ${detail.status === 'Lunas' ? 'text-green-600' : 'text-red-500'}">Status Pembayaran</p>
                <p className={`text-[20px] font-black ${detail.status === "Lunas" ? "text-green-600" : "text-red-500"}`}>{detail.status === "Lunas" ? "✓ Lunas" : "⚠ Tunggakan Aktif"}</p>
              </div>
              <div className="space-y-2">
                {[
                  ["Semester", semester],
                  ["Terakhir Bayar", detail.lastBayar],
                  ["Bulan Tunggak", detail.bulanTunggak > 0 ? `${detail.bulanTunggak} bulan` : "Tidak ada"],
                  ["Total Tunggakan", detail.nominal > 0 ? fmt(detail.nominal) : "Rp 0"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-[13px] text-gray-500">{k}</span>
                    <span className={`text-[13px] font-bold ${k === "Total Tunggakan" && detail.nominal > 0 ? "text-red-600" : "text-gray-800"}`}>{v}</span>
                  </div>
                ))}
              </div>
              {detail.status === "Tunggak" && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[12px] text-amber-700 flex gap-2">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                  Monitoring tunggakan perlu ditindaklanjuti. Koordinasikan dengan Bendahara untuk verifikasi pembayaran.
                </div>
              )}
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setDetail(null)} className="w-full py-3 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl font-bold">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringPembayaran;
