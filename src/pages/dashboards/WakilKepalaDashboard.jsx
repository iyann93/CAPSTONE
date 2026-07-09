import React from "react";
import Profile from "../Profile";
import WakilKepalaHome from "./WakilKepalaHome";
import WakilKepalaSarpras from "./WakilKepalaSarpras";
import KurikulumWakil from "./KurikulumWakil";
import JadwalPelajaranWakil from "./JadwalPelajaranWakil";
import MonitoringPembayaran from "./MonitoringPembayaran";
import PlaceholderDashboard from "./PlaceholderDashboard";
import GuruRiwayatTerimaGaji from "../../components/payroll/GuruRiwayatTerimaGaji";

const WakilKepalaDashboard = ({ user, activeMenu, onViewChange }) => {
  const handleNavigate = (menuName) => {
    if (onViewChange) onViewChange(menuName);
  };

  switch (activeMenu) {
    case "Dashboard":
      return <WakilKepalaHome user={user} onNavigate={handleNavigate} />;
    case "Kelola Kurikulum":
      return <KurikulumWakil />;
    case "Jadwal Pelajaran":
      return <JadwalPelajaranWakil />;
    case "Monitoring SPP":
    case "Monitoring Pembayaran":
      return <MonitoringPembayaran />;
    case "Sarana & Prasarana":
      return <WakilKepalaSarpras user={user} />;
    case "Monitoring Gaji":
    case "Laporan":
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
    case "My Profile":
      return <Profile user={user} />;
    case "Riwayat Terima Gaji":
      return <GuruRiwayatTerimaGaji user={user} />;
    default:
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }
};

export default WakilKepalaDashboard;


