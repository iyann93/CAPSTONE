import React, { useState } from "react";

const LogAktivitasKepsek = ({ user, onNavigate }) => {
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const logs = [
    { id: 1, date: "12 Okt 2025", time: "09:15", timestamp: "2025-10-12T09:15:00", category: "Pembayaran SPP", description: "Pembayaran SPP 45 Siswa Kelas VII A", status: "SELESAI", color: "green" },
    { id: 2, date: "11 Okt 2025", time: "11:20", timestamp: "2025-10-11T11:20:00", category: "Pemberian Beasiswa", description: "Dana bantuan 12 Siswa Yatim Piatu", status: "DIPROSES", color: "amber" },
    { id: 3, date: "10 Okt 2025", time: "08:00", timestamp: "2025-10-10T08:00:00", category: "Pembayaran Gaji", description: "Gaji Guru Periode Oktober", status: "SELESAI", color: "green" },
    { id: 4, date: "09 Okt 2025", time: "14:30", timestamp: "2025-10-09T14:30:00", category: "Pembayaran SPP", description: "Pembayaran SPP 38 Siswa Kelas VIII B", status: "SELESAI", color: "green" },
    { id: 5, date: "06 Okt 2025", time: "09:45", timestamp: "2025-10-06T09:45:00", category: "Pemberian Beasiswa", description: "Beasiswa Prestasi 5 Siswa Kelas IX", status: "SELESAI", color: "green" },
    { id: 6, date: "05 Okt 2025", time: "13:00", timestamp: "2025-10-05T13:00:00", category: "Pembayaran SPP", description: "Pembayaran SPP 32 Siswa Kelas IX A", status: "SELESAI", color: "green" },
    { id: 7, date: "04 Okt 2025", time: "10:30", timestamp: "2025-10-04T10:30:00", category: "Pembayaran Gaji", description: "Gaji Staf TU & Karyawan", status: "SELESAI", color: "green" },
    { id: 8, date: "03 Okt 2025", time: "11:00", timestamp: "2025-10-03T11:00:00", category: "Pembayaran SPP", description: "Pembayaran SPP 40 Siswa Kelas VII B", status: "SELESAI", color: "green" },
    { id: 9, date: "02 Okt 2025", time: "15:45", timestamp: "2025-10-02T15:45:00", category: "Pemberian Beasiswa", description: "Beasiswa Tahfidz 3 Siswa Kelas VIII", status: "DIPROSES", color: "amber" },
    { id: 10, date: "01 Okt 2025", time: "09:00", timestamp: "2025-10-01T09:00:00", category: "Pembayaran SPP", description: "Pembayaran SPP 30 Siswa Kelas IX B", status: "SELESAI", color: "green" },
  ];

  const filteredLogs = logs.filter(log => {
    if (filter !== "Semua") {
      if (filter === "Pemasukan" && log.category !== "Pembayaran SPP") return false;
      if (filter === "Pengeluaran" && log.category === "Pembayaran SPP") return false;
    }
    if (search && !log.description.toLowerCase().includes(search.toLowerCase()) && !log.category.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Jika pencarian/filter merubah jumlah data sehingga currentPage melewati batas
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  } else if (totalPages === 0 && currentPage !== 1) {
    setCurrentPage(1);
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans p-4 md:p-8 min-h-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate && onNavigate("Dashboard")} className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-gray-100 text-gray-600 border-none cursor-pointer">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            </button>
            <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Log Aktivitas Sistem</h1>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-[44px]">Daftar riwayat lengkap seluruh transaksi dan perubahan sistem.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
        {/* Filter and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari aktivitas atau rincian..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all"
            />
            <span className="absolute left-3.5 top-3 text-gray-400">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {["Semua", "Pemasukan", "Pengeluaran"].map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${filter === f ? "bg-[#1A3D63] text-white border-[#1A3D63]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[15%]">Waktu</th>
                <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[25%]">Kategori Aktivitas</th>
                <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[45%]">Rincian Keterangan</th>
                <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[12px]">
              {currentLogs.length > 0 ? currentLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-gray-800">{log.date}</span>
                      <span className="text-[10px] font-semibold text-gray-400">{log.time} WIB</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800">{log.category}</td>
                  <td className="py-4 px-4 text-gray-500">{log.description}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`inline-block px-3 py-1 font-bold text-[10px] rounded uppercase ${
                      log.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                      log.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 font-medium">Tidak ada log aktivitas yang sesuai.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center text-[12px] text-gray-500 font-medium">
          <span>Menampilkan halaman {totalPages === 0 ? 0 : currentPage} dari {totalPages} ({filteredLogs.length} entri)</span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <button 
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-[#1A3D63] rounded-lg cursor-pointer transition-all shadow-sm font-bold text-[11px] uppercase tracking-wider"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Prev
              </button>
            )}
            
            {totalPages > 0 && (
              <button className="px-3.5 py-1.5 border border-[#1A3D63] bg-[#1A3D63] text-white rounded-lg font-black shadow-sm text-[12px]">
                {currentPage}
              </button>
            )}
            
            {currentPage < totalPages && (
              <button 
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-[#1A3D63] rounded-lg cursor-pointer transition-all shadow-sm font-bold text-[11px] uppercase tracking-wider"
              >
                Next
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogAktivitasKepsek;
