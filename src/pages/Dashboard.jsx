import StatCard from "../components/StatCard";
import AcademicChart from "../components/AcademicChart";
import SPPDonutChart from "../components/SPPDonutChart";
import TeachingSchedule from "../components/TeachingSchedule";
import SalaryEstimation from "../components/SalaryEstimation";
import ActivityLog from "../components/ActivityLog";
const UsersIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>;
const BriefcaseIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12" />
  </svg>;
const GridIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>;
const CalendarIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>;
const BookOpenIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>;
const Dashboard = ({ user }) => {
  const getGreeting = () => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
  };
  return <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 md:gap-8 overflow-y-auto bg-gray-50/50">
      {
    /* ── Page Header ── */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
            {getGreeting()}, {user.fullName.split(" ")[0]}!
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {user.role === "Admin" && "Selamat datang di panel kontrol sistem SIAKAD."}
            {user.role === "Kepala Sekolah" && "Berikut ringkasan performa akademik dan operasional sekolah."}
            {user.role === "Wakil Kepsek" && "Monitor kegiatan akademik dan administrasi sekolah."}
            {user.role === "Guru" && "Lihat jadwal mengajar dan progres penilaian Anda."}
            {user.role === "Siswa" && "Lihat progres belajar dan tagihan SPP Anda."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
            <CalendarIcon />
            <span>2023/2024</span>
          </button>
          {["Admin", "Wakil Kepsek"].includes(user.role) && <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-xs md:text-sm font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              <span className="text-lg leading-none">+</span>
              <span className="hidden sm:inline">Tambah Data</span>
              <span className="sm:hidden">Tambah</span>
            </button>}
        </div>
      </div>

      {
    /* ── Stat Cards (Role Based) ── */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.role !== "Siswa" ? <>
            <div className="animate-fadeIn" style={{ animationDelay: "0ms" }}>
              <StatCard
    title="Total Siswa Aktif"
    value="1,248"
    subtitle="+24 dari tahun lalu"
    icon={<UsersIcon />}
    iconBg="#e0effe"
    iconColor="#1B3B5F"
  />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "80ms" }}>
              <StatCard
    title="Total Guru & Staf"
    value="112"
    subtitle="85 Guru, 27 Staf"
    icon={<BriefcaseIcon />}
    iconBg="#e0f2fe"
    iconColor="#0ea5e9"
  />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "160ms" }}>
              <StatCard
    title="Ruang Kelas Aktif"
    value="32 / 36"
    subtitle="Tingkat utilisasi 88%"
    icon={<GridIcon />}
    iconBg="#f0fdf4"
    iconColor="#22c55e"
  />
            </div>
          </> : <>
            <div className="animate-fadeIn" style={{ animationDelay: "0ms" }}>
              <StatCard
    title="Rata-rata Nilai"
    value="88.5"
    subtitle="Peringkat 5 di Kelas"
    icon={<BookOpenIcon />}
    iconBg="#e0effe"
    iconColor="#1B3B5F"
  />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "80ms" }}>
              <StatCard
    title="Kehadiran"
    value="98%"
    subtitle="24 Hari hadir bulan ini"
    icon={<UsersIcon />}
    iconBg="#e0f2fe"
    iconColor="#0ea5e9"
  />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "160ms" }}>
              <StatCard
    title="Tugas Selesai"
    value="12 / 14"
    subtitle="2 Tugas perlu dikumpulkan"
    icon={<GridIcon />}
    iconBg="#f0fdf4"
    iconColor="#22c55e"
  />
            </div>
          </>}
      </div>

      {
    /* ── Main Content Rows ── */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AcademicChart />
          {user.role === "Siswa" ? <ActivityLog /> : <TeachingSchedule />}
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <SPPDonutChart />
          {["Admin", "Kepala Sekolah", "Guru"].includes(user.role) && <SalaryEstimation />}
        </div>
      </div>

      {
    /* ── Footer Row ── */
  }
      {user.role !== "Siswa" && <ActivityLog />}
    </main>;
};
var Dashboard_default = Dashboard;
export {
  Dashboard_default as default
};
