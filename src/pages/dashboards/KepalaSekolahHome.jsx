import React from "react";
import StatCard from "../../components/StatCard";

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

const KepalaSekolahHome = ({ user, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
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
            title="Tunggakan SPP"
            value="Rp 12.5M"
            subtitle="Belum dibayar bulan ini"
            icon={<ReceiptIcon />}
            iconBg="#ffe4e6"
            iconColor="#e11d48"
          />
        </div>
      </div>
      
      {/* Additional Overview widgets could go here */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[18px] font-bold text-[#1e293b] mb-4">Aktivitas Terbaru</h3>
        <p className="text-[14px] text-gray-500">Belum ada aktivitas terbaru yang tercatat hari ini.</p>
      </div>
    </div>
  );
};

export default KepalaSekolahHome;
