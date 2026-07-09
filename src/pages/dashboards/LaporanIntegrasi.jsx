import React, { useState } from 'react';

const LaporanIntegrasi = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Sinkronisasi data dengan Dapodik berhasil!');
    }, 2000);
  };

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-gray-800 tracking-tight">Laporan Integrasi Sistem</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Monitoring sinkronisasi data dengan sistem eksternal (Dapodik, EMIS).</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-all ${
            isSyncing 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#1A3D63] text-white hover:bg-[#122A44] shadow-md shadow-[#1A3D63]/20'
          }`}
        >
          {isSyncing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Sedang Sinkronisasi...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l5.57 5.57"/></svg>
              Sinkronisasi Ulang Dapodik
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Data Siswa Tersinkron</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-800">1,248</span>
              <span className="text-xs font-bold text-emerald-500">/ 1,248 (100%)</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Terakhir: Hari ini, 08:30 WIB</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Data Guru & Staf</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-800">112</span>
              <span className="text-xs font-bold text-emerald-500">/ 112 (100%)</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Terakhir: Hari ini, 08:32 WIB</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Log Error Integrasi</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-800">3</span>
              <span className="text-xs font-bold text-red-500">Isu ditemukan</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Cek log detail di bawah</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Logs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex flex-wrap items-center justify-between bg-white">
            <h3 className="font-bold text-gray-800">Riwayat Sinkronisasi Terbaru</h3>
            <button 
              onClick={() => setShowAllLogs(!showAllLogs)}
              className="text-sm font-bold text-[#1A3D63] hover:underline"
            >
              {showAllLogs ? "Sembunyikan" : "Lihat Semua"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Modul</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">Hari ini, 08:32</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-600">Data Guru</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Berhasil
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">112/112 records synced</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">Hari ini, 08:30</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-600">Data Siswa</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Berhasil
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">1,248/1,248 records synced</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">Kemarin, 23:00</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-600">Jadwal Pelajaran</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-600 border border-red-100">
                      Gagal
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-red-500 font-medium">API Timeout (Code 504)</td>
                </tr>
                {showAllLogs && (
                  <>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">Kemarin, 14:15</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-600">Data Tagihan SPP</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Berhasil
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">890/890 records synced</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">Kemarin, 08:30</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-600">Data Siswa</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          Peringatan
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-amber-600 font-medium">12 NIK tidak valid</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">3 Hari lalu</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-600">Data Guru</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Berhasil
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">112/112 records synced</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Connection Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-6">Status Koneksi API</h3>
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-[#1A3D63]">D</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Dapodik Pusat</p>
                  <p className="text-xs text-emerald-500 font-bold mt-0.5">Terhubung</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-green-600">E</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">EMIS Kemenag</p>
                  <p className="text-xs text-amber-500 font-bold mt-0.5">Menunggu Setup</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            </div>

            <div className="flex flex-wrap items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-blue-500">B</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Bank Gateway</p>
                  <p className="text-xs text-emerald-500 font-bold mt-0.5">Terhubung</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl transition-colors">
            Konfigurasi API
          </button>
        </div>

      </div>
    </div>
  );
};

export default LaporanIntegrasi;
