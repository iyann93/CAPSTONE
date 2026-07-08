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
  const [attendanceSessions, setAttendanceSessions] = React.useState([
    {
      attendanceClass: "VII IPA 1",
      date: "2026-06-30",
      students: [
        { id: "2023001", name: "Andi Pratama", gender: "Laki-laki", status: "Hadir", avatarBg: "bg-blue-500" },
        { id: "2023002", name: "Dewi Sartika", gender: "Perempuan", status: "Hadir", avatarBg: "bg-slate-700" },
        { id: "2023003", name: "Ricky Firmansyah", gender: "Laki-laki", status: "Sakit", avatarBg: "bg-amber-600" },
        { id: "2023004", name: "Nurul Hidayah", gender: "Perempuan", status: "Hadir", avatarBg: "bg-red-500" },
        { id: "2023005", name: "Fajar Setiawan", gender: "Laki-laki", status: "Izin", avatarBg: "bg-purple-600" },
        { id: "2023006", name: "Ayu Lestari", gender: "Perempuan", status: "Hadir", avatarBg: "bg-pink-500" },
      ]
    },
    {
      attendanceClass: "VII IPA 2",
      date: "2026-06-30",
      students: [
        { id: "2023007", name: "Bagus Cahyo", gender: "Laki-laki", status: "Hadir", avatarBg: "bg-blue-500" },
        { id: "2023008", name: "Citra Lestari", gender: "Perempuan", status: "Izin", avatarBg: "bg-pink-500" },
        { id: "2023009", name: "Dimas Anggara", gender: "Laki-laki", status: "Sakit", avatarBg: "bg-amber-600" },
      ]
    }
  ]);

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
      return <AbsensiSiswa user={user} onSaveAttendance={handleSaveAttendance} attendanceSessions={attendanceSessions} />;

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



