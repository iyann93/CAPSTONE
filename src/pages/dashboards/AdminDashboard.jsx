import ManageUsers from "./ManageUsers";
import StudentData from "./StudentData";
import EmployeeData from "./EmployeeData";
import AcademicYear from "./AcademicYear";
import Subjects from "./Subjects";
import Classes from "./Classes";
import ERapor from "./ERapor";
import FinancialReport from "./FinancialReport";
import SystemSettings from "./SystemSettings";
import Profile from "../Profile";
const IconUsers = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>;
const IconBriefcase = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>;
const IconGrid = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>;
const IconCalendar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>;
const IconTrendUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>;
const BarChart = () => {
  const bars = [
    { h: 72, label: "Kls 10" },
    { h: 85, label: "Kls 11" },
    { h: 60, label: "Kls 12" },
    { h: 90, label: "Kls 10" },
    { h: 75, label: "Kls 11" },
    { h: 82, label: "Kls 12" }
  ];
  return <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "200px", padding: "0 8px" }}>
      {bars.map((b, i) => <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%" }}>
          <div style={{ width: "100%", flex: 1, backgroundColor: "#F3F4F6", borderRadius: "6px 6px 0 0", position: "relative", overflow: "hidden" }}>
            <div style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: `${b.h}%`,
    backgroundColor: "#1A3D63",
    borderRadius: "6px 6px 0 0"
  }} />
          </div>
          <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500, whiteSpace: "nowrap" }}>{b.label}</span>
        </div>)}
    </div>;
};
const DonutChart = () => {
  const r = 54, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const lunasPct = 0.78;
  const menunggakPct = 0.22;
  const lunasLen = lunasPct * circ;
  const menunggakLen = menunggakPct * circ;
  const gap = 4;
  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width={140} height={140} viewBox="0 0 140 140">
          {
    /* bg ring */
  }
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={16} />
          {
    /* lunas - green, starts at top (-90deg) */
  }
          <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke="#5EE9B5"
    strokeWidth={16}
    strokeLinecap="round"
    strokeDasharray={`${lunasLen - gap} ${circ - lunasLen + gap}`}
    strokeDashoffset={circ * 0.25}
    style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
  />
          {
    /* menunggak - amber */
  }
          <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke="#F59E0B"
    strokeWidth={16}
    strokeLinecap="round"
    strokeDasharray={`${menunggakLen - gap} ${circ - menunggakLen + gap}`}
    strokeDashoffset={circ * 0.25 - lunasLen}
    style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
  />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "26px", fontWeight: 700, color: "#1F2937" }}>78%</span>
          <span style={{ fontSize: "11px", color: "#9CA3AF", marginTop: 2 }}>Lunas</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#5EE9B5", display: "inline-block" }} />
          <span style={{ fontSize: "12px", color: "#6B7280" }}>Lunas (973)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#F59E0B", display: "inline-block" }} />
          <span style={{ fontSize: "12px", color: "#6B7280" }}>Menunggak (275)</span>
        </div>
      </div>
    </div>;
};
const DashboardOverview = () => {
  const card = (iconBg, iconColor, icon, label, value, sub) => <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
        <div className="text-xl sm:text-[26px] font-bold text-gray-800 leading-tight">{value}</div>
        <div className="text-[11px] sm:text-xs text-gray-400 mt-1">{sub}</div>
      </div>
    </div>;
  const scheduleItems = [
    { time: "07:15 - 08:45", subject: "Matematika", cls: "X IPA 1", teacher: "Dra. Sri Wahyuni" },
    { time: "08:45 - 10:15", subject: "Sejarah", cls: "XI IPS 2", teacher: "Budi Santoso, S.Pd" },
    { time: "10:30 - 12:00", subject: "Fisika", cls: "XII IPA 3", teacher: "Ahmad Ridwan, M.Si" }
  ];
  const activities = [
    { time: "10:45 AM", name: "Dra. Sri Wahyuni", role: "Guru", module: "Akademik", mBg: "#EFF6FF", mColor: "#1D4ED8", activity: "Input nilai UTS untuk Kelas X IPA 1" },
    { time: "10:12 AM", name: "Andi Setiawan", role: "Siswa", module: "Keuangan", mBg: "#F0FDF4", mColor: "#16A34A", activity: "Pembayaran SPP Bulan Oktober (Lunas)" },
    { time: "09:30 AM", name: "Budi Santoso", role: "Admin", module: "Master Data", mBg: "#F9FAFB", mColor: "#374151", activity: "Menambahkan Tahun Ajaran Baru 2024/2025" },
    { time: "08:15 AM", name: "Siti Aminah", role: "Bendahara", module: "Keuangan", mBg: "#F0FDF4", mColor: "#16A34A", activity: "Generate draft slip gaji periode Oktober" }
  ];
  return <div className="flex flex-col gap-5 sm:gap-6 pb-10 animate-fadeIn">

      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-[26px] font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Ringkasan sistem informasi akademik dan keuangan.</p>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-[13px] font-medium text-gray-700 cursor-pointer">
            <IconCalendar /> <span className="hidden sm:inline">Tahun Ajaran:</span> 2023/2024
          </button>
          <button className="flex items-center gap-1.5 bg-[#1A3D63] text-white border-none rounded-lg px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold cursor-pointer">
            + Tambah Data
          </button>
        </div>
      </div>

      {
    /* Stat Cards */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {card("#DBEAFE", "#1D4ED8", <IconUsers />, "Total Siswa Aktif", "1,248", "+24 dari tahun lalu")}
        {card("#E0E7FF", "#4F46E5", <IconBriefcase />, "Total Guru & Staf", "112", "85 Guru, 27 Staf")}
        {card("#CFFAFE", "#0E7490", <IconGrid />, "Ruang Kelas Aktif", "32 / 36", "Tingkat utilisasi 88%")}
      </div>

      {
    /* Charts Row */
  }
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">
            <span className="text-sm font-semibold text-gray-800">Persentase Ketuntasan Nilai Siswa (Akademik)</span>
            <button className="text-xs font-semibold text-[#1A3D63] bg-transparent border-none cursor-pointer underline">Lihat Detail</button>
          </div>
          <BarChart />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 mb-5">Status Pembayaran SPP (Bulan Ini)</div>
          <DonutChart />
        </div>
      </div>

      {
    /* Schedule + Salary Row */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {
    /* Schedule */
  }
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 mb-4">Jadwal Mengajar Hari Ini (Guru)</div>
          <div className="flex flex-col gap-3">
            {scheduleItems.map((j, i) => <div key={i} className="flex items-start sm:items-center gap-3 sm:gap-4 bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-[#1A3D63]">
                <span className="text-[11px] sm:text-xs font-semibold text-gray-500 whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{j.time}</span>
                <div className="min-w-0">
                  <div className="text-[13px] sm:text-sm font-semibold text-gray-800">
                    {j.subject} <span className="font-normal text-gray-500">({j.cls})</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{j.teacher}</div>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* Salary */
  }
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 mb-4">Estimasi Gaji &amp; Tunjangan (Bulan Ini)</div>
          <div className="text-2xl sm:text-[28px] font-bold text-gray-800 mb-2">Rp 485.500.000</div>
          <div className="flex items-center gap-1.5 text-[#5EE9B5] text-[13px] font-bold mb-6">
            <IconTrendUp /> +2.4% dari bulan lalu
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-gray-500 font-medium">Gaji Pokok Guru (85)</span>
                <span className="text-gray-800 font-semibold">Rp 320.000.000</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[66%] bg-[#1A3D63] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-gray-500 font-medium">Gaji Staf (27)</span>
                <span className="text-gray-800 font-semibold">Rp 115.000.000</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[38%] bg-[#4A7FA7] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Activity Table */
  }
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-50">
          <span className="text-sm font-semibold text-gray-800">Aktivitas Sistem Terbaru (Cross-Module)</span>
        </div>
        {
    /* Mobile: Card layout */
  }
        <div className="block sm:hidden divide-y divide-gray-50">
          {activities.map((a, i) => <div key={i} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <div className="text-[13px] font-semibold text-gray-800">{a.name}</div>
                  <div className="text-[11px] text-gray-400">{a.role}</div>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">{a.time}</span>
              </div>
              <div className="flex items-start gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0" style={{ backgroundColor: a.mBg, color: a.mColor }}>{a.module}</span>
                <span className="text-[12px] text-gray-500 leading-relaxed">{a.activity}</span>
              </div>
            </div>)}
        </div>
        {
    /* Desktop: Table layout */
  }
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {["WAKTU", "USER", "MODUL", "AKTIVITAS"].map((h) => <th key={h} className="px-6 py-2.5 text-left text-[11px] font-semibold text-gray-400 tracking-wide">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-[13px] text-gray-400 whitespace-nowrap">{a.time}</td>
                  <td className="px-6 py-3.5">
                    <div className="text-sm font-semibold text-gray-800">{a.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{a.role}</div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: a.mBg, color: a.mColor }}>{a.module}</span>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-gray-600">{a.activity}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
const AdminDashboard = ({ user, activeMenu }) => {
  const content = () => {
    switch (activeMenu) {
      case "Kelola Pengguna":
        return <ManageUsers />;
      case "Data Siswa":
        return <StudentData />;
      case "Data Guru & Karyawan":
        return <EmployeeData />;
      case "Tahun Ajaran & Semester":
        return <AcademicYear />;
      case "Mata Pelajaran":
        return <Subjects />;
      case "Kelas & Penjadwalan":
        return <Classes />;
      case "E-Rapor & Input Nilai":
        return <ERapor />;
      case "Laporan Integrasi":
        return <FinancialReport />;
      case "Pengaturan Sistem":
        return <SystemSettings />;
      case "My Profile":
        return <Profile user={user} />;
      default:
        return <DashboardOverview />;
    }
  };
  return <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#F3F4F6] min-h-screen">
      {content()}
    </main>;
};
var AdminDashboard_default = AdminDashboard;
export {
  AdminDashboard_default as default
};
