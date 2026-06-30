import React from "react";
import GuruHome from "./GuruHome";
import SlipGajiGuruMapel from "./SlipGajiGuruMapel";
import RiwayatGajiGuruMapel from "./RiwayatGajiGuruMapel";
import JadwalGuruMapel from "./JadwalGuruMapel";
import JadwalMengajar from "./JadwalMengajar";
import InputNilai from "./InputNilai";
import AbsensiSiswa from "./AbsensiSiswa";
import RekapAbsensiSiswa from "./RekapAbsensiSiswa";
import CatatanSiswa from "./CatatanSiswa";
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

    case "Jadwal Mengajar":
    case "Jadwal Seluruhnya":
      return <JadwalMengajar user={user} />;

    case "Input Nilai":
      return <InputNilai user={user} />;

    case "Absensi Siswa":
      return <AbsensiSiswa user={user} />;

    case "Rekap Absensi Siswa":
      return <RekapAbsensiSiswa user={user} />;

    case "Catatan Siswa":
      return <CatatanSiswa user={user} />;

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
