import React, { useState } from "react";
import SPPDonutChart from "../../components/SPPDonutChart";

const MonitoringKeuanganKepsek = () => {
  const [filter, setFilter] = useState({ tahunAjaran: "2024/2025", semester: "Ganjil", bulan: "Semua Bulan" });

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fadeIn min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Monitoring Keuangan</span>
      </div>
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Monitoring Keuangan &amp; Tunggakan</h1>
        <p className="text-[14px] text-gray-500 mt-1">Pantau pembayaran siswa, tunggakan SPP, dan laporan keuangan sekolah.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Tahun Ajaran</label>
          <select 
            value={filter.tahunAjaran} 
            onChange={(e) => setFilter({...filter, tahunAjaran: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          >
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Semester</label>
          <select 
            value={filter.semester} 
            onChange={(e) => setFilter({...filter, semester: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          >
            <option>Ganjil</option>
            <option>Genap</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Bulan</label>
          <select 
            value={filter.bulan} 
            onChange={(e) => setFilter({...filter, bulan: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          >
            <option>Semua Bulan</option>
            <option>Juli</option>
            <option>Agustus</option>
            <option>September</option>
            <option>Oktober</option>
          </select>
        </div>
        <button className="bg-[#EBF3FA] text-[#1A3D63] px-5 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition-colors h-[42px]">
          Terapkan Filter
        </button>
      </div>

      {/* Ringkasan Keuangan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <svg width="20" height="20" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
            </div>
            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wider">Total Pemasukan</p>
          </div>
          <p className="text-[28px] font-bold text-[#1e293b]">Rp 450.500.000</p>
          <p className="text-[12px] text-green-600 font-bold mt-1">✓ Berjalan sesuai target</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
            </div>
            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wider">Total Pengeluaran</p>
          </div>
          <p className="text-[28px] font-bold text-[#1e293b]">Rp 120.250.000</p>
          <p className="text-[12px] text-gray-500 font-bold mt-1">Sebagian besar untuk operasional &amp; gaji</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wider">Total Tunggakan SPP</p>
          </div>
          <p className="text-[28px] font-bold text-[#1e293b]">Rp 12.500.000</p>
          <p className="text-[12px] text-red-600 font-bold mt-1">⚠ Membutuhkan tindak lanjut</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-gray-800">Daftar Tunggakan Siswa</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Siswa</th>
                  <th className="px-6 py-4">Kelas</th>
                  <th className="px-6 py-4">Jumlah Tunggakan</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">Budi Santoso</td>
                  <td className="px-6 py-4 text-gray-600">XII IPS 2</td>
                  <td className="px-6 py-4 text-red-600 font-bold">Rp 1.200.000</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold text-[11px]">Tunggak 3 Bulan</span></td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">Cici Rahmawati</td>
                  <td className="px-6 py-4 text-gray-600">X IPA 1</td>
                  <td className="px-6 py-4 text-red-600 font-bold">Rp 400.000</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full font-bold text-[11px]">Tunggak 1 Bulan</span></td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">Andi Saputra</td>
                  <td className="px-6 py-4 text-gray-600">XI IPS 1</td>
                  <td className="px-6 py-4 text-red-600 font-bold">Rp 800.000</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold text-[11px]">Tunggak 2 Bulan</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
            <button className="text-[13px] font-bold text-[#1A3D63] hover:underline">Lihat Semua Tunggakan</button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <SPPDonutChart />
        </div>
      </div>
    </div>
  );
};

export default MonitoringKeuanganKepsek;
