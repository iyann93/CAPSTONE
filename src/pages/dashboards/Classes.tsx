import React, { useState } from 'react'

const SchoolIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/><path d="M9 21v-4a3 3 0 0 1 6 0v4M12 3v1"/>
  </svg>
)

const UserIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)

interface ClassRecord {
  id: number
  name: string
  room: string
  teacher: string
  capacity: string
  filled: number
  total: number
  major: string
}

const MOCK_CLASSES: ClassRecord[] = [
  { id: 1, name: 'X IPA 1', room: 'R-101', teacher: 'Dra. Siti Aminah', capacity: '34/36 siswa', filled: 34, total: 36, major: 'IPA' },
  { id: 2, name: 'X IPA 2', room: 'R-102', teacher: 'Pak Hendra Wijaya', capacity: '36/36 siswa', filled: 36, total: 36, major: 'IPA' },
  { id: 3, name: 'X IPA 3', room: 'R-103', teacher: 'Ibu Ratna Sari', capacity: '35/36 siswa', filled: 35, total: 36, major: 'IPA' },
  { id: 4, name: 'X IPS 1', room: 'R-201', teacher: 'Pak Budi Santoso', capacity: '36/36 siswa', filled: 36, total: 36, major: 'IPS' },
  { id: 5, name: 'X IPS 2', room: 'R-202', teacher: 'Ibu Dewi Lestari', capacity: '36/36 siswa', filled: 36, total: 36, major: 'IPS' },
  { id: 6, name: 'XI IPA 1', room: 'R-104', teacher: 'Pak Eko Prasetyo', capacity: '34/36 siswa', filled: 34, total: 36, major: 'IPA' },
  { id: 7, name: 'XI IPA 2', room: 'R-105', teacher: 'Ibu Wulandari', capacity: '34/36 siswa', filled: 34, total: 36, major: 'IPA' },
  { id: 8, name: 'XI IPS 1', room: 'R-203', teacher: 'Pak Agus Wahyudi', capacity: '34/36 siswa', filled: 34, total: 36, major: 'IPS' },
  { id: 9, name: 'XII IPA 1', room: 'R-106', teacher: 'Pak Ahmad Yusuf', capacity: '32/36 siswa', filled: 32, total: 36, major: 'IPA' },
]

const Classes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Semua Tingkat')

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#4A7FA7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-900/10">
            <SchoolIcon />
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#4A7FA7] mb-0.5">Dashboard / <span className="text-gray-400">Kelas & Rombel</span></div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Kelas & Rombongan Belajar</h1>
            <p className="text-[14px] text-gray-500">Kelola pembagian kelas dan rombongan belajar</p>
          </div>
        </div>
        <button className="bg-[#0A1931] hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg transition-all flex items-center gap-2">
          <span className="text-base leading-none font-medium">+</span>
          Tambah Kelas
        </button>
      </div>

      {/* ── Top Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm">
           <div className="text-[12px] font-medium text-white/70 mb-1">Kelas X</div>
           <div className="flex items-baseline gap-1.5">
             <div className="text-[28px] font-bold text-white">5</div>
             <div className="text-[12px] text-white/70">rombel</div>
           </div>
        </div>
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm">
           <div className="text-[12px] font-medium text-white/70 mb-1">Kelas XI</div>
           <div className="flex items-baseline gap-1.5">
             <div className="text-[28px] font-bold text-white">3</div>
             <div className="text-[12px] text-white/70">rombel</div>
           </div>
        </div>
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm">
           <div className="text-[12px] font-medium text-white/70 mb-1">Kelas XII</div>
           <div className="flex items-baseline gap-1.5">
             <div className="text-[28px] font-bold text-white">2</div>
             <div className="text-[12px] text-white/70">rombel</div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {['Semua Tingkat', 'Kelas X', 'Kelas XI', 'Kelas XII'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
              activeTab === tab ? 'bg-[#4A7FA7] text-white shadow-lg shadow-primary-900/10' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLASSES.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#1F2937]">{c.name}</h3>
                <p className="text-[11px] font-bold text-gray-300 tracking-widest uppercase mt-0.5">{c.room}</p>
              </div>
              <span className="bg-[#4A7FA7] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                {c.major}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <UserIcon />
                <div className="text-[13px] text-gray-600 font-medium">Wali Kelas: <span className="text-[#1F2937] font-bold">{c.teacher}</span></div>
              </div>
              <div className="flex items-center gap-3">
                <UsersIcon />
                <div className="text-[13px] text-gray-600 font-medium">Kapasitas: <span className="text-[#1F2937] font-bold">{c.capacity}</span></div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
               <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Kapasitas Terisi</span>
                  <span className="text-[#4A7FA7]">{Math.round((c.filled / c.total) * 100)}%</span>
               </div>
               <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4A7FA7] rounded-full transition-all duration-1000"
                    style={{ width: `${(c.filled / c.total) * 100}%` }}
                  />
               </div>
            </div>

            <div className="flex items-center gap-2">
               <button className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <UsersIcon />
                  Lihat Siswa
               </button>
               <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                  <EditIcon />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Classes
