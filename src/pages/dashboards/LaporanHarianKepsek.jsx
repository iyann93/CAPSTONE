import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const LaporanHarianKepsek = ({ user, onNavigate }) => {
  const [date, setDate] = useState("2025-10-12");

  const DATA_HARIAN = [
    { time: "08:00", Pemasukan: 15, Pengeluaran: 0 },
    { time: "10:00", Pemasukan: 45, Pengeluaran: 10 },
    { time: "12:00", Pemasukan: 20, Pengeluaran: 5 },
    { time: "14:00", Pemasukan: 35, Pengeluaran: 15 },
    { time: "16:00", Pemasukan: 10, Pengeluaran: 50 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans p-4 md:p-8 min-h-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate && onNavigate("Dashboard")} className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-gray-100 text-gray-600 border-none cursor-pointer">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            </button>
            <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Laporan Harian</h1>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-[44px]">Rangkuman arus kas dan aktivitas harian sekolah.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5 font-medium shadow-sm outline-none transition-all cursor-pointer"
          />
          <button className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2 border-none cursor-pointer">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pemasukan Hari Ini</div>
          <div className="text-[28px] font-black text-emerald-600">Rp 125.000.000</div>
          <div className="text-[12px] text-gray-500 font-medium mt-1">142 Transaksi SPP</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pengeluaran Hari Ini</div>
          <div className="text-[28px] font-black text-amber-600">Rp 80.000.000</div>
          <div className="text-[12px] text-gray-500 font-medium mt-1">Didominasi biaya operasional</div>
        </div>
        <div className="bg-[#1A3D63] border border-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-2">Surplus Harian</div>
          <div className="text-[28px] font-black text-white">Rp 45.000.000</div>
          <div className="text-[12px] text-blue-300 font-medium mt-1">Kondisi kas harian positif</div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
        <h3 className="text-[16px] font-bold text-gray-800 mb-6">Tren Transaksi Harian</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA_HARIAN} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: "bold" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(value) => `Rp ${value}jt`} />
              <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
              <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="Pengeluaran" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default LaporanHarianKepsek;


