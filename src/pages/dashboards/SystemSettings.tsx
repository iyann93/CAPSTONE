import React, { useState } from 'react'

const SettingsIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const TabIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Profil': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    case 'Akademik': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
    case 'Notifikasi': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    case 'Keamanan': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    case 'Database': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
    default: return null
  }
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Profil Sekolah')

  const renderInputRow = (label: string, value: string) => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-2">
      <label className="md:col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="md:col-span-9">
        <input 
          type="text" 
          defaultValue={value}
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:border-primary-500/30 transition-all"
        />
      </div>
    </div>
  )

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
            <SettingsIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Pengaturan Sistem</h1>
            <p className="text-sm text-gray-500">Konfigurasi profil sekolah, akademik, keamanan, dan database</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-green-50 text-green-600 border border-green-100 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             Sistem Aktif
          </div>
          <button className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 px-6 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2">
             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
             Reset Default
          </button>
        </div>
      </div>

      {/* ── Top Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Versi Sistem', value: 'v2.4.1', color: 'bg-white text-gray-800' },
          { label: 'Status Server', value: 'Online', color: 'bg-[#F0FDF4] text-green-600 border-green-100' },
          { label: 'Backup Terakhir', value: '11 Mei 2025', color: 'bg-[#EFF6FF] text-blue-600 border-blue-100' },
          { label: 'Log Hari Ini', value: '247 Aktivitas', color: 'bg-[#FFFBEB] text-amber-600 border-amber-100' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} border border-gray-100 p-5 rounded-[20px] shadow-sm`}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">{stat.label}</div>
            <div className="text-lg font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs Row ── */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
        {[
          { name: 'Profil Sekolah', icon: 'Profil' },
          { name: 'Akademik', icon: 'Akademik' },
          { name: 'Notifikasi', icon: 'Notifikasi' },
          { name: 'Keamanan', icon: 'Keamanan' },
          { name: 'Database & Log', icon: 'Database' },
        ].map((tab) => (
          <button 
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.name 
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-900/20' 
              : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <TabIcon type={tab.icon} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* ── Main Content Card ── */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 space-y-12">
          {/* Section 1: Identitas Sekolah */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-gray-800 border-b border-gray-50 pb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <TabIcon type="Profil" />
              </div>
              <h3 className="text-lg font-bold">Identitas Sekolah</h3>
            </div>
            <div className="space-y-2">
              {renderInputRow('NAMA SEKOLAH', 'SMA Negeri 1 Contoh')}
              {renderInputRow('NPSN', '20234567')}
              {renderInputRow('NSS', '301010101001')}
              {renderInputRow('ALAMAT', 'Jl. Pendidikan No. 1, Kota Contoh')}
              {renderInputRow('KODE POS', '12345')}
              {renderInputRow('NO. TELEPON', '(021) 555-1234')}
              {renderInputRow('WEBSITE', 'https://sman1contoh.sch.id')}
            </div>
          </section>

          {/* Section 2: Kepala Sekolah & Kontak */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-gray-800 border-b border-gray-50 pb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3 className="text-lg font-bold">Kepala Sekolah & Kontak</h3>
            </div>
            <div className="space-y-2">
              {renderInputRow('KEPALA SEKOLAH', 'Dr. H. Bambang Sutrisno')}
              {renderInputRow('EMAIL RESMI', 'info@sman1contoh.sch.id')}
              {renderInputRow('EMAIL NOTIF.', 'notif@sman1contoh.sch.id')}
              {renderInputRow('AKREDITASI', 'A (Unggul)')}
            </div>
          </section>
        </div>

        {/* Card Footer */}
        <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
           <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-900/20 transition-all active:scale-95 flex items-center gap-2">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Simpan Perubahan
           </button>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings
