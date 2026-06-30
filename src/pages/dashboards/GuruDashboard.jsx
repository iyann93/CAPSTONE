import React from "react";
import GuruHome from "./GuruHome";
import GuruRiwayatTerimaGaji from "../../components/payroll/GuruRiwayatTerimaGaji";
import JadwalGuruMapel from "./JadwalGuruMapel";
import JadwalMengajar from "./JadwalMengajar";
import InputNilai from "./InputNilai";
import AbsensiSiswa from "./AbsensiSiswa";
import RekapAbsensiSiswa from "./RekapAbsensiSiswa";
import CatatanSiswa from "./CatatanSiswa";
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

    case "Riwayat Terima Gaji":
      return <GuruRiwayatTerimaGaji user={user} />;

    case "My Profile":
      return <Profile user={user} onUpdateProfile={(newProfile) => console.log("Profile updated", newProfile)} />;

    default:
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }
};

export default GuruDashboard;
