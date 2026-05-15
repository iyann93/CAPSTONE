import React, { useState } from 'react'

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
)

const UserPlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="mr-1.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const BriefcaseIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
)

const ActivityIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const EditIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

const KeyIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l2.5-2.5"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const SaveIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
)

interface UserRecord {
  id: number
  email: string
  name: string
  role: string
  roleColor: string
  roleText: string
  status: string
  lastLogin: string
  phone?: string
  nip?: string
}

const MOCK_USERS: UserRecord[] = [
  { id: 1, email: 'budi.admin@siakad.id', name: 'Budi Santoso', role: 'Admin Global', roleColor: 'bg-[#1A3D63]/10', roleText: 'text-[#1A3D63]', status: 'Aktif', lastLogin: 'Hari ini, 08:30', phone: '+62 812 3456 7890', nip: '198501012010121001' },
  { id: 2, email: 'siti.keuangan@siakad.id', name: 'Siti Aminah', role: 'Bendahara', roleColor: 'bg-[#5EE9B5]/10', roleText: 'text-[#2B8B67]', status: 'Aktif', lastLogin: 'Hari ini, 07:15', phone: '+62 812 9988 7766', nip: '199005052015052002' },
  { id: 3, email: 'sri.guru@siakad.id', name: 'Dra. Sri Wahyuni', role: 'Guru', roleColor: 'bg-[#EFF6FF]', roleText: 'text-[#1D4ED8]', status: 'Aktif', lastLogin: 'Hari ini, 09:10' },
  { id: 4, email: 'bambang.kepsek@siakad.id', name: 'Drs. Bambang Sudirman', role: 'Kepala Sekolah', roleColor: 'bg-[#FFFBEB]', roleText: 'text-[#D97706]', status: 'Aktif', lastLogin: 'Kemarin, 14:20' },
]

const ManageUsers: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)

  const handleEditClick = (user: UserRecord) => {
    setSelectedUser(user)
    setIsEditing(true)
  }

  if (isEditing && selectedUser) {
    return (
      <div className="animate-fadeIn space-y-6 pb-20">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
              <span className="cursor-pointer hover:text-[#1A3D63]" onClick={() => setIsEditing(false)}>Kelola Pengguna</span>
              <span>›</span>
              <span className="text-[#1A3D63]">Edit Pengguna</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Edit Pengguna: {selectedUser.name}</h1>
            <p className="text-[14px] text-gray-500">Perbarui informasi akun, hak akses, dan status pengguna.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              × Batal
            </button>
            <button className="flex items-center bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg shadow-[#1A3D63]/20 transition-all">
              <SaveIcon />
              Simpan Perubahan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Informasi Dasar */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
                  <UserIcon />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Informasi Dasar</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    defaultValue={selectedUser.name}
                    className="w-full px-5 py-3.5 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Email / Username</label>
                  <input 
                    type="email" 
                    defaultValue={selectedUser.email}
                    className="w-full px-5 py-3.5 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor Telepon</label>
                  <input 
                    type="text" 
                    defaultValue={selectedUser.phone}
                    className="w-full px-5 py-3.5 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">ID Pegawai / NIK</label>
                  <input 
                    type="text" 
                    defaultValue={selectedUser.nip}
                    className="w-full px-5 py-3.5 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Keamanan & Autentikasi */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                  <ShieldIcon />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Keamanan & Autentikasi</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-[#F9FAFB] rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                      <KeyIcon />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1F2937]">Reset Password</h4>
                      <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">Kirimkan link reset password ke email pengguna, atau paksa <br /> pengguna mengganti password pada saat login berikutnya.</p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#1F2937] hover:bg-gray-50 transition-all shadow-sm">
                    Kirim Link Reset
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl cursor-pointer hover:bg-gray-100/50 transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-[#1A3D63] flex items-center justify-center text-white">
                        <CheckIcon />
                      </div>
                      <span className="text-[14px] font-semibold text-[#1F2937]">Wajibkan ubah password saat login</span>
                    </div>
                    <input type="checkbox" className="hidden" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl cursor-pointer hover:bg-gray-100/50 transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md border-2 border-gray-300"></div>
                      <span className="text-[14px] font-semibold text-[#1F2937]">Autentikasi Dua Faktor (2FA)</span>
                    </div>
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded">Non-Aktif</span>
                    <input type="checkbox" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Hak Akses & Role */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center">
                  <BriefcaseIcon />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Hak Akses & Role</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Role Utama (JWT)</label>
                  <div className="relative">
                    <select className="w-full appearance-none px-5 py-3.5 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                      <option>{selectedUser.role}</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <ChevronDownIcon />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 ml-1">Menentukan tingkat akses penuh pada sistem SIAKAD.</p>
                </div>

                <div className="pt-4 space-y-4">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Akses Modul Spesifik</p>
                  {[
                    { label: 'Modul Akademik', active: true },
                    { label: 'Modul Keuangan', active: true },
                    { label: 'Modul Pegawai (HR)', active: true },
                    { label: 'Modul Inventaris', active: false },
                  ].map((mod, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                        mod.active ? 'bg-[#1A3D63] text-white shadow-sm' : 'border-2 border-gray-200 group-hover:border-gray-300'
                      }`}>
                        {mod.active && <CheckIcon />}
                      </div>
                      <span className={`text-[14px] font-semibold transition-colors ${mod.active ? 'text-[#1F2937]' : 'text-gray-400'}`}>
                        {mod.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Akun */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center">
                  <ActivityIcon />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Status Akun</h3>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-green-50/50 border border-green-100 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <h4 className="text-[14px] font-bold text-green-700">Akun Aktif</h4>
                  </div>
                  <p className="text-[11px] text-green-600/70 leading-relaxed ml-5">Pengguna dapat login dan menggunakan sistem secara normal.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#1F2937] hover:bg-gray-50 transition-all shadow-sm">
                    Suspend Akun
                  </button>
                  <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100">
                    <TrashIcon />
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-50 space-y-3">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-medium uppercase tracking-widest">Terakhir Login</span>
                    <span className="text-[#1F2937] font-bold">{selectedUser.lastLogin}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-medium uppercase tracking-widest">Dibuat Pada</span>
                    <span className="text-[#1F2937] font-bold">12 Jan 2021</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Kelola Pengguna Sistem</h1>
          <p className="text-[14px] text-gray-500 mt-1">Manajemen akses akun, role (JWT), dan keamanan.</p>
        </div>
        <button className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-[13px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
          <ShieldIcon />
          <span className="ml-2">Role & Permissions</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama, email, atau ID..." 
              className="pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-[13px] focus:outline-none transition-all w-full md:w-64"
            />
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-gray-600 focus:outline-none w-40">
              <option>Filter Role: Semua</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-gray-600 focus:outline-none w-40">
              <option>Status: Semua</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
        <button className="flex items-center bg-[#1A3D63] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-[#1A3D63]/20 hover:bg-[#0A1931] transition-all">
          <UserPlusIcon />
          Tambah Pengguna
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">No</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Akun / Email</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Role JWT</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Terakhir Login</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ...MOCK_USERS,
                { id: 5, email: 'ahmad.siswa@siakad.id', name: 'Ahmad Ridho', role: 'Siswa', roleColor: 'bg-[#F9FAFB]', roleText: 'text-[#374151]', status: 'Aktif', lastLogin: 'Hari ini, 06:45' },
                { id: 6, email: 'bunga.siswa@siakad.id', name: 'Bunga Citra', role: 'Siswa', roleColor: 'bg-[#F9FAFB]', roleText: 'text-[#374151]', status: 'Aktif', lastLogin: 'Kemarin, 18:30' },
                { id: 7, email: 'eko.guru@siakad.id', name: 'Eko Prasetyo', role: 'Guru', roleColor: 'bg-[#EFF6FF]', roleText: 'text-[#1D4ED8]', status: 'Non-Aktif', lastLogin: '12 Okt 2023, 10:00' },
                { id: 8, email: 'andi.it@siakad.id', name: 'Andi Wijaya, S.Kom', role: 'Admin Modul', roleColor: 'bg-[#F5F3FF]', roleText: 'text-[#7C3AED]', status: 'Aktif', lastLogin: 'Hari ini, 08:00' }
              ].map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[13px] text-gray-500">{index + 1}</td>
                  <td className="px-6 py-5 text-[13px] text-gray-500">{user.email}</td>
                  <td className="px-6 py-5 text-[13px] font-medium text-[#1F2937]">{user.name}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${user.roleColor} ${user.roleText}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                      user.status === 'Aktif' 
                        ? 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]' 
                        : 'bg-[#F9FAFB] text-gray-500 border-gray-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' ? 'bg-[#16A34A]' : 'bg-gray-400'}`}></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] text-gray-500">{user.lastLogin}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-gray-400 hover:text-[#1A3D63] transition-colors" aria-label="Reset Password">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l2.5-2.5"/></svg>
                      </button>
                      <button 
                        onClick={() => handleEditClick(user as UserRecord)}
                        className="text-gray-400 hover:text-[#1A3D63] transition-colors" aria-label="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[13px] text-gray-500">Menampilkan 1 sampai 8 dari 1,384 pengguna</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-[13px] text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">Prev</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A3D63] text-white text-[13px] font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 text-[13px] font-bold transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 text-[13px] font-bold transition-colors">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 text-[13px] font-bold transition-colors">173</button>
            <button className="px-3 py-1.5 text-[13px] text-[#1A3D63] font-bold hover:bg-gray-50 rounded-lg transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers
