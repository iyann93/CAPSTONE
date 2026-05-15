import React from 'react'
import { User } from '../../types'
import SiswaSchedule from './SiswaSchedule'

interface DashboardProps {
  user: User
  activeMenu: string
  onViewChange: (menu: string) => void
}

const CalendarIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const AwardIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M12 15l-2 5L12 18l2 2-2-5z" />
    <circle cx="12" cy="8" r="7" />
    <circle cx="12" cy="8" r="3" />
  </svg>
)

const FileTextIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
)

const BoltIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const DashboardOverview: React.FC<{ user: User, onViewChange: (menu: string) => void }> = ({ user, onViewChange }) => {
  const firstName = user.fullName.split(' ')[0]
  return (
    <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 md:gap-8 overflow-y-auto bg-gray-50/50 h-full">
      <div className="flex items-center justify-between animate-fadeIn">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Senin, 02 Oktober 2025</p>
        </div>
      </div>

      {/* ── Welcome Hero ── */}
      <div className="bg-primary-50/30 rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden animate-fadeIn border border-primary-100/50 min-h-[300px] md:min-h-[380px] mb-8">
        <div className="relative z-10 text-left w-full md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight leading-tight">Hi, {firstName}</h1>
          <p className="text-sm md:text-xl text-gray-500 leading-relaxed max-w-md">
            Siap untuk mulai belajar hari ini? Berikut ringkasan jadwal dan nilai kamu.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-[45%]">
          <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl shadow-primary-900/10 border-8 border-white bg-primary-50/50">
            <img
              src="/hero-siswa.png"
              alt="Students Studying"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://img.freepik.com/free-photo/group-diverse-students-studying-together-college_23-2148844715.jpg";
              }}
            />
          </div>
        </div>
        {/* Subtle decorative background */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 md:mt-0 px-2">OVERVIEW</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFC107] rounded-3xl p-6 text-white shadow-lg shadow-amber-200/50 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 mb-4 opacity-80 uppercase text-[10px] font-bold tracking-widest">
                <CalendarIcon />
                Kehadiran
              </div>
              <div className="text-4xl font-black">95%</div>
            </div>
            <div className="bg-[#E9E4FF] rounded-3xl p-6 text-[#6B4DFF] shadow-lg shadow-indigo-100/50 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-2 mb-4 opacity-70 uppercase text-[10px] font-bold tracking-widest">
                <AwardIcon />
                Peringkat
              </div>
              <div className="text-4xl font-black text-[#5035E0]">5</div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-sm md:text-base">Jadwal Hari Ini</h3>
              <button
                onClick={() => onViewChange('Jadwal Mapel')}
                className="text-[10px] md:text-xs font-bold text-primary-500 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
              >
                Lihat Semua
              </button>
            </div>
            <div className="space-y-6">
              {[
                { subject: 'Matematika', teacher: 'Dra. Sri Wahyuni', time: '07:15 - 08:45', color: 'bg-amber-50 text-amber-500', icon: <FileTextIcon /> },
                { subject: 'Bahasa Indonesia', teacher: 'Rina Marlina, S.Pd', time: '08:45 - 10:15', color: 'bg-primary-50 text-primary-500', icon: <FileTextIcon /> },
                { subject: 'Fisika', teacher: 'Ahmad Ridwan, M.Si', time: '10:30 - 12:00', color: 'bg-indigo-50 text-indigo-500', icon: <BoltIcon /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-xs md:text-sm">{item.subject}</div>
                      <div className="text-[10px] md:text-xs text-gray-400">{item.teacher}</div>
                    </div>
                  </div>
                  <div className="text-[9px] md:text-[11px] font-bold text-gray-400 whitespace-nowrap ml-2">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-sm md:text-base">Highlight Nilai Raport</h3>
            <button className="text-[10px] md:text-xs font-bold text-primary-500 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">Detail Nilai</button>
          </div>
          <div className="space-y-8">
            {[
              { subject: 'Pendidikan Agama Islam', status: 'Tuntas', score: 92, color: 'bg-primary-500' },
              { subject: 'Matematika Wajib', status: 'Tuntas', score: 88, color: 'bg-primary-500' },
              { subject: 'Kimia', status: 'Remedial', score: 78, color: 'bg-amber-500' },
              { subject: 'IPS', status: 'Remedial', score: 78, color: 'bg-amber-500' },
              { subject: 'Kimia Murni', status: 'Tuntas', score: 85, color: 'bg-primary-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
                      <FileTextIcon />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{item.subject}</div>
                      <span className={`text-[10px] font-bold ${item.status === 'Tuntas' ? 'text-green-500' : 'text-amber-500'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-black text-gray-800">{item.score}</div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

const SiswaDashboard: React.FC<DashboardProps> = ({ user, activeMenu, onViewChange }) => {
  const renderView = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardOverview user={user} onViewChange={onViewChange} />
      case 'Jadwal Mapel':
        return <SiswaSchedule />
      default:
        return (
          <div className="p-8 text-center text-gray-400 h-full flex items-center justify-center">
            Halaman {activeMenu} sedang dalam pengembangan.
          </div>
        )
    }
  }

  return renderView()
}

export default SiswaDashboard
