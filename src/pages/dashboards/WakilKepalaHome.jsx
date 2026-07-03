import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { initialPengeluaranData } from "../../components/finance/PengeluaranOperasionalTab";

// --- Icons ---
const InfoIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- Dummy Data (Akademik) ---
const stats = [
  { label: "Mata Pelajaran Aktif", val: 12, sub: "Kurikulum berjalan", color: "text-blue-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { label: "Jadwal Aktif", val: 38, sub: "Minggu ini", color: "text-green-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { label: "Konflik Jadwal", val: 2, sub: "Perlu diselesaikan", color: "text-amber-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
];

const recentCurriculum = [
  { mapel: "Matematika", kelas: "IX-A", tingkat: "SMP", status: "Aktif" },
  { mapel: "IPA Terpadu", kelas: "VIII-A", tingkat: "SMP", status: "Aktif" },
  { mapel: "IPS Terpadu", kelas: "VII-B", tingkat: "SMP", status: "Revisi" },
  { mapel: "Bahasa Inggris", kelas: "VII-A", tingkat: "SMP", status: "Aktif" },
];

const conflicts = [
  { guru: "Bpk. Hendra", mapel: "IPA", kelas: "VIII-A & VIII-B", waktu: "Senin, 08:00", ruang: "Lab IPA" },
  { guru: "Ibu Sari", mapel: "B. Indonesia", kelas: "VII-A & VII-B", waktu: "Rabu, 10:00", ruang: "R. 12" },
];

// --- Dummy Data (Keuangan) ---
const chartData = [
  { name: 'Juli', nominal: 15000000 },
  { name: 'Agustus', nominal: 18000000 },
  { name: 'September', nominal: 17500000 },
  { name: 'Oktober', nominal: 19000000 },
  { name: 'November', nominal: 16500000 },
  { name: 'Desember', nominal: 22000000 },
  { name: 'Januari', nominal: 20000000 },
  { name: 'Februari', nominal: 18500000 },
  { name: 'Maret', nominal: 19500000 },
  { name: 'April', nominal: 18000000 },
  { name: 'Mei', nominal: 18500000 },
  { name: 'Juni', nominal: initialPengeluaranData.reduce((acc, curr) => acc + curr.nominal, 0) + 12000000 }
];

const recentTransactions = initialPengeluaranData.map(tx => ({
  id: tx.id,
  tanggal: tx.tanggal,
  nama: tx.nama,
  jenis: tx.kategori,
  nominal: tx.nominal
}));

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Tooltip for Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3">
        <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-[#1F3A5F]">
          {formatRupiah(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const WakilKepalaHome = ({ user, onNavigate }) => {
  const [tahunAjaran, setTahunAjaran] = useState("2025/2026");
  const [bulan, setBulan] = useState("Mei");

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fadeIn bg-[#F5F7FA] min-h-full font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1F3A5F] tracking-tight">Dashboard Wakil Kepala Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Monitoring seluruh aktivitas akademik dan operasional sekolah.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 text-[#1F3A5F] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN AKADEMIK */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#1F3A5F]">Monitoring Akademik &amp; Kurikulum</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#1A3D63] rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">{s.icon}</div>
              <div>
                <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-[28px] font-black text-white leading-tight">{s.val}</p>
                <p className={`text-[12px] mt-0.5 ${s.color}`}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Konflik Jadwal - Alert */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/>
                  <h3 className="text-[15px] font-bold text-gray-800">⚠️ Konflik Jadwal Aktif</h3>
                </div>
                <button onClick={() => onNavigate("Jadwal Pelajaran")} className="text-[12px] font-bold text-[#1F3A5F] hover:underline bg-transparent border-none cursor-pointer">Lihat Semua →</button>
              </div>
              <div className="divide-y divide-gray-50">
                {conflicts.map((c, i) => (
                  <div key={i} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-amber-50/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">{c.guru} — {c.mapel}</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">Kelas: {c.kelas} | Ruang: {c.ruang}</p>
                        <p className="text-[12px] text-amber-600 font-semibold mt-0.5">{c.waktu}</p>
                      </div>
                    </div>
                    <button onClick={() => onNavigate("Jadwal Pelajaran")} className="flex-shrink-0 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border-none">
                      Perbaiki
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Kurikulum terbaru */}
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-gray-800">📚 Kurikulum Terbaru</h3>
                <button onClick={() => onNavigate("Kelola Kurikulum")} className="text-[12px] font-bold text-[#1F3A5F] hover:underline bg-transparent border-none cursor-pointer">Kelola →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-50">
                    <tr>
                      {["MATA PELAJARAN", "KELAS", "TINGKAT", "STATUS"].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentCurriculum.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-[13px] font-semibold text-gray-800 whitespace-nowrap">{r.mapel}</td>
                        <td className="px-5 py-3 text-[13px] text-gray-600 whitespace-nowrap">{r.kelas}</td>
                        <td className="px-5 py-3 text-[13px] text-gray-500 whitespace-nowrap">{r.tingkat}</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === "Aktif" ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions (Academic) */}
          <div className="space-y-4">
            <div className="bg-[#1A3D63] rounded-[16px] p-5 space-y-3">
              <p className="text-[12px] font-bold text-blue-300 uppercase tracking-wider">Tindakan Akademik Cepat</p>
              {[
                { label: "Tambah Jadwal Baru", menu: "Jadwal Pelajaran", icon: "+" },
                { label: "Kelola Kurikulum", menu: "Kelola Kurikulum", icon: "📚" },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(a.menu)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[13px] font-semibold transition-colors text-left border-none cursor-pointer"
                >
                  <span className="text-[16px]">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BAGIAN KEUANGAN & OPERASIONAL */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-[#1F3A5F]">Monitoring Operasional &amp; Keuangan</h2>

        {/* Ringkasan Operasional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-50 border-l-4 border-l-[#1F3A5F]">
            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Operasional Bulan Ini</h3>
            <p className="text-[32px] font-black text-[#1F3A5F] tracking-tight">{formatRupiah(chartData.find(d => d.name === "Juni")?.nominal || 0)}</p>
          </div>
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-50 border-l-4 border-l-[#F59E0B]">
            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Operasional Tahun Ajaran</h3>
            <p className="text-[32px] font-black text-[#1F3A5F] tracking-tight">{formatRupiah(chartData.reduce((acc, curr) => acc + curr.nominal, 0))}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 p-6">
          <div className="mb-6">
            <h2 className="text-[18px] font-bold text-[#1F3A5F]">Tren Pengeluaran Operasional</h2>
            <p className="text-[13px] text-gray-500 mt-1">Total pengeluaran operasional setiap bulan.</p>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 600 }}
                  tickFormatter={(value) => `Rp${value / 1000000}M`}
                  width={80}
                />
                <RechartsTooltip cursor={{ fill: '#F5F7FA' }} content={<CustomTooltip />} />
                <Bar dataKey="nominal" fill="#1F3A5F" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent Expenditures */}
          <div className="space-y-6">
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-[#1F3A5F]">Pengeluaran Terbaru</h2>
                <button 
                  onClick={() => onNavigate && onNavigate("Riwayat Pengeluaran")}
                  className="text-[12px] font-bold text-[#1F3A5F] hover:underline cursor-pointer bg-transparent border-none"
                >
                  Lihat Semua →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama Pengeluaran</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jenis Pengeluaran</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nominal</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">{tx.tanggal}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-gray-800 whitespace-nowrap">{tx.nama}</td>
                        <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium text-[11px]">
                            {tx.jenis}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-bold text-[#1F3A5F] whitespace-nowrap">{formatRupiah(tx.nominal)}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1F3A5F] rounded-lg text-[11px] font-bold transition-colors border-none cursor-pointer">
                            <EyeIcon /> Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WakilKepalaHome;
