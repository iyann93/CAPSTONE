import React from "react";
import WaliKelasHome from "./WaliKelasHome";

import GuruRiwayatTerimaGaji from "../../components/payroll/GuruRiwayatTerimaGaji";
import PlaceholderDashboard from "./PlaceholderDashboard";
import Profile from "../Profile";

const WaliKelasDashboard = ({ user, activeMenu, onViewChange }) => {
  const handleNavigate = (menu) => {
    if (onViewChange) {
      onViewChange(menu);
    }
  };

  switch (activeMenu) {
    case "Dashboard":
      return <WaliKelasHome user={user} onNavigate={handleNavigate} />;
      

    case "Riwayat Terima Gaji":
      return <GuruRiwayatTerimaGaji user={user} />;
      
    case "My Profile":
      return <Profile user={user} onUpdateProfile={(newProfile) => console.log('Profile updated', newProfile)} />;
      
    default:
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }
};

export default WaliKelasDashboard;
