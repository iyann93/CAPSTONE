import React, { useState } from "react";
import WaliKelasHome from "./WaliKelasHome";
import GuruRiwayatTerimaGaji from "../../components/payroll/GuruRiwayatTerimaGaji";
import SlipGajiWaliKelas from "./SlipGajiWaliKelas";
import MonitoringSPPWaliKelas from "./MonitoringSPPWaliKelas";
import JadwalMengajar from "./JadwalMengajar";
import JadwalKelasWali from "./JadwalKelasWali";
import InputNilai from "./InputNilai";
import AbsensiSiswa from "./AbsensiSiswa";
import RekapAbsensiSiswa from "./RekapAbsensiSiswa";
import CatatanSiswa from "./CatatanSiswa";
import DataSiswaKelasWali from "./DataSiswaKelasWali";
import GenerateRaporWali from "./GenerateRaporWali";
import PlaceholderDashboard from "./PlaceholderDashboard";
import Profile from "../Profile";

const WaliKelasDashboard = ({ user, activeMenu, onViewChange }) => {
  // Shared attendance sessions state
  const [attendanceSessions, setAttendanceSessions] = useState([
    {
      attendanceClass: "VII A",
      date: "2026-06-30",
      students: [
        { id: "2023001", name: "Andi Pratama", gender: "Laki-laki", status: "Hadir", avatarBg: "bg-blue-500" },
        { id: "2023002", name: "Dewi Sartika", gender: "Perempuan", status: "Hadir", avatarBg: "bg-slate-700" },
        { id: "2023003", name: "Ricky Firmansyah", gender: "Laki-laki", status: "Sakit", avatarBg: "bg-amber-600" },
        { id: "2023004", name: "Nurul Hidayah", gender: "Perempuan", status: "Hadir", avatarBg: "bg-red-500" },
        { id: "2023005", name: "Fajar Setiawan", gender: "Laki-laki", status: "Izin", avatarBg: "bg-purple-600" },
        { id: "2023006", name: "Ayu Lestari", gender: "Perempuan", status: "Hadir", avatarBg: "bg-pink-500" },
      ]
    }
  ]);

  const handleSaveAttendance = (sessionData) => {
    setAttendanceSessions((prev) => {
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

  const handleNavigate = (menu) => {
    if (onViewChange) {
      onViewChange(menu);
    }
  };

  switch (activeMenu) {
    case "Dashboard":
      return <WaliKelasHome user={user} onNavigate={handleNavigate} />;
      
    case "Monitoring SPP Siswa":
      return <MonitoringSPPWaliKelas />;
      
    case "Jadwal Mengajar":
      return <JadwalMengajar user={user} />;
      
    case "Data Siswa Kelas":
      return <DataSiswaKelasWali user={user} />;
      
    case "Rapor Siswa":
      return <GenerateRaporWali user={user} />;
      
    case "Jadwal Kelas":
      return <JadwalKelasWali user={user} />;
      
    case "Input Nilai":
      return <InputNilai user={user} />;
      
    case "Absensi Siswa":
      return <AbsensiSiswa user={user} onSaveAttendance={handleSaveAttendance} />;
      
    case "Rekap Absensi Siswa":
      return <RekapAbsensiSiswa user={user} attendanceSessions={attendanceSessions} />;
      
    case "Catatan Siswa":
      return <CatatanSiswa user={user} />;

    case "Slip Gaji":
      return <SlipGajiWaliKelas user={user} />;
      
    case "Riwayat Terima Gaji":
      return <GuruRiwayatTerimaGaji user={user} />;
      
    case "My Profile":
      return <Profile user={user} onUpdateProfile={(newProfile) => console.log('Profile updated', newProfile)} />;
      
    default:
      return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }
};

export default WaliKelasDashboard;

