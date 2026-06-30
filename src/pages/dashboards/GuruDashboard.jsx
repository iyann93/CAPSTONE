import React from "react";
import GuruHome from "./GuruHome";
import GuruRiwayatTerimaGaji from "../../components/payroll/GuruRiwayatTerimaGaji";
import JadwalGuruMapel from "./JadwalGuruMapel";
import PlaceholderDashboard from "./PlaceholderDashboard";
import Profile from "../Profile";

const GuruDashboard = ({ user, activeMenu, onViewChange }) => {
  const handleNavigate = (menu) => {
    if (onViewChange) {
      onViewChange(menu);
    }
  };

  switch (activeMenu) {
    case "Dashboard":
      return <GuruHome user={user} onNavigate={handleNavigate} />;

    case "Jadwal Seluruhnya":
      return <JadwalGuruMapel user={user} onNavigate={handleNavigate} />;

    case "Riwayat Terima Gaji":
      return <GuruRiwayatTerimaGaji user={user} />;

    case "My Profile":
      return <Profile user={user} onUpdateProfile={(newProfile) => console.log("Profile updated", newProfile)} />;

    default:
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }
};

export default GuruDashboard;
