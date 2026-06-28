import React from "react";
import GuruHome from "./GuruHome";
import SlipGajiGuruMapel from "./SlipGajiGuruMapel";
import RiwayatGajiGuruMapel from "./RiwayatGajiGuruMapel";
import JadwalGuruMapel from "./JadwalGuruMapel";
import PlaceholderDashboard from "./PlaceholderDashboard";
import Profile from "../Profile";

const GuruDashboard = ({ user, activeMenu, onViewChange }) => {
  const [selectedSalary, setSelectedSalary] = React.useState(null);

  const handleNavigate = (menu, data = null) => {
    if (data) setSelectedSalary(data);
    if (onViewChange) {
      onViewChange(menu);
    }
  };

  switch (activeMenu) {
    case "Dashboard":
      return <GuruHome user={user} onNavigate={handleNavigate} />;

    case "Jadwal Seluruhnya":
      return <JadwalGuruMapel user={user} onNavigate={handleNavigate} />;

    case "Slip Gaji":
      return <SlipGajiGuruMapel user={user} />;

    case "Detail Slip Gaji":
      return <SlipGajiGuruMapel user={user} onNavigate={handleNavigate} defaultData={selectedSalary} />;

    case "Riwayat Terima Gaji":
      return <RiwayatGajiGuruMapel user={user} onNavigate={handleNavigate} />;

    case "My Profile":
      return <Profile user={user} onUpdateProfile={(newProfile) => console.log("Profile updated", newProfile)} />;

    default:
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }
};

export default GuruDashboard;
