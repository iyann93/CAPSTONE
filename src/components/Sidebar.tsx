import React from 'react'
import type { SidebarProps, UserRole } from '../types'

interface MenuSection {
  section: string
  items: { label: string; icon: React.ReactNode }[]
  roles: UserRole[]
}

const BarChartIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
)
const UsersIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const UserSettingsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M19 14v3M22 14v3M19 17h3" />
  </svg>
)
const BriefcaseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)
const CalendarIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const BookIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)
const GridIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)
const GraduationIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)
const ReceiptIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" /><path d="M12 7v5M9 15h6" />
  </svg>
)
const AwardIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
)
const WalletIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
  </svg>
)
const FileChartIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13h-4M16 17H8M12 9H8" />
  </svg>
)
const SettingsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const menuSections: MenuSection[] = [
  {
    section: '',
    items: [
      { label: 'Dashboard Overview', icon: <BarChartIcon /> }
    ],
    roles: ['Admin', 'Kepala Sekolah', 'Wakil Kepsek', 'Guru'],
  },
  {
    section: 'MASTER DATA (SHARED)',
    items: [
      { label: 'Kelola Pengguna', icon: <UserSettingsIcon /> },
      { label: 'Data Siswa', icon: <UsersIcon /> },
      { label: 'Data Guru & Karyawan', icon: <BriefcaseIcon /> }
    ],
    roles: ['Admin', 'Kepala Sekolah'],
  },
  {
    section: 'MODUL AKADEMIK',
    items: [
      { label: 'Tahun Ajaran & Semester', icon: <CalendarIcon /> },
      { label: 'Mata Pelajaran', icon: <BookIcon /> },
      { label: 'Kelas & Penjadwalan', icon: <GridIcon /> },
      { label: 'E-Rapor & Input Nilai', icon: <GraduationIcon /> }
    ],
    roles: ['Admin', 'Kepala Sekolah', 'Wakil Kepsek', 'Guru'],
  },
  {
    section: 'MODUL KEUANGAN',
    items: [
      { label: 'Tagihan SPP Siswa', icon: <ReceiptIcon /> },
      { label: 'Beasiswa & Potongan', icon: <AwardIcon /> },
      { label: 'Penggajian (Payroll)', icon: <WalletIcon /> }
    ],
    roles: ['Admin', 'Kepala Sekolah', 'Wakil Kepsek'],
  },
  {
    section: 'LAINNYA',
    items: [
      { label: 'Laporan Integrasi', icon: <FileChartIcon /> },
      { label: 'Pengaturan Sistem', icon: <SettingsIcon /> }
    ],
    roles: ['Admin', 'Kepala Sekolah'],
  },
]

const Sidebar: React.FC<SidebarProps> = ({ collapsed, role, activeMenu, onMenuClick, onClose }) => {
  const filteredSections = menuSections.filter(section => section.roles.includes(role))

  return (
    <>
      {/* Overlay mobile */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen 
        bg-[#F6FAFD] border-r border-gray-100
        transition-all duration-300 ease-in-out
        flex flex-col
        ${collapsed ? '-translate-x-full w-[280px] lg:w-20 lg:translate-x-0' : 'translate-x-0 w-[280px]'}
      `}>
        {/* Logo Section Removed per user request */}
        {/* Menu Section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-8 scrollbar-hide">
          {filteredSections.map((section, idx) => (
            <div key={idx} className="px-4">
              {!collapsed && (
                <div className="px-4 mb-4 text-[10px] font-semibold text-[#4A7FA7] uppercase tracking-widest opacity-80">
                  {section.section}
                </div>
              )}
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = activeMenu === item.label
                  return (
                    <button
                      key={item.label}
                      onClick={() => onMenuClick(item.label)}
                      className={`
                        w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'bg-[#1A3D63] text-white shadow-lg shadow-[#1A3D63]/20 translate-x-1' 
                          : 'text-gray-500 hover:bg-[#EBF3FA] hover:text-[#1A3D63]'}
                      `}
                    >
                      <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </div>
                      {!collapsed && (
                        <span className={`text-[13px] font-medium tracking-tight ${isActive ? 'text-white' : ''}`}>
                          {item.label}
                        </span>
                      )}
                      {isActive && !collapsed && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Footer */}
        <div className="p-4 mt-auto">
          <div className={`
            bg-white border border-gray-100 rounded-2xl p-4 transition-all duration-300
            ${collapsed ? 'items-center px-2' : 'flex items-center gap-4'}
          `}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#0A1931] flex items-center justify-center text-white font-black text-xs shadow-inner">
                SW
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-[#1A3D63] truncate">Dr. Wahyu</div>
                <div className="text-[11px] text-[#4A7FA7] mt-0.5">Admin TU</div>
              </div>
            )}
            
            {!collapsed && (
              <button className="p-2 text-gray-300 hover:text-[#1A3D63] transition-colors rounded-lg hover:bg-gray-50">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 15l3-3m0 0l-3-3m3 3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
