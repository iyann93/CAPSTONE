import React from "react";
import Profile from "../Profile";
import OrangTuaHome from "./OrangTuaHome";
import AkademikSiswa from "./AkademikSiswa";
import RaporSiswa from "./RaporSiswa";
import TagihanSPP from "./TagihanSPP";
import RiwayatPembayaranSiswa from "./RiwayatPembayaranSiswa";
import BeasiswaSiswa from "./BeasiswaSiswa";
import PengumumanSekolah from "./PengumumanSekolah";
import PlaceholderDashboard from "./PlaceholderDashboard";

const OrangTuaDashboard = ({ user, activeMenu, onViewChange }) => {
  const handleNavigate = (menuName) => {
    if (onViewChange) {
      onViewChange(menuName);
    }
  };

  switch (activeMenu) {
    case "Dashboard":
      return <OrangTuaHome user={user} onNavigate={handleNavigate} />;
    
    case "Perkembangan Akademik":
      return <AkademikSiswa user={user} />;
    
    case "Unduh Rapor":
      return <RaporSiswa user={user} />;
    
    case "Tagihan SPP":
      return <TagihanSPP user={user} onNavigate={handleNavigate} />;
    
    case "Riwayat Pembayaran":
      return <RiwayatPembayaranSiswa user={user} onNavigate={handleNavigate} />;
    
    case "Beasiswa":
      return <BeasiswaSiswa user={user} />;
    
    case "Pengumuman Sekolah":
      return <PengumumanSekolah user={user} />;

    case "My Profile":
      return <Profile user={user} />;

    default:
      if (activeMenu !== "Dashboard") {
        return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
      }
      return <OrangTuaHome user={user} onNavigate={handleNavigate} />;
  }
};

export default OrangTuaDashboard;
