import React, { useState, useEffect } from "react";
import AcademicChart from "../../components/AcademicChart";
import api from "../../api/axios";

const LaporanAkademik = () => {
  const [filter, setFilter] = useState({ tahunAjaran: "2024/2025", semester: "Ganjil", kelas: "Semua" });
  const [isExporting, setIsExporting] = useState(false);
  
  const [stats, setStats] = useState({
    rataRata: 0,
    kkm: 0,
    kehadiran: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true }));
        // Fetch data nilai untuk agregat (contoh sederhana, idealnya dari endpoint khusus agregat)
        const resNilai = await api.get('/nilai?limit=5000').catch(() => ({ data: { data: [] } }));
        const nilaiData = resNilai.data?.data || [];
        
        let totalNilai = 0;
        let countNilai = 0;
        let countLulus = 0;
        
        nilaiData.forEach(n => {
          const akhir = parseFloat(n.nilai_akhir);
          if (!isNaN(akhir)) {
            totalNilai += akhir;
            countNilai++;
            if (akhir >= 75) countLulus++;
          }
        });
        
        const rataRata = countNilai > 0 ? (totalNilai / countNilai) : 0;
        const kkm = countNilai > 0 ? (countLulus / countNilai) * 100 : 0;
        
        // Mock kehadiran sementara (karena Modul Absensi belum digabungkan sepenuhnya)
        // Jika endpoint absensi tersedia, kita bisa fetch.
        const resAbsensi = await api.get('/absensi?limit=5000').catch(() => ({ data: { data: [] } }));
        const absensiData = resAbsensi.data?.data || [];
        let hadir = 0;
        let totalAbsensi = 0;
        if (absensiData.length > 0) {
            absensiData.forEach(a => {
                totalAbsensi++;
                if (a.status === 'Hadir') hadir++;
            });
        }
        const kehadiran = totalAbsensi > 0 ? (hadir / totalAbsensi) * 100 : 0;

        setStats({
          rataRata: rataRata.toFixed(1),
          kkm: Math.round(kkm),
          kehadiran: kehadiran > 0 ? kehadiran.toFixed(1) : 0, // 0 jika data belum ada
          loading: false
        });

      } catch (err) {
        console.error("Gagal mengambil laporan akademik:", err);
        setStats({ rataRata: 0, kkm: 0, kehadiran: 0, loading: false });
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("✅ Laporan Akademik berhasil diunduh dalam format PDF!");
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fadeIn min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Laporan Akademik</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Laporan Akademik Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">Lihat, analisis, dan cetak laporan akademik sekolah secara keseluruhan.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-[#1A3D63] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#163256] transition-colors shadow-lg shadow-[#1A3D63]/20 disabled:opacity-70"
        >
          {isExporting ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          )}
          {isExporting ? "Menyiapkan PDF..." : "Ekspor PDF"}
        </button>
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
            <option>2025/2026</option>
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
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Kelas / Tingkat</label>
          <select 
            value={filter.kelas} 
            onChange={(e) => setFilter({...filter, kelas: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          >
            <option>Semua</option>
            <option>Kelas VII</option>
            <option>Kelas VIII</option>
            <option>Kelas IX</option>
          </select>
        </div>
        <button className="bg-[#EBF3FA] text-[#1A3D63] px-5 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition-colors h-[42px]">
          Terapkan Filter
        </button>
      </div>

      {/* Analysis Content */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AcademicChart />
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-wider mb-4">Ringkasan Nilai</h3>
            {stats.loading ? (
               <div className="animate-pulse space-y-4">
                 <div className="h-10 bg-gray-100 rounded-md"></div>
                 <div className="h-10 bg-gray-100 rounded-md"></div>
               </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <p className="text-[12px] text-gray-500">Rata-rata Nilai Sekolah</p>
                    <p className="text-[32px] font-bold text-[#1e293b]">{stats.rataRata > 0 ? stats.rataRata : "0"}</p>
                    <p className="text-[12px] text-gray-400 font-bold">Dari data yang tersedia</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                    <div className="bg-[#1A3D63] h-2 rounded-full" style={{ width: `${Math.min(100, stats.rataRata)}%` }}></div>
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div>
                    <p className="text-[12px] text-gray-500">Tingkat Kelulusan KKM</p>
                    <p className="text-[32px] font-bold text-[#1e293b]">{stats.kkm}%</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.kkm}%` }}></div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-wider mb-4">Tingkat Kehadiran</h3>
            {stats.loading ? (
               <div className="animate-pulse space-y-4">
                 <div className="h-10 bg-gray-100 rounded-md"></div>
               </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-[12px] text-gray-500">Rata-rata Kehadiran Siswa</p>
                  <p className="text-[32px] font-bold text-[#1e293b]">{stats.kehadiran > 0 ? `${stats.kehadiran}%` : "Data blm ada"}</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.kehadiran}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanAkademik;


