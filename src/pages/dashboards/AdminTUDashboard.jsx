import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Profile from "../Profile";
import PlaceholderDashboard from "./PlaceholderDashboard";
import Subjects from "./Subjects";
import Semester from "./Semester";
import Classes from "./Classes";
import Schedules from "./Schedules";
import GradePromotion from "./GradePromotion";
import GraduationData from "./GraduationData";
import StudentData from "./StudentData";
import StudentForm from "./StudentForm";
import StudentAttendance from "./StudentAttendance";
import ParentData from "./ParentData";
import EmployeeData from "./EmployeeData";
import api from "../../api/axios";
import GuruRiwayatTerimaGaji from "../../components/payroll/GuruRiwayatTerimaGaji";
import PengumumanSekolah from "./PengumumanSekolah";
import RaporSiswa from "./RaporSiswa";
import StudentDetail from "./StudentDetail";

const AdminTUDashboard = ({ user, activeMenu, onViewChange }) => {
  const [viewMode, setViewMode] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [absensiPct, setAbsensiPct] = useState(null);
  const [totalTidakHadir, setTotalTidakHadir] = useState(0);
  const [totalMapel, setTotalMapel] = useState(0);
  const [totalMapelAktif, setTotalMapelAktif] = useState(0);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, type = "error") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const hasPermission = (menu) => {
    if (menu === "Dashboard" || menu === "My Profile") return true;
    try {
      const perms = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
      const roleId = user?.role?.toLowerCase().replace(/\s+/g, '');
      if (roleId === 'superadmin' || !perms || Object.keys(perms).length === 0) return true;
      const userPerms = perms[roleId];
      if (userPerms && userPerms[menu]) return userPerms[menu].lihat === true;
      return false;
    } catch { return true; }
  };

  const handleViewChange = (menu) => {
    if (hasPermission(menu)) {
      if (onViewChange) onViewChange(menu);
    } else {
      showToast(`Akses ditolak: Anda tidak memiliki izin untuk membuka menu ${menu}.`, "error");
    }
  };

  useEffect(() => {
    if (activeMenu === "Dashboard" || !activeMenu) {
      // ── Absensi dari localStorage ────────────────────────────
      const savedAttendance = localStorage.getItem('attendance_classes');
      if (savedAttendance) {
        try {
          const classes = JSON.parse(savedAttendance);
          const finished = classes.filter(c => c.status === 'Selesai');
          const totalStudentsFinished = finished.reduce((a, c) => a + c.students, 0);
          const totalHadir = finished.reduce((a, c) => a + (c.hadir || 0), 0);
          const totalTidak = finished.reduce((a, c) => a + (c.sakit || 0) + (c.izin || 0) + (c.alpha || 0), 0);
          const pct = totalStudentsFinished > 0
            ? Math.round((totalHadir / totalStudentsFinished) * 100)
            : 0;
          setAbsensiPct(pct);
          setTotalTidakHadir(totalTidak);
        } catch (e) { console.error('Parse attendance error', e); }
      }

      // ── Mata Pelajaran dari localStorage ────────────────────
      const savedSubjects = localStorage.getItem('subjects_data');
      if (savedSubjects) {
        try {
          const subjects = JSON.parse(savedSubjects);
          setTotalMapel(subjects.length);
          setTotalMapelAktif(subjects.filter(s => s.status === 'Aktif').length);
        } catch (e) { console.error('Parse subjects error', e); }
      } else {
        // Default dari data awal Subjects.jsx (12 mapel, 11 aktif)
        setTotalMapel(12);
        setTotalMapelAktif(11);
      }

      // ── Siswa dari API ───────────────────────────────────────
      const fetchDashboardData = async () => {
        try {
          const res = await api.get('/siswa?limit=5');
          if (res.data && res.data.meta) {
            setTotalSiswa(res.data.meta.total);
          }
          const colors = ["bg-[#E8EEF2]", "bg-[#F3E8FF]", "bg-[#E0E7FF]", "bg-[#FFEDD5]", "bg-[#D1FAE5]"];
          const fetched = res.data.data.slice(0, 5).map((s, idx) => {
            const nameParts = s.nama_lengkap ? s.nama_lengkap.split(' ') : ['?'];
            const initial = nameParts.length > 1
              ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
              : (nameParts[0][0] || 'U').toUpperCase();
            let displayKelas = s.nama_kelas || "-";
            if (displayKelas.startsWith("X ")) displayKelas = displayKelas.replace("X ", "VII ");
            if (displayKelas.startsWith("XI ")) displayKelas = displayKelas.replace("XI ", "VIII ");
            if (displayKelas.startsWith("XII ")) displayKelas = displayKelas.replace("XII ", "IX ");
            if (displayKelas === "X") displayKelas = "VII";
            if (displayKelas === "XI") displayKelas = "VIII";
            if (displayKelas === "XII") displayKelas = "IX";

            return {
              id: s.id,
              name: s.nama_lengkap,
              class: displayKelas,
              kelas: displayKelas,
              nis: s.nis,
              nisn: s.nisn || (s.nis + "000"),
              status: s.status || "Aktif",
              avatarBg: colors[idx % colors.length],
              avatarColor: ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6"][idx % 5],
              initial: initial,
              initials: initial,
              avatarImg: "",
              gender: s.jenis_kelamin,
              email: `${s.nis}@student.mbsprambanan.sch.id`,
              tingkat: displayKelas.includes("VII") ? "Kelas VII" : displayKelas.includes("VIII") ? "Kelas VIII" : "Kelas IX",
              nilaiRataRata: 80 + (idx % 15),
              kehadiran: 90 + (idx % 10)
            };
          });
          setRecentStudents(fetched);
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        }
      };
      fetchDashboardData();
    }
  }, [activeMenu]);
  if (activeMenu === "Mata Pelajaran") return hasPermission(activeMenu) ? <Subjects /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Semester") return hasPermission(activeMenu) ? <Semester /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Data Kelas") return hasPermission(activeMenu) ? <Classes /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Jadwal Pelajaran") return hasPermission(activeMenu) ? <Schedules /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Kenaikan Kelas") return hasPermission(activeMenu) ? <GradePromotion /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Data Kelulusan") return hasPermission(activeMenu) ? <GraduationData /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  
  if (activeMenu === "Data Siswa") {
    if (!hasPermission(activeMenu)) return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
    const iv = sessionStorage.getItem("studentInitialView") || "list";
    sessionStorage.removeItem("studentInitialView"); // reset for next normal navigation
    return <StudentData initialView={iv} />;
  }

  if (activeMenu === "Absensi Siswa") return hasPermission(activeMenu) ? <StudentAttendance /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Data Orang Tua") return hasPermission(activeMenu) ? <ParentData /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "My Profile") return <Profile user={user} />;
  if (activeMenu === "Riwayat Terima Gaji") return hasPermission(activeMenu) ? <GuruRiwayatTerimaGaji user={user} /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Data Guru") return hasPermission(activeMenu) ? <EmployeeData /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  if (activeMenu === "Pengumuman Sekolah") return hasPermission(activeMenu) ? <PengumumanSekolah user={user} /> : <PlaceholderDashboard user={user} activeMenu={activeMenu} />;

  if (activeMenu !== "Dashboard") {
    return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
  }

  if (viewMode === "detail" && selectedStudent) {
    return <StudentDetail student={selectedStudent} onBack={() => setViewMode("dashboard")} onEdit={() => { handleViewChange("Data Siswa"); setViewMode("dashboard"); }} />;
  }

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Dashboard</h1>
          <p className="text-gray-500 text-[15px] mt-1">
            Selamat datang, {user?.fullName || user?.nama || user?.name || "Siti Rahayu"} — Tata Usaha MBS Prambanan
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          07/08/2026
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {/* Card 1: Total Siswa — dari API */}
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Siswa Aktif</div>
            <div className="text-3xl font-black text-white">{totalSiswa || "…"}</div>
            <div className="text-xs font-medium text-blue-300 mt-2">Siswa terdaftar</div>
          </div>
        </div>

        {/* Card 2: Mata Pelajaran — dari Subjects localStorage */}
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Mata Pelajaran</div>
            <div className="text-3xl font-black text-white">{totalMapel || "…"}</div>
            <div className="text-xs font-medium text-blue-300 mt-2">{totalMapelAktif} aktif</div>
          </div>
        </div>

        {/* Card 3: Kelas Aktif — dari Absensi Siswa (jumlah kelas) */}
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Kelas Aktif</div>
            <div className="text-3xl font-black text-white">
              {(() => {
                try {
                  const att = localStorage.getItem('attendance_classes');
                  return att ? JSON.parse(att).length : 3;
                } catch { return 3; }
              })()}
            </div>
            <div className="text-xs font-medium text-blue-300 mt-2">Total rombel belajar</div>
          </div>
        </div>

        {/* Card 4: Absensi — dari Absensi Siswa localStorage */}
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Absensi Hari Ini</div>
            <div className="text-3xl font-black text-white">
              {absensiPct !== null ? `${absensiPct}%` : "…"}
            </div>
            <div className="text-xs font-medium text-blue-300 mt-2">
              {totalTidakHadir} siswa tidak hadir
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Left Col (Aksi Cepat & Chart) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Aksi Cepat */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-[#1e293b] mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <button onClick={() => { sessionStorage.setItem("studentInitialView", "add"); handleViewChange("Data Siswa"); }} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-[#E8EEF2] flex items-center justify-center text-[#1A3D63]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                </div>
                <span className="text-sm font-bold text-[#334155]">Tambah Siswa Baru</span>
              </button>
              <button onClick={() => handleViewChange("Absensi Siswa")} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-[#E8EEF2] flex items-center justify-center text-[#1A3D63]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <span className="text-sm font-bold text-[#334155]">Input Absensi Harian</span>
              </button>
              <button onClick={() => handleViewChange("Pengumuman Sekolah")} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-[#E8EEF2] flex items-center justify-center text-[#1A3D63]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
                </div>
                <span className="text-sm font-bold text-[#334155]">Buat Pengumuman</span>
              </button>
            </div>
          </div>

          {/* Absensi Minggu Ini */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h3 className="font-bold text-[#1e293b]">Absensi Minggu Ini</h3>
              <button onClick={() => handleViewChange("Absensi Siswa")} className="text-sm font-semibold text-gray-500 hover:text-gray-700">Detail</button>
            </div>
            <div className="flex flex-wrap items-end justify-between h-32 px-2 gap-2">
              {[
                { day: "Sen", value: 96, height: "h-[96%]" },
                { day: "Sel", value: 93, height: "h-[93%]" },
                { day: "Rab", value: 95, height: "h-[95%]" },
                { day: "Kam", value: 91, height: "h-[91%]" },
                { day: "Jum", value: 94, height: "h-[94%]" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[11px] font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}%
                  </span>
                  <div className={`w-full ${item.height} bg-[#1A3D63] rounded-t-md opacity-90 hover:opacity-100 transition-opacity`}></div>
                  <span className="text-[12px] font-medium text-gray-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Col (Data Siswa Terbaru) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h3 className="font-bold text-[#1e293b]">Data Siswa Terbaru</h3>
            </div>
            <button onClick={() => handleViewChange("Data Siswa")} className="text-sm font-semibold text-gray-500 hover:text-[#1A3D63] flex items-center gap-1">
              Lihat Semua <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </button>
          </div>
          <div className="overflow-x-auto p-1">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Siswa</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kelas</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">NIS</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentStudents.length > 0 ? recentStudents.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {row.avatarImg ? (
                           <img src={row.avatarImg} alt={row.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#1A3D63] ${row.avatarBg}`}>
                            {row.initial}
                          </div>
                        )}
                        <span className="text-[14px] font-bold text-[#1e293b]">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[14px] text-gray-500">{row.class}</td>
                    <td className="px-5 py-4 text-[14px] text-gray-500">{row.nis}</td>
                    <td className="px-5 py-4">
                      {row.status === "Aktif" ? (
                        <span className="px-2.5 py-1 bg-[#E8EEF2] text-[#1A3D63] rounded-md text-[11px] font-bold tracking-wide">Aktif</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[11px] font-bold tracking-wide">{row.status}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setSelectedStudent(row); setViewMode("detail"); }} className="text-[13px] font-bold text-gray-700 hover:text-[#1A3D63]">Detail</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-gray-400 text-sm">Belum ada data siswa.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slip Gaji Notification Card */}
      {hasPermission("Riwayat Terima Gaji") && (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-[15px] font-bold text-gray-800">Slip Gaji Tersedia</h3>
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">Baru</span>
              </div>
              <p className="text-[13px] text-gray-500">
                Slip gaji bulan <span className="font-semibold text-emerald-700">Juli 2026</span> telah diterbitkan oleh Bendahara. Silakan cek dan unduh slip gaji Anda.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  Diterbitkan: Juli 2026
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Status: Sudah Ditransfer
                </span>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <button
              onClick={() => handleViewChange("Riwayat Terima Gaji")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-xl transition-colors border-none cursor-pointer whitespace-nowrap"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Lihat Slip Gaji
            </button>
            <button
              onClick={() => handleViewChange("Riwayat Terima Gaji")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-[12px] font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Riwayat Gaji
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Pengumuman Sekolah Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
            <h3 className="font-bold text-[#1e293b]">Pengumuman Sekolah Terbaru</h3>
          </div>
          <button onClick={() => handleViewChange("Pengumuman Sekolah")} className="bg-[#1A3D63] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-[#122A44] transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Buat Pengumuman
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item 1 */}
          <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#E8EEF2] flex items-center justify-center text-[#1A3D63] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </div>
            <h4 className="font-bold text-[#1e293b] text-sm mb-3">Libur Nasional Hari Pahlawan</h4>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                10 Nov 2023
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Semua
              </div>
            </div>
            <button onClick={() => handleViewChange("Pengumuman Sekolah")} className="text-[12px] font-bold text-[#1A3D63] flex items-center gap-1 hover:underline">
              Lihat detail <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          {/* Item 2 */}
          <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#E8EEF2] flex items-center justify-center text-[#1A3D63] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h4 className="font-bold text-[#1e293b] text-sm mb-3">Jadwal UTS Semester Ganjil 2023/2024</h4>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                8 Nov 2023
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Siswa & Guru
              </div>
            </div>
            <button onClick={() => handleViewChange("Pengumuman Sekolah")} className="text-[12px] font-bold text-[#1A3D63] flex items-center gap-1 hover:underline">
              Lihat detail <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          {/* Item 3 */}
          <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#E8EEF2] flex items-center justify-center text-[#1A3D63] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h4 className="font-bold text-[#1e293b] text-sm mb-3">Rapat Komite Sekolah</h4>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                5 Nov 2023
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Guru & Staff
              </div>
            </div>
            <button onClick={() => handleViewChange("Pengumuman Sekolah")} className="text-[12px] font-bold text-[#1A3D63] flex items-center gap-1 hover:underline">
              Lihat detail <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          {/* Item 4 */}
          <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#E8EEF2] flex items-center justify-center text-[#1A3D63] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
            </div>
            <h4 className="font-bold text-[#1e293b] text-sm mb-3">Pengumpulan Tugas Akhir Semester</h4>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                1 Nov 2023
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Siswa
              </div>
            </div>
            <button onClick={() => handleViewChange("Pengumuman Sekolah")} className="text-[12px] font-bold text-[#1A3D63] flex items-center gap-1 hover:underline">
              Lihat detail <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && createPortal(
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl text-white text-sm font-bold shadow-2xl flex items-center gap-3 animate-slideDown ${
          toastMsg.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>
          {toastMsg.type === 'error' ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          )}
          {toastMsg.msg}
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminTUDashboard;



