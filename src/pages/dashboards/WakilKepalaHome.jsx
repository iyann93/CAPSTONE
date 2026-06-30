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

const WakilKepalaHome = ({ user, onNavigate }) => {

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

      <div className="space-y-6 animate-fadeIn">
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

            {/* Right: Quick Actions */}
            <div className="space-y-4">
              <div className="bg-[#1A3D63] rounded-2xl p-5 space-y-3">
                <p className="text-[12px] font-bold text-blue-300 uppercase tracking-wider">Menu Cepat</p>
                {[
                  { label: "Tambah Jadwal Baru", menu: "Jadwal Pelajaran", icon: "+" },
                  { label: "Kelola Kurikulum", menu: "Kelola Kurikulum", icon: "📚" },
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
    </div>
  );
};

export default WakilKepalaHome;
