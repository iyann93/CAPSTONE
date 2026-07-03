import React, { useState } from "react";

const mockDataSiswa = [
  { id: 1, nis: "0011223344", nama: "Ahmad Fauzi", kelas: "VII A", status: "Lunas", nominal: 1250000, tglBayar: "05 Jan 2026", jatuhTempo: "10 Jan 2026", bulan: "Januari", tahun: "2025/2026" },
  { id: 2, nis: "0011223345", nama: "Budi Santoso", kelas: "VII A", status: "Belum Lunas", nominal: 1250000, tglBayar: "-", jatuhTempo: "10 Jan 2026", bulan: "Januari", tahun: "2025/2026" },
  { id: 3, nis: "0011223346", nama: "Citra Lestari", kelas: "VII A", status: "Lunas", nominal: 1250000, tglBayar: "07 Jan 2026", jatuhTempo: "10 Jan 2026", bulan: "Januari", tahun: "2025/2026" },
  { id: 4, nis: "0011223347", nama: "Dewi Rahmawati", kelas: "VII A", status: "Menunggu", nominal: 1250000, tglBayar: "09 Jan 2026", jatuhTempo: "10 Jan 2026", bulan: "Januari", tahun: "2025/2026" },
  { id: 5, nis: "0011223348", nama: "Eko Prasetyo", kelas: "VII A", status: "Belum Lunas", nominal: 1250000, tglBayar: "-", jatuhTempo: "10 Jan 2026", bulan: "Januari", tahun: "2025/2026" },
];

const bulanOptions = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const tahunOptions = ["2024/2025", "2025/2026", "2026/2027"];
const statusOptions = ["Semua Status", "Lunas", "Belum Lunas", "Menunggu"];

const MonitoringSPPWaliKelas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBulan, setSelectedBulan] = useState("Januari");
  const [selectedTahun, setSelectedTahun] = useState("2025/2026");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");

  const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

  const filteredData = mockDataSiswa.filter(item => 
    item.bulan === selectedBulan &&
    item.tahun === selectedTahun &&
    (selectedStatus === "Semua Status" || item.status === selectedStatus) &&
    (item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.nis.includes(searchTerm))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Monitoring SPP Siswa</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Monitoring SPP Siswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">Pantau status pembayaran SPP siswa di kelas VII A secara real-time</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <select 
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer whitespace-nowrap min-w-fit"
          >
            {tahunOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select 
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer whitespace-nowrap min-w-fit"
          >
            {bulanOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer whitespace-nowrap min-w-fit"
          >
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="relative w-full md:w-[300px]">
          <input 
            type="text" 
            placeholder="Cari NIS atau Nama Siswa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
          />
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[80px]">No</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">NIS</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nominal SPP</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-5 text-[13px] text-gray-500 font-medium">{index + 1}</td>
                    <td className="py-3 px-5 text-[13px] font-semibold text-gray-700">{item.nis}</td>
                    <td className="py-3 px-5 text-[13px] font-semibold text-[#2A4365]">{item.nama}</td>
                    <td className="py-3 px-5 text-[13px] font-bold text-gray-800">{fmt(item.nominal)}</td>
                    <td className="py-3 px-5 text-[13px] font-medium text-red-500">{item.jatuhTempo}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                        item.status === "Lunas" ? "bg-green-50 text-green-600 border border-green-100" :
                        item.status === "Menunggu" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-[13px] font-medium text-gray-500">{item.tglBayar}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-[14px]">Tidak ada data pembayaran siswa yang sesuai dengan filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringSPPWaliKelas;


