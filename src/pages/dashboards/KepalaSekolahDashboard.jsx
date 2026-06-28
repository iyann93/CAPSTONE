import React from "react";
import Profile from "../Profile";
import KepalaSekolahHome from "./KepalaSekolahHome";
import PersetujuanKurikulum from "./PersetujuanKurikulum";
import ValidasiKelulusan from "./ValidasiKelulusan";
import LaporanAkademik from "./LaporanAkademik";
import MonitoringSiswaKepsek from "./MonitoringSiswaKepsek";
import MonitoringKeuanganKepsek from "./MonitoringKeuanganKepsek";
import LogAktivitasKepsek from "./LogAktivitasKepsek";
import LaporanHarianKepsek from "./LaporanHarianKepsek";
import PlaceholderDashboard from "./PlaceholderDashboard";

const KepalaSekolahDashboard = ({ user, activeMenu, onViewChange }) => {
  const handleNavigate = (menuName) => {
    if (onViewChange) {
      onViewChange(menuName);
    }
  };

  switch (activeMenu) {
    case "Dashboard":
      return <KepalaSekolahHome user={user} onNavigate={handleNavigate} />;
    case "Persetujuan Kurikulum":
      return <PersetujuanKurikulum user={user} />;
    case "Validasi Kelulusan":
      return <ValidasiKelulusan user={user} />;
    case "Laporan Akademik":
      return <LaporanAkademik user={user} />;
    case "Monitoring Siswa":
      return <MonitoringSiswaKepsek user={user} />;
    case "Monitoring Keuangan":
      return <MonitoringKeuanganKepsek user={user} onNavigate={handleNavigate} />;
    case "Log Aktivitas":
      return <LogAktivitasKepsek user={user} onNavigate={handleNavigate} />;
    case "Laporan Harian":
      return <LaporanHarianKepsek user={user} onNavigate={handleNavigate} />;
    case "My Profile":
      return <Profile user={user} />;
      
    default:
      if (activeMenu !== "Dashboard" && activeMenu) {
        return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
      }
      return <KepalaSekolahHome user={user} onNavigate={handleNavigate} />;
  }
};

export default KepalaSekolahDashboard;
