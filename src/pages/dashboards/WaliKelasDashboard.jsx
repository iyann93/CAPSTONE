import React from "react";
import WaliKelasHome from "./WaliKelasHome";
import MonitoringSPPWaliKelas from "./MonitoringSPPWaliKelas";
import SlipGajiWaliKelas from "./SlipGajiWaliKelas";
import RiwayatGajiWaliKelas from "./RiwayatGajiWaliKelas";
import PlaceholderDashboard from "./PlaceholderDashboard";
import Profile from "../Profile";

const WaliKelasDashboard = ({ user, activeMenu, onViewChange }) => {
  const [selectedSalary, setSelectedSalary] = React.useState(null);

  const handleNavigate = (menu, data = null) => {
    if (data) setSelectedSalary(data);
    if (onViewChange) {
      onViewChange(menu);
    }
  };

  switch (activeMenu) {
    case "Dashboard":
      return <WaliKelasHome user={user} onNavigate={handleNavigate} />;
      
    case "Monitoring SPP Siswa":
      return <MonitoringSPPWaliKelas user={user} />;
      
    case "Slip Gaji":
      return <SlipGajiWaliKelas user={user} />;
      
    case "Detail Slip Gaji":
      return <SlipGajiWaliKelas user={user} onNavigate={handleNavigate} defaultData={selectedSalary} />;
      
    case "Riwayat Terima Gaji":
      return <RiwayatGajiWaliKelas user={user} onNavigate={handleNavigate} />;
      
    case "My Profile":
      return <Profile user={user} onUpdateProfile={(newProfile) => console.log('Profile updated', newProfile)} />;
      
    default:
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }
};

export default WaliKelasDashboard;
