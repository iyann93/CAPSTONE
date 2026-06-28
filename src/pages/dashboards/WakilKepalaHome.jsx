import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "../../components/StatCard";

const UsersIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const ReceiptIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" /><path d="M12 7v5M9 15h6" /></svg>;
const WalletIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; // Used as WarningIcon
const BriefcaseIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>; // Used as FileTextIcon


// --- DUMMY DATA AKADEMIK (LAMA) ---
const stats = [
  { label: "Mata Pelajaran Aktif", val: 12, sub: "Kurikulum berjalan", color: "text-blue-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { label: "Jadwal Aktif", val: 38, sub: "Minggu ini", color: "text-green-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { label: "Konflik Jadwal", val: 2, sub: "Perlu diselesaikan", color: "text-amber-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { label: "Siswa Tunggakan", val: 14, sub: "Bulan berjalan", color: "text-red-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
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

const tunggakanRingkas = [
  { nama: "Ahmad Fauzi", kelas: "VIII-A", bulan: 2, nominal: "Rp 1.000.000" },
  { nama: "Budi Santosa", kelas: "VII-B", bulan: 1, nominal: "Rp 500.000" },
  { nama: "Citra Lestari", kelas: "IX-A", bulan: 3, nominal: "Rp 1.500.000" },
];

// --- DUMMY DATA KEUANGAN (BARU) ---
const financeStats = [
  { title: "Total Siswa Aktif", value: "1,248", change: "+12", trend: "up", icon: "👥", color: "blue" },
  { title: "Kepatuhan SPP", value: "84%", change: "+2%", trend: "up", icon: "🧾", color: "green" },
  { title: "Guru Dibayar", value: "85", change: "Bulan ini", trend: "neutral", icon: "💳", color: "green" },
  { title: "Gaji Tertunda", value: "7", change: "-2", trend: "down", icon: "⏳", color: "amber" },
];

const sppChartData = [
  { name: 'Jan', lunas: 1100, belum: 148 },
  { name: 'Feb', lunas: 1150, belum: 98 },
  { name: 'Mar', lunas: 1180, belum: 68 },
  { name: 'Apr', lunas: 1120, belum: 128 },
  { name: 'Mei', lunas: 1200, belum: 48 },
  { name: 'Jun', lunas: 1048, belum: 200 },
];

const pieDataSPP = [
  { name: 'Lunas', value: 1048, color: '#1A3D63' },
  { name: 'Belum Lunas', value: 200, color: '#e5e7eb' }
];

const kelasComplianceData = [
  { name: 'VII', lunas: 88, belum: 12 },
  { name: 'VIII', lunas: 75, belum: 25 },
  { name: 'IX', lunas: 92, belum: 8 },
];

const evaluasiOperasional = [
  { id: 1, type: "warning", title: "Kepatuhan Kelas VIII Menurun", desc: "Kelas VIII tercatat memiliki tingkat kepatuhan terendah (75%). Perlu evaluasi dengan Wali Kelas terkait." },
  { id: 2, type: "alert", title: "14 Siswa Menunggak >3 Bulan", desc: "Dibutuhkan tindakan kedisiplinan dan penerbitan Surat Peringatan untuk 14 siswa." },
  { id: 3, type: "success", title: "Tren Pembayaran Positif", desc: "Terjadi peningkatan pembayaran SPP sebesar 2% dibandingkan bulan sebelumnya pada seluruh kelas." },
];

const WakilKepalaHome = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState("akademik");
  
  const [filterTahun, setFilterTahun] = useState("2023/2024");
  const [filterSemester, setFilterSemester] = useState("Genap");
  const [filterBulan, setFilterBulan] = useState("Semua Bulan");
  const [isLoading, setIsLoading] = useState(false);
  const [filterKey, setFilterKey] = useState(0);

  const handleApplyFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFilterKey(k => k + 1);
    }, 800);
  };

  // Dinamis stat berdasarkan filter (mock)
  const dynamicStats = {
    siswa: 1248 - (filterKey * 3),
    sppPercent: Math.min(100, 84 + (filterKey * 2)),
    kelasEvaluasi: filterKey % 2 === 0 ? "VIII" : "VII",
    siswaSP: Math.max(0, 14 - filterKey)
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Dashboard Wakil Kepala Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Selamat datang, <span className="font-semibold text-[#1A3D63]">{user?.nama || "Drs. Hendra Kurniawan"}</span> — Wakil Kepala MBS Prambanan
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab("akademik")}
          className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'akademik' ? 'bg-[#1A3D63] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          🎓 Akademik & Jadwal
        </button>
        <button 
          onClick={() => setActiveTab("keuangan")}
          className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'keuangan' ? 'bg-[#1A3D63] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          💰 Monitoring Keuangan
        </button>
      </div>

      {/* =========================================================================
          TAB: AKADEMIK (LAMA)
          ========================================================================= */}
      {activeTab === "akademik" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/>
                    <h3 className="text-[15px] font-bold text-gray-800">⚠️ Konflik Jadwal Aktif</h3>
                  </div>
                  <button onClick={() => onNavigate("Jadwal Pelajaran")} className="text-[12px] font-bold text-[#1A3D63] hover:underline">Lihat Semua →</button>
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
                      <button onClick={() => onNavigate("Jadwal Pelajaran")} className="flex-shrink-0 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-[11px] font-bold transition-colors">
                        Perbaiki
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kurikulum terbaru */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-gray-800">📚 Kurikulum Terbaru</h3>
                  <button onClick={() => onNavigate("Kelola Kurikulum")} className="text-[12px] font-bold text-[#1A3D63] hover:underline">Kelola →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-50">
                      <tr>
                        {["MATA PELAJARAN", "KELAS", "TINGKAT", "STATUS"].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentCurriculum.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3 text-[13px] font-semibold text-gray-800">{r.mapel}</td>
                          <td className="px-5 py-3 text-[13px] text-gray-600">{r.kelas}</td>
                          <td className="px-5 py-3 text-[13px] text-gray-500">{r.tingkat}</td>
                          <td className="px-5 py-3">
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

            {/* Right: Tunggakan ringkas */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-gray-800">💰 Tunggakan SPP</h3>
                  <button onClick={() => onNavigate("Monitoring Pembayaran")} className="text-[12px] font-bold text-[#1A3D63] hover:underline">Detail →</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {tunggakanRingkas.map((t, i) => (
                    <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">{t.nama}</p>
                        <p className="text-[12px] text-gray-400">{t.kelas} · {t.bulan} bln tunggak</p>
                      </div>
                      <span className="text-[12px] font-black text-red-500 flex-shrink-0">{t.nominal}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-red-50/50 border-t border-red-50 flex items-center justify-between">
                  <span className="text-[12px] text-red-500 font-semibold">Total 14 siswa tunggak</span>
                  <button onClick={() => onNavigate("Monitoring Pembayaran")} className="text-[12px] font-bold text-[#1A3D63] hover:underline">Lihat semua</button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#1A3D63] rounded-2xl p-5 space-y-3">
                <p className="text-[12px] font-bold text-blue-300 uppercase tracking-wider">Menu Cepat</p>
                {[
                  { label: "Tambah Jadwal Baru", menu: "Jadwal Pelajaran", icon: "+" },
                  { label: "Kelola Kurikulum", menu: "Kelola Kurikulum", icon: "📚" },
                  { label: "Laporan Pembayaran", menu: "Monitoring Pembayaran", icon: "📊" },
                ].map((a, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate(a.menu)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[13px] font-semibold transition-colors text-left"
                  >
                    <span className="text-[16px]">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: KEUANGAN (BARU)
          ========================================================================= */}
      {activeTab === "keuangan" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* FILTER BAR */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Tahun Ajaran</label>
              <select value={filterTahun} onChange={e => setFilterTahun(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[140px]">
                <option>2023/2024</option>
                <option>2022/2023</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Semester</label>
              <select value={filterSemester} onChange={e => setFilterSemester(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[120px]">
                <option>Genap</option>
                <option>Ganjil</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Bulan</label>
              <select value={filterBulan} onChange={e => setFilterBulan(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[120px]">
                <option>Semua Bulan</option>
                <option>Januari</option>
                <option>Februari</option>
                <option>Maret</option>
                <option>April</option>
                <option>Mei</option>
                <option>Juni</option>
              </select>
            </div>
            <button onClick={handleApplyFilter} disabled={isLoading} className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#1A3D63] hover:bg-[#163256] disabled:bg-blue-300 text-white rounded-xl text-[12px] font-bold shadow-sm transition-colors uppercase tracking-wider">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Memproses...
                </>
              ) : (
                "Terapkan Filter"
              )}
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-[#1A3D63] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-gray-500 font-semibold text-sm">Mensinkronisasi Data Keuangan...</p>
            </div>
          ) : (
            <>
              {/* STATISTIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-fadeIn" style={{ animationDelay: "0ms" }}>
              <StatCard
                title="Total Siswa Aktif"
                value={dynamicStats.siswa.toLocaleString()}
                subtitle={filterBulan === "Semua Bulan" ? "+12 dari bulan lalu" : "Tercatat bulan " + filterBulan}
                icon={<UsersIcon />}
                iconBg="#e0effe"
                iconColor="#1B3B5F"
              />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "80ms" }}>
              <StatCard
                title="Kepatuhan SPP"
                value={`${dynamicStats.sppPercent}%`}
                subtitle={filterBulan === "Semua Bulan" ? "+2% dari bulan lalu" : "Tercatat bulan " + filterBulan}
                icon={<ReceiptIcon />}
                iconBg="#ecfdf5"
                iconColor="#10b981"
              />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "160ms" }}>
              <StatCard
                title="Perlu Dievaluasi"
                value={`Kelas ${dynamicStats.kelasEvaluasi}`}
                subtitle={`Kepatuhan di bawah 80%`}
                icon={<WalletIcon />}
                iconBg="#fef3c7"
                iconColor="#d97706"
              />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "240ms" }}>
              <StatCard
                title="Siswa Perlu SP"
                value={dynamicStats.siswaSP.toString()}
                subtitle="Tunggakan >3 bulan"
                icon={<BriefcaseIcon />}
                iconBg="#fee2e2"
                iconColor="#dc2626"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SPP MONITORING SECTION (Takes up 2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-800">Distribusi Status SPP</h3>
                    <p className="text-[12px] text-gray-500 mt-1">Tren pembayaran Lunas vs Belum Lunas</p>
                  </div>
                  <button onClick={() => onNavigate("Monitoring SPP")} className="text-[12px] font-bold text-[#1A3D63] hover:underline px-3 py-1.5 transition-colors">Lihat Detail →</button>
                </div>
                
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sppChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="lunas" name="Lunas" fill="#1A3D63" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="belum" name="Belum Lunas" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TABLE: TUNGGAKAN SPP */}
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
                  <h3 className="text-[15px] font-bold text-gray-800">Daftar Siswa Menunggak SPP</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Cari siswa..." className="px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-[#1A3D63]" />
                    <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] bg-white text-gray-600 focus:outline-none">
                      <option>Semua Kelas</option>
                      <option>Kelas VII</option>
                      <option>Kelas VIII</option>
                      <option>Kelas IX</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Nama Siswa</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Kelas</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Tunggakan</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Nominal</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[13px]">
                      {tunggakanRingkas.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800">{item.nama}</td>
                          <td className="px-6 py-4 text-gray-500">{item.kelas}</td>
                          <td className="px-6 py-4 text-gray-500">{item.bulan} Bulan</td>
                          <td className="px-6 py-4 font-black text-gray-800">{item.nominal}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-block px-3 py-1 bg-red-50 text-red-600 font-bold text-[10px] rounded uppercase">MENUNGGAK</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SIDE COLUMN (Pie Chart, Salary, Activities) */}
            <div className="space-y-6">
              
              {/* Pie Chart SPP */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-[15px] font-bold text-gray-800 mb-6 self-start">Rasio SPP Bulan Ini</h3>
                <div className="w-[180px] h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieDataSPP} cx="50%" cy="50%" innerRadius={65} outerRadius={85} stroke="none" dataKey="value">
                        {pieDataSPP.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[26px] font-black text-gray-800">{dynamicStats.sppPercent}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Lunas</span>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-8">
                  {pieDataSPP.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        {d.name} ({d.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analisis Kepatuhan Kelas */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-bold text-gray-800">Analisis Kepatuhan Kelas</h3>
                  <button onClick={() => onNavigate("Monitoring SPP")} className="text-[11px] font-bold text-[#1A3D63] hover:underline">Detail</button>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Rata-Rata Seluruh Kelas</span>
                    <span className="text-[14px] font-black text-[#1A3D63]">{dynamicStats.sppPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#10b981] h-2 rounded-full transition-all duration-500" style={{ width: `${dynamicStats.sppPercent}%` }}></div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Menunjukkan rasio pembayaran SPP tepat waktu bulan ini.</p>
                </div>

                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kelasComplianceData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                      <Bar dataKey="lunas" name="Kepatuhan (%)" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Evaluasi Operasional */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-800 mb-4">Evaluasi Operasional</h3>
                <div className="space-y-4">
                  {evaluasiOperasional.map((evalItem, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${evalItem.type === 'success' ? 'bg-green-500' : evalItem.type === 'alert' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        {idx !== evaluasiOperasional.length - 1 && <div className="w-px h-full bg-gray-100 my-1" />}
                      </div>
                      <div className="pb-3">
                        <p className="text-[13px] font-bold text-gray-800 mt-0.5">{evalItem.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{evalItem.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WakilKepalaHome;
