import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { getAllSystemUsers, createSystemUser, updateSystemUser, deleteSystemUser, getRoles, getSiswaDropdown } from "../../api/system";

const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const UserPlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="mr-1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></svg>;
const ShieldIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const UserIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const EditIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;
const TrashIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const KeyIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l2.5-2.5" /></svg>;
const ChevronDownIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>;
const ArrowLeftIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const SaveIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const EyeOffIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>;
const ActivityIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
const LockIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const SendIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;

const MOCK_USERS = []; // Removed, now using API

const ManageUsers = ({ onViewChange }) => {
  const [view, setView] = useState("list"); // "list", "add", "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    roleId: '',
    siswaId: '',
    isActive: true
  });
  const [siswaList, setSiswaList] = useState([]);
  
  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersData, rolesData, siswaData] = await Promise.all([
        getAllSystemUsers(),
        getRoles(),
        getSiswaDropdown()
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setSiswaList(Array.isArray(siswaData) ? siswaData : []);
    } catch (e) {
      console.error(e);
      triggerToast('Gagal memuat data pengguna', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [userForReset, setUserForReset] = useState(null);
  const [resetMethod, setResetMethod] = useState("email");
  const [resetPasswordManual, setResetPasswordManual] = useState("");
  const [resetRequireChange, setResetRequireChange] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || u.user || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = true;
    if (filterRole !== "Semua") {
      const userRole = (u.role || "").toLowerCase();
      const filterR = filterRole.toLowerCase();
      // Handle mapping "Admin Global" -> "super admin" / "admin" if necessary, but "Admin" usually works.
      matchesRole = userRole.includes(filterR.replace(' global', ''));
    }

    let matchesStatus = true;
    if (filterStatus === "Aktif") {
      matchesStatus = u.is_active === true;
    } else if (filterStatus === "Nonaktif") {
      matchesStatus = u.is_active === false;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSaveUser = async () => {
    if (!formData.nama || !formData.email || (!selectedUser && !formData.password)) {
      return triggerToast('Harap isi semua field wajib', 'error');
    }
    
    try {
      if (selectedUser) {
        await updateSystemUser(selectedUser.id, formData);
        triggerToast('Pengguna berhasil diperbarui');
      } else {
        await createSystemUser(formData);
        triggerToast('Pengguna berhasil ditambahkan');
      }
      setView("list");
      fetchData();
    } catch (e) {
      console.error(e);
      triggerToast(e.response?.data?.message || 'Gagal menyimpan data pengguna', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
    try {
      await deleteSystemUser(id);
      triggerToast("Pengguna berhasil dihapus");
      fetchData();
    } catch (e) {
      console.error(e);
      triggerToast("Gagal menghapus pengguna", "error");
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) {
      triggerToast('Tidak ada data untuk diekspor', 'error');
      return;
    }
    
    // Headers
    const headers = ['ID', 'Nama Lengkap', 'Email/Username', 'Role', 'Status', 'Terakhir Login', 'Tanggal Daftar'];
    
    // Rows
    const rows = users.map(u => [
      u.id,
      `"${u.name || ''}"`,
      `"${u.email || u.user || ''}"`,
      `"${u.role || ''}"`,
      u.is_active ? 'Aktif' : (!u.role || u.role.trim() === '' ? 'Pending' : 'Nonaktif'),
      `"${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Belum Login'}"`,
      `"${u.created_at ? new Date(u.created_at).toLocaleString() : ''}"`
    ]);
    
    // Combine
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_pengguna_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerToast('Data berhasil diekspor ke CSV');
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const openResetModal = (user) => {
    setUserForReset(user);
    setResetMethod("email");
    setResetPasswordManual("");
    setResetRequireChange(false);
    setShowResetModal(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      nama: user.name || '',
      email: user.email || '',
      password: '', // blank on edit
      roleId: roles.find(r => r.nama_role === user.role)?.id || '',
      siswaId: user.linked_siswa_id || '', // pre-fill dari relasi yang sudah ada
      isActive: user.is_active
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setView("edit");
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setFormData({ nama: '', email: '', password: '', roleId: '', siswaId: '', isActive: true });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setView("add");
  };

  if (view === "add" || view === "edit") {
    const isAdd = view === "add";
    const title = isAdd ? "Tambah Pengguna Baru" : "Edit Pengguna";
    const subtitle = isAdd ? "Masukkan detail informasi untuk membuat akun pengguna baru di sistem." : "Perbarui informasi akun, role, atau status pengguna.";
    
    return (
      <div className="animate-fadeIn space-y-6 pb-20 max-w-4xl mx-auto">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-bold shadow-xl ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
          }`}>{toast.msg}</div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-[#1A3D63] transition-colors mb-3">
              <ArrowLeftIcon /> Kembali ke Daftar
            </button>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">{subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setView("list")}
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all bg-white shadow-sm"
            >
              Batal
            </button>
            <button onClick={handleSaveUser} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#1A3D63] hover:bg-[#122A44] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#1A3D63]/20 transition-all">
              <SaveIcon />
              {isAdd ? "Simpan Pengguna" : "Simpan Perubahan"}
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Informasi Akun */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1A3D63]">
                <UserIcon />
              </div>
              <h3 className="text-base font-bold text-gray-800">Informasi Akun</h3>
            </div>
            <div className="space-y-5">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap pengguna..."
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email / Username</label>
                <input
                  type="email"
                  placeholder="contoh: budi@sch.id"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Role (Hak Akses)</label>
                <div className="relative">
                  <select 
                    value={formData.roleId}
                    onChange={(e) => setFormData({...formData, roleId: e.target.value, siswaId: ''})}
                    className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all cursor-pointer focus:ring-1 focus:ring-[#1A3D63]"
                  >
                    <option value="" disabled>Pilih peran/role...</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.nama_role}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Pilih Anak — muncul hanya saat role Orang Tua */}
              {roles.find(r => r.id === formData.roleId)?.nama_role === 'Orang Tua' && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <label className="block text-sm font-bold text-amber-700">Hubungkan ke Siswa/Anak <span className="text-red-500">*</span></label>
                  </div>
                  <p className="text-xs text-amber-600">Pilih nama siswa yang merupakan anak dari orang tua ini. Data tagihan SPP dan informasi anak akan ditampilkan di dashboard orang tua.</p>
                  <div className="relative">
                    <select
                      value={formData.siswaId}
                      onChange={(e) => setFormData({...formData, siswaId: e.target.value})}
                      className="w-full appearance-none px-4 py-3 bg-white border border-amber-200 focus:border-amber-400 rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all cursor-pointer focus:ring-1 focus:ring-amber-300"
                    >
                      <option value="">-- Pilih nama siswa --</option>
                      {siswaList.map(s => (
                        <option key={s.id} value={s.id} disabled={!!s.linked_user_id && s.linked_user_id !== selectedUser?.id}>
                          {s.nama_lengkap} ({s.nis}) {s.nama_kelas ? `— ${s.nama_kelas}` : ''}{s.linked_user_id && s.linked_user_id !== selectedUser?.id ? ' ✗ Sudah terhubung' : ''}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-amber-400">
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Keamanan / Reset Password */}
          {isAdd ? (
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <LockIcon />
                </div>
                <h3 className="text-base font-bold text-gray-800">Keamanan Akun</h3>
              </div>
              
              <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password Sementara</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password awal"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all pr-10 focus:ring-1 focus:ring-[#1A3D63]"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <EyeOffIcon />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Minimal 8 karakter, kombinasi huruf dan angka.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      defaultValue="12345678"
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all pr-10 focus:ring-1 focus:ring-[#1A3D63]"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <EyeOffIcon />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400">Minimal 8 karakter, kombinasi huruf dan angka.</p>
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center bg-[#1A3D63] border-2 border-[#1A3D63]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Wajib Ganti Password</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pengguna akan diminta mengganti password pada saat login pertama kali.</p>
                </div>
              </label>
              </div>
            </div>
          ) : (
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <KeyIcon />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Reset Password</h3>
                </div>
                <button className="text-sm font-bold text-[#1A3D63] hover:underline">Kirim Link Reset ke Email</button>
              </div>
              
              <div className="pl-0 md:pl-13 space-y-6">
                <div className="max-w-md">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Set Password Baru (Opsional)</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Kosongkan jika tidak diubah"
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all pr-10 focus:ring-1 focus:ring-[#1A3D63]"
                    />
                    <button className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                      <EyeOffIcon />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Minimal 8 karakter, kombinasi huruf dan angka.</p>
                </div>
                
                 <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors border-2 border-gray-200 bg-white group-hover:border-gray-300">
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Wajib Ganti Password</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pengguna akan diminta mengganti password pada saat login berikutnya.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Status Pengguna */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <ActivityIcon />
              </div>
              <h3 className="text-base font-bold text-gray-800">Status Pengguna</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${formData.isActive ? "border-[#1A3D63] bg-blue-50/20" : "border-gray-200 bg-white hover:border-gray-300 transition-colors"}`}>
                <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.isActive ? "border-[#1A3D63]" : "border-gray-300"}`}>
                  {formData.isActive && <div className="w-2 h-2 rounded-full bg-[#1A3D63]"></div>}
                </div>
                <input type="radio" name="status" className="hidden" checked={formData.isActive} onChange={() => setFormData({...formData, isActive: true})} />
                <div>
                  <p className="text-sm font-bold text-gray-800">{isAdd ? "Aktif (Segera)" : "Aktif"}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {isAdd ? "Akun dapat langsung digunakan oleh pengguna." : "Akun dapat digunakan untuk login ke sistem."}
                  </p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${!formData.isActive ? "border-red-500 bg-red-50/20" : "border-gray-200 bg-white hover:border-gray-300 transition-colors"}`}>
                <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${!formData.isActive ? "border-red-500" : "border-gray-300"}`}>
                  {!formData.isActive && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                </div>
                <input type="radio" name="status" className="hidden" checked={!formData.isActive} onChange={() => setFormData({...formData, isActive: false})} />
                <div>
                  <p className="text-sm font-bold text-gray-800">{isAdd ? "Menunggu Verifikasi" : "Nonaktifkan Akun"}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {isAdd ? "Memerlukan persetujuan Super Admin atau Kepsek." : "Mencegah pengguna login ke dalam sistem."}
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-bold shadow-xl ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>{toast.msg}</div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          {onViewChange && (
            <button 
              onClick={() => onViewChange("Dashboard")}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1A3D63] transition-colors mb-3"
            >
              <ArrowLeftIcon />
              Kembali ke Dashboard
            </button>
          )}
          <h1 className="text-[26px] font-black text-gray-800 tracking-tight">Kelola Akun Pengguna</h1>
          <p className="text-[14px] text-gray-400 mt-1 font-medium">Melihat, menambah, dan mengelola seluruh akun pengguna dalam sistem.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button onClick={exportToCSV} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-[14px] text-[13px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export Data
          </button>
          <button onClick={handleAddClick} className="flex items-center justify-center gap-2 bg-[#1A3D63] text-white px-6 py-3 rounded-[14px] text-[13px] font-bold shadow-md shadow-[#1A3D63]/20 hover:bg-[#122A44] transition-all active:scale-95">
            <UserPlusIcon />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="px-8 py-7 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-80 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A3D63] transition-colors">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cari nama, username, atau ID..."
              className="w-full pl-12 pr-6 py-3.5 bg-gray-50/80 border border-transparent focus:bg-white focus:border-gray-200 rounded-[20px] text-[13px] font-bold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="appearance-none bg-gray-50/80 border border-transparent focus:bg-white focus:border-gray-200 rounded-[20px] pl-5 pr-10 py-3.5 text-[13px] font-bold text-gray-600 outline-none w-36 cursor-pointer transition-all"
              >
                <option value="Semua">Role: Semua</option>
                <option value="Admin">Admin</option>
                <option value="Guru">Guru</option>
                <option value="Siswa">Siswa</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Bendahara">Bendahara</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDownIcon />
              </div>
            </div>
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-gray-50/80 border border-transparent focus:bg-white focus:border-gray-200 rounded-[20px] pl-5 pr-10 py-3.5 text-[13px] font-bold text-gray-600 outline-none w-40 cursor-pointer transition-all"
              >
                <option value="Semua">Status: Semua</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-50 bg-white">
                <th className="px-8 py-5 w-12 text-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1A3D63] focus:ring-[#1A3D63]/20" /></th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Pengguna & Email</th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Role / Status</th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Terakhir Login</th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80 bg-white">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Memuat data pengguna...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Tidak ada pengguna yang cocok</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 text-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1A3D63] focus:ring-[#1A3D63]/20" /></td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center text-[13px] font-bold text-gray-600">
                          {getInitials(user.name)}
                       </div>
                       <div>
                          <div className="text-[14px] font-bold text-gray-800">{user.name}</div>
                          <div className="text-[12px] text-gray-400 font-medium mt-0.5">{user.user}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center justify-between gap-4 max-w-[200px]">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2.5 py-1 rounded-md">{user.role || 'Tanpa Role'}</span>
                      </div>
                      {user.is_active ? (
                        <div className="flex items-center gap-1.5 ml-4">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-[13px] font-bold text-green-600">Aktif</span>
                        </div>
                      ) : (!user.role || user.role.trim() === '') ? (
                        <div className="flex items-center gap-1.5 ml-4">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-[13px] font-bold text-amber-500">Pending</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 ml-4">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-[13px] font-bold text-red-500">Nonaktif</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-6 text-[13px] font-medium text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Belum Login'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-300">
                      <button onClick={() => openResetModal(user)} className="hover:text-orange-500 transition-colors p-1" title="Reset Password"><KeyIcon /></button>
                      <button onClick={() => handleEditClick(user)} className="hover:text-blue-600 transition-colors p-1" title="Edit Pengguna"><EditIcon /></button>
                      <button onClick={() => handleDelete(user.id)} className="hover:text-red-500 transition-colors p-1" title="Hapus Pengguna"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && userForReset && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <KeyIcon />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Reset Password</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Atur ulang kata sandi untuk pengguna.</p>
                </div>
              </div>
              <button onClick={() => setShowResetModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* User Preview */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                  {userForReset.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{userForReset.name}</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{userForReset.user} &bull; {userForReset.role}</p>
                </div>
              </div>

              {/* Reset Methods */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Pilih Metode Reset</label>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${resetMethod === "email" ? "border-[#1A3D63] bg-blue-50/30" : "border-gray-200 bg-white"}`}>
                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${resetMethod === "email" ? "border-[#1A3D63]" : "border-gray-300"}`}>
                      {resetMethod === "email" && <div className="w-2 h-2 rounded-full bg-[#1A3D63]"></div>}
                    </div>
                    <input type="radio" name="resetMethod" className="hidden" checked={resetMethod === "email"} onChange={() => setResetMethod("email")} />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Kirim Link Reset ke Email</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Sistem akan mengirimkan link khusus ke {userForReset.email} agar pengguna dapat mengatur password sendiri.</p>
                    </div>
                  </label>
                  
                  <label className={`flex flex-col gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${resetMethod === "manual" ? "border-[#1A3D63] bg-blue-50/30" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${resetMethod === "manual" ? "border-[#1A3D63]" : "border-gray-300"}`}>
                        {resetMethod === "manual" && <div className="w-2 h-2 rounded-full bg-[#1A3D63]"></div>}
                      </div>
                      <input type="radio" name="resetMethod" className="hidden" checked={resetMethod === "manual"} onChange={() => setResetMethod("manual")} />
                      <p className="text-sm font-bold text-gray-800">Atur Password Manual</p>
                    </div>
                    
                    {/* Manual Input (Always visible but styled differently or just visible when active. Design shows it inside the card) */}
                    <div className="pl-7 pr-2 space-y-3">
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Ketik password baru..."
                          value={resetPasswordManual}
                          onChange={(e) => setResetPasswordManual(e.target.value)}
                          disabled={resetMethod !== "manual"}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63] disabled:opacity-50 disabled:bg-gray-50"
                        />
                        <button className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled={resetMethod !== "manual"}>
                          <EyeOffIcon />
                        </button>
                      </div>
                      <label className={`flex items-center gap-2 cursor-pointer ${resetMethod !== "manual" ? "opacity-50 pointer-events-none" : ""}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${resetRequireChange ? 'bg-[#1A3D63] border-[#1A3D63]' : 'border-gray-300 bg-white'}`}>
                          {resetRequireChange && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <input type="checkbox" className="hidden" disabled={resetMethod !== "manual"} checked={resetRequireChange} onChange={(e) => setResetRequireChange(e.target.checked)} />
                        <span className="text-xs font-semibold text-gray-600">Wajib ganti password saat login</span>
                      </label>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
              <button onClick={() => setShowResetModal(false)} className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2.5">Batal</button>
              <button
                onClick={async () => {
                  try {
                    if (resetMethod === "manual") {
                      await updateSystemUser(userForReset.id, { password: resetPasswordManual });
                      triggerToast("Password berhasil disimpan", "success");
                    } else {
                      const { sendResetPasswordEmail } = await import("../../api/system");
                      await sendResetPasswordEmail(userForReset.id);
                      triggerToast("Link reset berhasil dikirim ke email", "success");
                    }
                    setShowResetModal(false);
                  } catch (e) {
                    triggerToast("Gagal memproses permintaan", "error");
                  }
                }}
                disabled={resetMethod === "manual" && resetPasswordManual.length < 6}
                className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1A3D63]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {resetMethod === "manual" ? <SaveIcon /> : <SendIcon />}
                {resetMethod === "manual" ? "Simpan Password" : "Kirim Link Reset"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageUsers;



