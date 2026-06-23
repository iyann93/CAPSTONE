import React from "react";
import OrangTuaHome from "./OrangTuaHome";
import AkademikSiswa from "./AkademikSiswa";
import RaporSiswa from "./RaporSiswa";
import TagihanSPP from "./TagihanSPP";
import BayarSPP from "./BayarSPP";
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
      return <AkademikSiswa />;
    
    case "Unduh Rapor":
      return <RaporSiswa />;
    
    case "Tagihan SPP":
      return <TagihanSPP onNavigate={handleNavigate} />;
    
    case "Bayar SPP":
      return <BayarSPP onNavigate={handleNavigate} />;
    
    case "Pengumuman Sekolah":
      return <PengumumanSekolah />;

    default:
      if (activeMenu !== "Dashboard") {
        return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
      }
      return <OrangTuaHome user={user} onNavigate={handleNavigate} />;
  }
};

export default OrangTuaDashboard;
