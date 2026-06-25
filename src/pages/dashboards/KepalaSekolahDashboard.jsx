import React from "react";
import KepalaSekolahHome from "./KepalaSekolahHome";
import PersetujuanKurikulum from "./PersetujuanKurikulum";
import ValidasiKelulusan from "./ValidasiKelulusan";
import LaporanAkademik from "./LaporanAkademik";
import MonitoringSiswaKepsek from "./MonitoringSiswaKepsek";
import MonitoringKeuanganKepsek from "./MonitoringKeuanganKepsek";
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
      return <MonitoringKeuanganKepsek user={user} />;
      
    default:
      if (activeMenu !== "Dashboard" && activeMenu) {
        return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
      }
      return <KepalaSekolahHome user={user} onNavigate={handleNavigate} />;
  }
};

export default KepalaSekolahDashboard;
