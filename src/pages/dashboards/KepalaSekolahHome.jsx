import React, { useState, useEffect, useCallback } from "react";
import StatCard from "../../components/StatCard";
import { getPembayaran, getDanaBeasiswa, getBeasiswa, getOperasional } from "../../api/finance";
import { getAllSlips } from "../../api/payroll";

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

const WalletIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h5v4h-5z" />
  </svg>
);

const BULAN_NAMES = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

const formatCurrencySingkat = (amount) => {
  if (amount >= 1000000000) return "Rp " + (amount / 1000000000).toFixed(2) + " M";
  if (amount >= 1000000) return "Rp " + Math.round(amount / 1000000) + " Jt";
  if (amount >= 1000) return "Rp " + Math.round(amount / 1000) + " Rb";
  return "Rp " + amount.toLocaleString("id-ID");
};

const KepalaSekolahHome = ({ user, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
  };

  const [keuangan, setKeuangan] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    saldo: 0
  });
  const [isLoadingKeuangan, setIsLoadingKeuangan] = useState(true);

  const loadKeuangan = useCallback(async () => {
    setIsLoadingKeuangan(true);
    try {
      const [pembayaran, slipsRes, dana, beasiswa, operasional] = await Promise.all([
        getPembayaran().catch(() => []),
        getAllSlips({ limit: 1000, status: "dibayar" }).catch(() => ({ data: [] })),
        getDanaBeasiswa().catch(() => []),
        getBeasiswa().catch(() => []),
        getOperasional().catch(() => [])
      ]);

      const pembayaranArr = Array.isArray(pembayaran) ? pembayaran : [];
      const slipsArr = slipsRes?.data || [];
      const danaArr = Array.isArray(dana) ? dana : [];
      const beasiswaArr = Array.isArray(beasiswa) ? beasiswa : [];
      const operasionalArr = Array.isArray(operasional) ? operasional : [];

      // ── Pemasukan ────────────────────────────────────────────────────────
      const sppIncome = pembayaranArr.reduce((acc, p) => acc + (Number(p.jumlah_bayar) || 0), 0);
      const otherIncome = operasionalArr.filter(o => o.tipe === 'pemasukan').reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
      const beasiswaIncome = danaArr.reduce((acc, d) => acc + (Number(d.nominal) || 0), 0);
      const totalPemasukan = sppIncome + otherIncome + beasiswaIncome;

      // ── Pengeluaran ──────────────────────────────────────────────────────
      const payrollExpense = slipsArr.reduce((acc, s) => acc + (Number(s.gaji_bersih) || 0), 0);
      const operationalExpense = operasionalArr.filter(o => o.tipe === 'pengeluaran').reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
      const beasiswaDisbursed = beasiswaArr.reduce((acc, b) => acc + (Number(b.nominal) || 0), 0);
      const totalPengeluaran = payrollExpense + operationalExpense + beasiswaDisbursed;

      setKeuangan({
        pemasukan: totalPemasukan,
        pengeluaran: totalPengeluaran,
        saldo: totalPemasukan - totalPengeluaran
      });
    } catch (e) {
      console.error("KepalaSekolahHome loadKeuangan:", e);
    } finally {
      setIsLoadingKeuangan(false);
    }
  }, []);

  useEffect(() => {
    loadKeuangan();
  }, [loadKeuangan]);

  // Progress bar widths relative to each other
  const maxKeuangan = Math.max(keuangan.pemasukan, keuangan.pengeluaran, 1);
  const pemasukanPct = Math.round((keuangan.pemasukan / maxKeuangan) * 100);
  const pengeluaranPct = Math.round((keuangan.pengeluaran / maxKeuangan) * 100);

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
            title="Pengajuan Kurikulum"
            value="3"
            subtitle="Menunggu persetujuan"
            icon={<BookOpenIcon />}
            iconBg="#fff3cd"
            iconColor="#856404"
          />
        </div>
        <div className="animate-fadeIn cursor-pointer" onClick={() => onNavigate("Validasi Kelulusan")} style={{ animationDelay: "80ms" }}>
          <StatCard
            title="Calon Lulusan"
            value="120"
            subtitle="Siswa perlu divalidasi"
            icon={<GraduationIcon />}
            iconBg="#e0effe"
            iconColor="#1B3B5F"
          />
        </div>
        <div className="animate-fadeIn cursor-pointer" onClick={() => onNavigate("Monitoring Siswa")} style={{ animationDelay: "160ms" }}>
          <StatCard
            title="Total Siswa"
            value="1,248"
            subtitle="Siswa Aktif"
            icon={<UsersIcon />}
            iconBg="#e0f2fe"
            iconColor="#0ea5e9"
          />
        </div>
        <div className="animate-fadeIn cursor-pointer" onClick={() => onNavigate("Monitoring Keuangan")} style={{ animationDelay: "240ms" }}>
          <StatCard
            title="Saldo Keuangan"
            value={isLoadingKeuangan ? "..." : formatCurrencySingkat(Math.max(0, keuangan.saldo))}
            subtitle="Total Arus Kas Aktif"
            icon={<WalletIcon />}
            iconBg="#ecfdf5"
            iconColor="#10b981"
          />
        </div>
      </div>

      {/* Quick Actions / Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {/* Ringkasan Arus Kas */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-between animate-fadeIn" style={{ animationDelay: "320ms" }}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-[16px] font-bold text-gray-800">Ringkasan Arus Kas</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">Pemantauan singkat kondisi keuangan keseluruhan</p>
              </div>
              <span className="text-[10px] font-bold bg-green-50 text-green-600 px-3 py-1.5 rounded-lg tracking-wider uppercase border border-green-100">
                REAL-TIME
              </span>
            </div>
            
            {isLoadingKeuangan ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-[13px] text-gray-400">Memuat data keuangan...</span>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[13px] font-medium text-gray-500 mb-2">
                    <span>Pemasukan</span>
                    <span className="text-gray-800 font-black">{formatCurrencySingkat(keuangan.pemasukan)}</span>
                  </div>
                  <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100">
                    <div className="bg-[#1A3D63] h-full rounded-full transition-all duration-700" style={{ width: `${pemasukanPct}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-[13px] font-medium text-gray-500 mb-2">
                    <span>Pengeluaran</span>
                    <span className="text-gray-800 font-black">{formatCurrencySingkat(keuangan.pengeluaran)}</span>
                  </div>
                  <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100">
                    <div className="bg-[#e11d48] h-full rounded-full transition-all duration-700" style={{ width: `${pengeluaranPct}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => onNavigate("Monitoring Keuangan")}
            className="mt-8 w-full py-3 rounded-xl border-2 border-gray-100 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:text-[#1A3D63] transition-all cursor-pointer shadow-sm tracking-wider uppercase"
          >
            Lihat Detail Keuangan
          </button>
        </div>

        {/* Agenda & Perhatian Khusus */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-between animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <div>
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-gray-800">Perlu Ditindaklanjuti</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">Tugas persetujuan dan validasi yang tertunda</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-50 hover:bg-amber-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-100">
                  <BookOpenIcon />
                </div>
                <div className="pt-0.5">
                  <h4 className="text-[13px] font-bold text-gray-800">3 Pengajuan Kurikulum</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Rencana pembelajaran semester ganjil dari Wakil Kepala Sekolah menunggu persetujuan Kepala Sekolah.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-50 hover:bg-blue-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <GraduationIcon />
                </div>
                <div className="pt-0.5">
                  <h4 className="text-[13px] font-bold text-gray-800">120 Calon Lulusan</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Verifikasi dokumen kelulusan siswa tingkat akhir (Kelas IX) tahun ajaran 2024/2025.</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("Persetujuan Kurikulum")}
            className="mt-8 w-full py-3 rounded-xl bg-[#1A3D63] text-[12px] font-bold text-white hover:bg-[#122c4a] transition-all cursor-pointer shadow-md tracking-wider uppercase"
          >
            Tindak Lanjuti Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default KepalaSekolahHome;
