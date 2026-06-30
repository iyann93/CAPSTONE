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
  // Shared attendance sessions state — flows from AbsensiSiswa → RekapAbsensiSiswa
  const [attendanceSessions, setAttendanceSessions] = React.useState([]);

  const handleNavigate = (menu) => {
    if (onViewChange) {
      onViewChange(menu);
    }
  };

  // Called by AbsensiSiswa when teacher clicks "Simpan Absensi"
  const handleSaveAttendance = (sessionData) => {
    setAttendanceSessions((prev) => {
      // Replace existing session for same class + date, or add new one
      const idx = prev.findIndex(
        (s) => s.attendanceClass === sessionData.attendanceClass && s.date === sessionData.date
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = sessionData;
        return updated;
      }
      return [...prev, sessionData];
    });
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
      return <AbsensiSiswa user={user} onSaveAttendance={handleSaveAttendance} />;

    case "Rekap Absensi Siswa":
      return <RekapAbsensiSiswa user={user} attendanceSessions={attendanceSessions} />;

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

