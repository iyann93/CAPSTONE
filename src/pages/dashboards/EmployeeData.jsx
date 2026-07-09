import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import EmployeeDetail from "./EmployeeDetail";
import api from "../../api/axios";
const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>;
const ExportIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>;
const BriefcaseIconSmall = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>;
const ChevronDownIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-gray-400">
    <path d="m6 9 6 6 6-6" />
  </svg>;
const EditIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>;
const EditIconSmall = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>;
const TrashIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>;
const UserIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>;
const LinkIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>;
const ActivityIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>;
const SaveIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>;
const UploadIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>;
const PrintIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
  </svg>;
const EyeIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>;
const EmployeeData = () => {
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Form states
  const [form, setForm] = useState({
    nip: "", nama: "", jenisKelamin: "", tanggalLahir: "",
    alamat: "", noTelepon: "", email: "", mataPelajaran: "", status: "Aktif"
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/guru?limit=1000');
      const data = res.data.data || [];
      const mapped = data.map(g => ({
        id: g.id,
        nip: g.nip || "-",
        name: g.nama,
        role: "Guru", 
        roleColor: "bg-[#EFF6FF]", roleText: "text-[#1D4ED8]",
        job: g.mata_pelajaran || "-",
        status: g.is_active ? "Aktif" : "Nonaktif",
        statusColor: g.is_active ? "bg-[#5EE9B5]/10" : "bg-[#FFFBEB]",
        statusText: g.is_active ? "text-[#2B8B67]" : "text-[#D97706]",
        email: g.email || "-",
        alamat: g.alamat || "-",
        jenisKelamin: g.jenis_kelamin || "",
        tanggalLahir: g.tanggal_lahir || "",
        noTelepon: g.no_telepon || ""
      }));
      setEmployees(mapped);
    } catch (err) {
      console.error("Gagal menarik data guru:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.nip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetailClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDetail(true);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setForm({
      nip: employee.nip !== "-" ? employee.nip : "", 
      nama: employee.name, 
      jenisKelamin: employee.jenisKelamin, 
      tanggalLahir: employee.tanggalLahir ? employee.tanggalLahir.split('T')[0] : "",
      alamat: employee.alamat !== "-" ? employee.alamat : "", 
      noTelepon: employee.noTelepon, 
      email: employee.email !== "-" ? employee.email : "", 
      mataPelajaran: employee.job !== "-" ? employee.job : "", 
      status: employee.status
    });
    setIsEditing(true);
  };
  const handleAddClick = () => {
    setForm({
      nip: "", nama: "", jenisKelamin: "", tanggalLahir: "",
      alamat: "", noTelepon: "", email: "", mataPelajaran: "", status: "Aktif"
    });
    setIsAdding(true);
  };

  const handleSaveAdd = async () => {
    try {
      await api.post('/guru', {
        nip: form.nip,
        nama: form.nama,
        jenis_kelamin: form.jenisKelamin,
        tanggal_lahir: form.tanggalLahir || null,
        alamat: form.alamat,
        no_telepon: form.noTelepon,
        email: form.email,
        mata_pelajaran: form.mataPelajaran
      });
      await fetchEmployees();
      setIsAdding(false);
      showToast("Berhasil menambahkan data pegawai", "success");
    } catch (err) {
      let errorMsg = err.response?.data?.message || err.message;
      if (err.response?.data?.errors) {
        errorMsg += "\n" + err.response.data.errors.map(e => e.msg).join("\n");
      }
      showToast("Gagal menambahkan data: " + errorMsg, "error");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/guru/${selectedEmployee.id}`, {
        nip: form.nip,
        nama: form.nama,
        jenis_kelamin: form.jenisKelamin,
        tanggal_lahir: form.tanggalLahir || null,
        alamat: form.alamat,
        no_telepon: form.noTelepon,
        email: form.email,
        mata_pelajaran: form.mataPelajaran,
        is_active: form.status === "Aktif"
      });
      await fetchEmployees();
      setIsEditing(false);
      showToast("Berhasil memperbarui data pegawai", "success");
    } catch (err) {
      let errorMsg = err.response?.data?.message || err.message;
      if (err.response?.data?.errors) {
        errorMsg += "\n" + err.response.data.errors.map(e => e.msg).join("\n");
      }
      showToast("Gagal memperbarui data: " + errorMsg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data pegawai ini?")) {
      try {
        await api.delete(`/guru/${id}`);
        await fetchEmployees();
        showToast("Berhasil menghapus data pegawai", "success");
      } catch (err) {
        showToast("Gagal menghapus data: " + (err.response?.data?.message || err.message), "error");
      }
    }
  };
  if (isDetail && selectedEmployee) {
    return <EmployeeDetail employee={selectedEmployee} onBack={() => setIsDetail(false)} onEdit={(e) => { setIsDetail(false); handleEditClick(e); }} />;
  }
  if (isAdding) {
    return <div className="animate-fadeIn space-y-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
              <span className="cursor-pointer hover:text-[#1A3D63]" onClick={() => setIsAdding(false)}>Data Guru & Karyawan</span>
              <span>&rsaquo;</span>
              <span className="text-[#1A3D63]">Tambah Pegawai</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Tambah Pegawai Baru</h1>
            <p className="text-[14px] text-gray-500">Masukkan informasi pribadi, data kepegawaian, dan penugasan.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAdding(false)} className="px-6 py-2.5 rounded-lg border border-gray-200 text-[13px] font-bold text-[#1F2937] bg-white hover:bg-gray-50 shadow-sm transition-all">
              × Batal
            </button>
            <button onClick={handleSaveAdd} className="flex items-center bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg shadow-[#1A3D63]/20 transition-all">
              <SaveIcon />
              Simpan Pegawai
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <UserIcon />
                  Informasi Pribadi
                </h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nama Lengkap (beserta gelar)</label>
                    <input type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} placeholder="Masukkan nama lengkap..." className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Tempat Lahir</label>
                    <input type="text" placeholder="Kota kelahiran" className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Tanggal Lahir</label>
                    <div className="relative">
                      <input type="date" value={form.tanggalLahir} onChange={e => setForm({...form, tanggalLahir: e.target.value})} className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Jenis Kelamin</label>
                    <div className="relative">
                      <select value={form.jenisKelamin} onChange={e => setForm({...form, jenisKelamin: e.target.value})} className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option value="">Pilih jenis kelamin...</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Agama</label>
                    <div className="relative">
                      <select className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option value="">Pilih agama...</option>
                        <option>Islam</option>
                        <option>Kristen</option>
                        <option>Katolik</option>
                        <option>Hindu</option>
                        <option>Buddha</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nomor Telepon / WhatsApp</label>
                    <input type="text" value={form.noTelepon} onChange={e => setForm({...form, noTelepon: e.target.value})} placeholder="0812xxxx..." className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Alamat Email Pribadi</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@contoh.com" className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Alamat Lengkap</label>
                    <textarea rows={3} value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} placeholder="Masukkan alamat domisili..." className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all resize-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <BriefcaseIconSmall />
                  Data Kepegawaian
                </h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nomor Induk Pegawai (NIP)</label>
                    <input type="text" maxLength={6} value={form.nip} onChange={e => setForm({...form, nip: e.target.value.replace(/\\D/g, '')})} placeholder="Masukkan 6 angka NIP..." className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Mata Pelajaran yang Diampu</label>
                    <input type="text" value={form.mataPelajaran} onChange={e => setForm({...form, mataPelajaran: e.target.value})} placeholder="Misal: Matematika, Bahasa Inggris" className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Status Kepegawaian</label>
                    <div className="relative">
                      <select className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option value="">Pilih status...</option>
                        <option>Pegawai Negeri Sipil (PNS)</option>
                        <option>Pegawai Pemerintah (PPPK)</option>
                        <option>Guru Honorer</option>
                        <option>Staf Honorer</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Jabatan / Tugas Utama</label>
                    <div className="relative">
                      <select className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option value="">Pilih jabatan...</option>
                        <option>Guru Mata Pelajaran</option>
                        <option>Wali Kelas</option>
                        <option>Kepala Sekolah</option>
                        <option>Staf Tata Usaha</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 mb-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-2 opacity-40"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                <span className="text-[10px] font-bold">Unggah Foto</span>
              </div>
              <p className="text-[10px] text-gray-400">Format: JPG, PNG. Maks 2MB. Disarankan rasio 1:1.</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[14px] font-bold text-[#1F2937] flex items-center">
                  <LinkIcon />
                  Akun Sistem SIAKAD
                </h3>
              </div>
              <div className="p-6">
                <div className="py-8 px-4 bg-gray-50 border border-gray-100 border-dashed rounded-2xl flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1F2937]">Akun Belum Dibuat</h4>
                  <p className="text-[10px] text-gray-400 mt-2 leading-relaxed px-4">
                    Setelah data pegawai disimpan, sistem akan otomatis membuatkan akun berdasarkan email pribadi atau NIP.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[14px] font-bold text-[#1F2937] flex items-center">
                  <ActivityIcon />
                  Status Pegawai
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Set Status Awal</label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[13px] font-semibold text-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                      <option className="text-[#16A34A]">â— Aktif</option>
                      <option className="text-yellow-600">â— Cuti</option>
                      <option className="text-red-600">â— Non-Aktif</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed px-1">
                  Pegawai dengan status aktif akan muncul pada daftar penugasan jadwal dan penggajian bulan berjalan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  if (isEditing && selectedEmployee) {
    return <div className="animate-fadeIn space-y-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
              <span className="cursor-pointer hover:text-[#1A3D63]" onClick={() => setIsEditing(false)}>DATA GURU</span>
              <span>›</span>
              <span className="text-[#1A3D63]">Edit Pegawai</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Edit Pegawai: {selectedEmployee.name}</h1>
            <p className="text-[14px] text-gray-500">Perbarui informasi pribadi, data kepegawaian, dan penugasan.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-lg border border-gray-200 text-[13px] font-bold text-[#1F2937] bg-white hover:bg-gray-50 shadow-sm transition-all">
              × Batal
            </button>
            <button onClick={handleSaveEdit} className="flex items-center bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg shadow-[#1A3D63]/20 transition-all">
              <SaveIcon />
              Simpan Perubahan
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <UserIcon />
                  Informasi Pribadi
                </h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nama Lengkap (beserta gelar)</label>
                    <input type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Tanggal Lahir</label>
                    <div className="relative">
                      <input type="date" value={form.tanggalLahir} onChange={e => setForm({...form, tanggalLahir: e.target.value})} className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Jenis Kelamin</label>
                    <div className="relative">
                      <select value={form.jenisKelamin} onChange={e => setForm({...form, jenisKelamin: e.target.value})} className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option value="">Pilih jenis kelamin...</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nomor Telepon / WhatsApp</label>
                    <input type="text" value={form.noTelepon} onChange={e => setForm({...form, noTelepon: e.target.value})} className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Alamat Email Pribadi</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Alamat Lengkap</label>
                    <textarea rows={3} value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all resize-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <BriefcaseIconSmall />
                  Data Kepegawaian
                </h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nomor Induk Pegawai (NIP)</label>
                    <input type="text" maxLength={6} value={form.nip} onChange={e => setForm({...form, nip: e.target.value.replace(/\\D/g, '')})} placeholder="Masukkan 6 angka NIP..." className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Mata Pelajaran yang Diampu</label>
                    <input type="text" value={form.mataPelajaran} onChange={e => setForm({...form, mataPelajaran: e.target.value})} className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-2xl bg-[#E5E7EB] flex items-center justify-center text-[#1A3D63] font-black text-4xl shadow-inner">
                {selectedEmployee.name ? selectedEmployee.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : "U"}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <LinkIcon />
                  Akun Sistem Tertaut
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#B3CFE5] text-white flex items-center justify-center font-bold text-lg">
                    @
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1F2937]">{form.email || "belum_diset@siakad.id"}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Role Utama: Guru</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#1F2937] hover:bg-gray-50 transition-all shadow-sm">
                  <EditIconSmall />
                  Kelola Akses Akun
                </button>
                <p className="text-[10px] text-gray-400 text-center px-2 leading-relaxed">
                  Untuk mereset password atau mengubah role, silakan ke menu Kelola Pengguna.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <ActivityIcon />
                  Status Pegawai
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className={`p-4 border rounded-xl ${selectedEmployee.status === "Aktif" ? "bg-[#F0FDF4] border-[#DCFCE7]" : "bg-gray-50 border-gray-100"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${selectedEmployee.status === "Aktif" ? "bg-[#16A34A] animate-pulse" : "bg-gray-400"}`} />
                    <h4 className={`text-[13px] font-bold ${selectedEmployee.status === "Aktif" ? "text-[#1F2937]" : "text-gray-600"}`}>Status: {selectedEmployee.status}</h4>
                  </div>
                  <p className="text-[10px] text-gray-500 ml-4">Pegawai bertugas aktif</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Ubah Status</label>
                  <div className="relative">
                    <select value={form.status === "Aktif" ? "Aktif Mengajar" : "Non-Aktif"} onChange={e => setForm({...form, status: e.target.value === "Aktif Mengajar" ? "Aktif" : "Nonaktif"})} className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[13px] font-semibold text-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                      <option value="Aktif Mengajar" className="text-[#16A34A]">Aktif Mengajar</option>
                      <option value="Non-Aktif" className="text-red-600">Non-Aktif</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="animate-fadeIn space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24" className="text-[#1A3D63]">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
          </svg>
          <div>
            <h1 className="text-[20px] font-bold text-[#1F2937] tracking-tight">DATA GURU</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Total {employees.length} Pegawai</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-[13px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
            <ExportIcon />
            <span>Export Excel</span>
          </button>
          <button onClick={handleAddClick} className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#0A1931] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] shadow-lg shadow-primary-900/10 transition-all">
            <span className="text-base leading-none font-medium">+</span>
            <span>Tambah Pegawai</span>
          </button>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Cari NIP atau Nama Lengkap..." 
            className="pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-[13px] focus:outline-none transition-all w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-gray-600 focus:outline-none w-44">
              <option>Semua Peran</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-gray-600 focus:outline-none w-44">
              <option>Status: Aktif</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
          <div className="hidden lg:block text-[13px] text-gray-400 font-medium ml-4">
            Menampilkan <span className="text-[#1F2937] font-bold">{filteredEmployees.length} dari {employees.length}</span> data
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">NIP / ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Peran</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Jabatan / Mapel</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right pr-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((e) => <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[13px] text-gray-400 tracking-tight">{e.nip !== "-" ? e.nip?.substring(0, 6) : "-"}</td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[#1F2937]">{e.name}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${e.roleColor} ${e.roleText}`}>
                      {e.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[13px] text-gray-500 font-medium">{e.job}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${e.statusColor} ${e.statusText}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${e.status === "Aktif" ? "bg-[#5EE9B5]" : "bg-[#D97706]"}`} />
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 pr-6">
                       <button onClick={() => handleDetailClick(e)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><EyeIcon /></button>
                       <button onClick={() => handleEditClick(e)} className="p-1.5 text-gray-400 hover:text-[#1A3D63] transition-colors" aria-label="Edit">
                         <EditIcon />
                       </button>
                       <button onClick={() => handleDelete(e.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
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
    </div>;
};
var EmployeeData_default = EmployeeData;
export {
  EmployeeData_default as default
};



