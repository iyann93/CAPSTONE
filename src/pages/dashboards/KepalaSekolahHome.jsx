import React, { useState, useEffect } from "react";
import StatCard from "../../components/StatCard";
import { getGlobalFinanceSummary } from "../../utils/financeHelpers";

const UsersIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const GraduationIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M22 10L12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
    <path d="M12 7v5M9 15h6" />
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h5v4h-5z" />
  </svg>
);

const KepalaSekolahHome = ({ user, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
  };
  const [financialData, setFinancialData] = useState({
    pemasukanBulanIni: 0,
    pengeluaranBulanIni: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0
  });

  const [stats, setStats] = useState({
    total_siswa: "...",
    total_guru: "...",
    total_kelas: "...",
    calon_lulusan: "..."
  });

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const summary = await getGlobalFinanceSummary();
        setFinancialData(summary);
      } catch (err) {
        console.error("Gagal mengambil data global finance:", err);
      }
    };
    
    const fetchStats = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const res = await api.get('/dashboard/kepsek/stats');
        setStats(res.data?.data || {
          total_siswa: 0,
          total_guru: 0,
          total_kelas: 0,
          calon_lulusan: 0
        });
      } catch (err) {
        console.error("Gagal mengambil data statistik kepsek:", err);
      }
    };
    
    fetchFinance();
    fetchStats();
  }, []);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatShortRupiah = (value) => {
    return formatRupiah(value);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6 md:gap-8 overflow-y-auto animate-fadeIn min-h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] md:text-[28px] font-bold text-gray-800 tracking-tight">
            {getGreeting()}, {user?.nama ? user.nama.split(" ")[0] : "Kepala Sekolah"}!
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">
            Berikut ringkasan performa akademik dan operasional sekolah saat ini.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fadeIn cursor-pointer" onClick={() => onNavigate("Persetujuan Kurikulum")} style={{ animationDelay: "0ms" }}>
          <StatCard
            title="Total Guru"
            value={stats.total_guru.toLocaleString('id-ID')}
            subtitle="Tenaga Pendidik Aktif"
            icon={<UsersIcon />}
            iconBg="#fff3cd"
            iconColor="#856404"
          />
        </div>
        <div className="animate-fadeIn cursor-pointer" onClick={() => onNavigate("Validasi Kelulusan")} style={{ animationDelay: "80ms" }}>
          <StatCard
            title="Calon Lulusan"
            value={stats.calon_lulusan.toLocaleString('id-ID')}
            subtitle="Siswa Kelas IX"
            icon={<GraduationIcon />}
            iconBg="#e0effe"
            iconColor="#1B3B5F"
          />
        </div>
        <div className="animate-fadeIn cursor-pointer" onClick={() => onNavigate("Monitoring Siswa")} style={{ animationDelay: "160ms" }}>
          <StatCard
            title="Total Siswa"
            value={stats.total_siswa.toLocaleString('id-ID')}
            subtitle="Siswa Aktif"
            icon={<UsersIcon />}
            iconBg="#e0f2fe"
            iconColor="#0ea5e9"
          />
        </div>
        <div className="animate-fadeIn cursor-pointer" onClick={() => onNavigate("Data Kelas")} style={{ animationDelay: "240ms" }}>
          <StatCard
            title="Total Kelas"
            value={stats.total_kelas.toLocaleString('id-ID')}
            subtitle="Kelas Aktif"
            icon={<BookOpenIcon />}
            iconBg="#ecfdf5"
            iconColor="#10b981"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {/* Ringkasan Arus Kas */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-between animate-fadeIn" style={{ animationDelay: "320ms" }}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-[16px] font-bold text-gray-800">Ringkasan Arus Kas</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">Total akumulasi keuangan sekolah</p>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg tracking-wider uppercase border border-blue-100">
                TAHUNAN
              </span>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[13px] font-medium text-gray-500 mb-2">
                  <span>Total Pemasukan</span>
                  <span className="text-gray-800 font-black">{formatShortRupiah(financialData.totalPemasukan)}</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100">
                  <div className="bg-[#1A3D63] h-full rounded-full" style={{ width: financialData.totalPemasukan > 0 ? '100%' : '0%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[13px] font-medium text-gray-500 mb-2">
                  <span>Total Pengeluaran</span>
                  <span className="text-gray-800 font-black">{formatShortRupiah(financialData.totalPengeluaran)}</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100">
                  <div className="bg-[#e11d48] h-full rounded-full" style={{ width: financialData.totalPemasukan > 0 ? `${Math.min((financialData.totalPengeluaran / financialData.totalPemasukan) * 100, 100)}%` : '0%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[13px] font-medium text-gray-500 mb-2">
                  <span>Sisa Saldo Keuangan</span>
                  <span className="text-gray-800 font-black">{formatShortRupiah(financialData.totalPemasukan - financialData.totalPengeluaran)}</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: financialData.totalPemasukan > 0 ? `${Math.max(0, ((financialData.totalPemasukan - financialData.totalPengeluaran) / financialData.totalPemasukan) * 100)}%` : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate("Monitoring Keuangan")}
            className="mt-8 w-full py-3 rounded-xl border-2 border-gray-100 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:text-[#1A3D63] transition-all cursor-pointer shadow-sm tracking-wider uppercase"
          >
            Lihat Detail Keuangan
          </button>
        </div>

      </div>
    </div>
  );
};

export default KepalaSekolahHome;


