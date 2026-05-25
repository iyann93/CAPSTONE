import { useState } from "react";
const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>;
const ExportIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>;
const ChevronDownIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-gray-400">
    <path d="m6 9 6 6 6-6" />
  </svg>;
const EditIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>;
const TrashIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>;
const UserIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>;
const UsersIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>;
const BookIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
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
const MOCK_STUDENTS = [
  { id: 1, nisn: "0051234567", name: "Ahmad Ridho", class: "X IPA 1", gender: "Laki-laki", status: "Aktif", birthPlace: "Jakarta", birthDate: "2008-05-12", religion: "Islam", email: "ahmad.ridho@siswa.siakad.id" },
  { id: 2, nisn: "0051234568", name: "Bunga Citra", class: "X IPA 1", gender: "Perempuan", status: "Aktif", birthPlace: "Bandung", birthDate: "2008-07-21", religion: "Islam", email: "bunga.citra@siswa.siakad.id" },
  { id: 3, nisn: "0051234569", name: "Candra Wijaya", class: "XI IPS 2", gender: "Laki-laki", status: "Aktif", birthPlace: "Surabaya", birthDate: "2007-03-10", religion: "Kristen", email: "candra.wijaya@siswa.siakad.id" },
  { id: 4, nisn: "0051234570", name: "Diana Putri", class: "XI IPS 2", gender: "Perempuan", status: "Aktif", birthPlace: "Semarang", birthDate: "2007-11-05", religion: "Islam", email: "diana.putri@siswa.siakad.id" },
  { id: 5, nisn: "0051234571", name: "Eko Prasetyo", class: "XII IPA 3", gender: "Laki-laki", status: "Non-Aktif", birthPlace: "Malang", birthDate: "2006-01-15", religion: "Islam", email: "eko.prasetyo@siswa.siakad.id" },
  { id: 6, nisn: "0051234572", name: "Fahri Hamzah", class: "XII IPA 3", gender: "Laki-laki", status: "Aktif" },
  { id: 7, nisn: "0051234573", name: "Gita Savitri", class: "X IPS 1", gender: "Perempuan", status: "Aktif" },
  { id: 8, nisn: "0051234574", name: "Hadi Kusuma", class: "X IPS 1", gender: "Laki-laki", status: "Aktif" }
];
const StudentData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
  };

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nisn.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (isEditing && selectedStudent) {
    return <div className="animate-fadeIn space-y-6 pb-20">
        {
      /* Breadcrumb & Header */
    }
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
              <span className="cursor-pointer hover:text-[#1A3D63]" onClick={() => setIsEditing(false)}>Data Siswa</span>
              <span>›</span>
              <span className="text-[#1A3D63]">Edit Siswa</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Edit Siswa: {selectedStudent.name}</h1>
            <p className="text-[14px] text-gray-500">Perbarui informasi pribadi, akademik, dan kontak wali murid.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
      onClick={() => setIsEditing(false)}
      className="px-6 py-2.5 rounded-lg border border-gray-200 text-[13px] font-bold text-[#1F2937] bg-white hover:bg-gray-50 shadow-sm transition-all"
    >
              × Batal
            </button>
            <button className="flex items-center bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg shadow-[#1A3D63]/20 transition-all">
              <SaveIcon />
              Simpan Perubahan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {
      /* Left Column */
    }
          <div className="lg:col-span-8 space-y-6">
            {
      /* Informasi Pribadi */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <UserIcon />
                  Informasi Pribadi
                </h3>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nama Lengkap</label>
                    <input
      type="text"
      defaultValue={selectedStudent.name}
      className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">NISN</label>
                    <input
      type="text"
      defaultValue={selectedStudent.nisn}
      className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Tempat Lahir</label>
                    <input
      type="text"
      defaultValue={selectedStudent.birthPlace || ""}
      placeholder="Contoh: Jakarta"
      className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Tanggal Lahir</label>
                    <input
      type="date"
      defaultValue={selectedStudent.birthDate || ""}
      className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Jenis Kelamin</label>
                    <div className="relative">
                      <select defaultValue={selectedStudent.gender} className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option>Laki-laki</option>
                        <option>Perempuan</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Agama</label>
                    <div className="relative">
                      <select defaultValue={selectedStudent.religion || "Islam"} className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
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
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Alamat Lengkap</label>
                    <textarea
      rows={3}
      placeholder="Masukkan alamat domisili saat ini..."
      defaultValue="Jl. Merdeka Barat No. 45, Kebayoran Baru, Jakarta Selatan"
      className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all resize-none"
    />
                  </div>
                </div>
              </div>
            </div>

            {
      /* Informasi Akademik */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <BookIcon />
                  Informasi Akademik
                </h3>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Nomor Induk Siswa (NIS)</label>
                    <input
      type="text"
      defaultValue="21221001"
      className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Tahun Masuk</label>
                    <input
      type="text"
      defaultValue="2023"
      className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Kelas Saat Ini</label>
                    <div className="relative">
                      <select defaultValue={selectedStudent.class} className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option>X IPA 1</option>
                        <option>X IPS 1</option>
                        <option>XI IPS 2</option>
                        <option>XII IPA 1</option>
                        <option>XII IPA 3</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Jurusan / Peminatan</label>
                    <div className="relative">
                      <select defaultValue="Ilmu Pengetahuan Alam (IPA)" className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                        <option>Ilmu Pengetahuan Alam (IPA)</option>
                        <option>Ilmu Pengetahuan Sosial (IPS)</option>
                        <option>Bahasa</option>
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

          {
      /* Right Column */
    }
          <div className="lg:col-span-4 space-y-6">
            {
      /* Foto Profil */
    }
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-2xl bg-[#D5E3EF] flex items-center justify-center text-[#1A3D63] font-black text-4xl mb-6 shadow-inner">
                {selectedStudent.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
              </div>
              
              <div className="flex items-center gap-2 w-full mb-3">
                <button className="flex-1 flex items-center justify-center bg-[#F3F4F6] hover:bg-gray-200 text-[#1F2937] px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all">
                  <UploadIcon />
                  Ganti Foto
                </button>
                <button className="px-3.5 py-2.5 bg-blue-50 text-[#4A7FA7] border border-blue-100 rounded-xl hover:bg-blue-100 transition-all">
                  <TrashIcon />
                </button>
              </div>
              <p className="text-[10px] text-gray-400">Format: JPG/PNG. Maks. 2MB. Resolusi disarankan 1:1.</p>
            </div>

            {
      /* Data Orang Tua / Wali */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <UsersIcon />
                  Data Orang Tua / Wali
                </h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Nama Ayah</label>
                  <input
      type="text"
      defaultValue="Bambang Suryo"
      className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none"
    />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Nama Ibu</label>
                  <input
      type="text"
      defaultValue="Siti Mardiyah"
      className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none"
    />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Nomor Telepon Darurat</label>
                  <input
      type="text"
      defaultValue="+62 813 9876 5432"
      className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none"
    />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Pekerjaan Wali</label>
                  <input
      type="text"
      defaultValue="Wiraswasta"
      className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[14px] font-semibold text-[#1F2937] focus:outline-none"
    />
                </div>
              </div>
            </div>

            {
      /* Status Siswa */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <ActivityIcon />
                  Status Siswa
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className={`p-4 border rounded-xl ${selectedStudent.status === "Aktif" ? "bg-[#F0FDF4] border-[#DCFCE7]" : "bg-gray-50 border-gray-100"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${selectedStudent.status === "Aktif" ? "bg-[#16A34A] animate-pulse" : "bg-gray-400"}`} />
                    <h4 className={`text-[13px] font-bold ${selectedStudent.status === "Aktif" ? "text-[#16A34A]" : "text-gray-600"}`}>Status: {selectedStudent.status}</h4>
                  </div>
                  <p className="text-[10px] text-gray-500 ml-4">Siswa berstatus aktif pada tahun ajaran ini</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Ubah Status</label>
                  <div className="relative">
                    <select defaultValue={selectedStudent.status} className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[13px] font-semibold text-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all">
                      <option className="text-[#16A34A]">Aktif</option>
                      <option className="text-gray-600">Non-Aktif</option>
                      <option className="text-blue-600">Lulus</option>
                      <option className="text-red-600">Pindah</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#1F2937] hover:bg-gray-50 transition-all shadow-sm">
                  <PrintIcon />
                  Cetak Biodata
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="animate-fadeIn space-y-6">
      {
    /* Header Area */
  }
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Data Siswa</h1>
          <p className="text-[14px] text-gray-500 mt-1">Manajemen data induk siswa aktif dan non-aktif.</p>
        </div>
        <button className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-[13px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
          <ExportIcon />
          <span>Export Data</span>
        </button>
      </div>

      {
    /* Filter Bar */
  }
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
    type="text"
    placeholder="Cari nama atau NISN..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-[13px] focus:outline-none transition-all w-full md:w-80"
  />
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-gray-600 focus:outline-none w-44">
              <option>Filter Kelas</option>
              <option>X IPA 1</option>
              <option>X IPS 1</option>
              <option>XI IPS 2</option>
              <option>XII IPA 3</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
        <button className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#0A1931] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] shadow-lg shadow-[#1A3D63]/20 transition-all">
          <span className="text-base leading-none font-medium">+</span>
          <span>Tambah Siswa</span>
        </button>
      </div>

      {
    /* Table Section */
  }
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">No</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">NISN</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Kelas</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Jenis Kelamin</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((s, idx) => <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[13px] text-gray-400">{idx + 1}</td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[#1F2937] tracking-tight">{s.nisn}</td>
                  <td className="px-6 py-5 text-[13px] font-medium text-[#1F2937]">{s.name}</td>
                  <td className="px-6 py-5 text-[13px] text-gray-500 font-medium">{s.class}</td>
                  <td className="px-6 py-5 text-[13px] text-gray-500">{s.gender}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${s.status === "Aktif" ? "bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]" : "bg-[#F9FAFB] text-gray-500 border-gray-200"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.status === "Aktif" ? "bg-[#16A34A]" : "bg-gray-400"}`} />
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                       <button
    onClick={() => handleEditClick(s)}
    className="p-2 text-gray-400 hover:text-[#1A3D63] hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 shadow-sm"
    aria-label="Edit"
  >
                         <EditIcon />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 shadow-sm">
                         <TrashIcon />
                       </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        
        {
    /* Pagination */
  }
        <div className="p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[13px] text-gray-500">Menampilkan {filteredStudents.length} dari {MOCK_STUDENTS.length} siswa</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-[13px] text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">Prev</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A3D63] text-white text-[13px] font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 text-[13px] font-bold transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 text-[13px] font-bold transition-colors">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 text-[13px] font-bold transition-colors">156</button>
            <button className="px-3 py-1.5 text-[13px] text-[#1A3D63] font-bold hover:bg-gray-50 rounded-lg transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>;
};
var StudentData_default = StudentData;
export {
  StudentData_default as default
};
