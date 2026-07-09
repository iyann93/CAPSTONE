import { useState } from "react";
const CalendarIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>;
const CalendarIconSmall = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>;
const SolidCalendarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
  </svg>;
const ChevronDownIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-gray-400">
    <path d="m6 9 6 6 6-6" />
  </svg>;
const LayersIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>;
const ToggleIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7" /><circle cx="16" cy="12" r="3" />
  </svg>;
const SettingsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>;
const CopyIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>;
const InfoIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 mt-0.5 shrink-0">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>;
const WarningIcon = () => <svg width="16" height="16" fill="none" stroke="#EAB308" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 shrink-0">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>;
const SaveIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>;
const AcademicYear = () => {
  const [expandedYear, setExpandedYear] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const years_data = [
    { id: 1, year: "2025/2026", range: "2025-07-14 s/d 2026-06-27", status: "Aktif" },
    { id: 2, year: "2024/2025", range: "2024-07-15 s/d 2025-06-28", status: "Selesai" },
    { id: 3, year: "2023/2024", range: "2023-07-17 s/d 2024-06-29", status: "Selesai" }
  ];
  const agenda_items = [
    { id: 1, date: "2025-07-14", title: "Hari Pertama Masuk Sekolah TA 2025/2026", color: "bg-[#6BA1CC] text-white" },
    { id: 2, date: "2025-08-17", title: "Upacara HUT RI ke-80", color: "bg-[#E1EFF9] text-[#0A1931]" },
    { id: 3, date: "2025-09-15", title: "Penilaian Tengah Semester (PTS) Ganjil", color: "bg-[#6BA1CC] text-white" },
    { id: 4, date: "2025-11-24", title: "Penilaian Akhir Semester (PAS) Ganjil", color: "bg-[#E1EFF9] text-[#0A1931]" },
    { id: 5, date: "2025-12-20", title: "Pembagian Rapor Semester Ganjil", color: "bg-[#6BA1CC] text-white" },
    { id: 6, date: "2025-12-22", title: "Libur Semester Ganjil", color: "bg-[#E1EFF9] text-[#0A1931]" },
    { id: 7, date: "2026-01-05", title: "Awal Semester Genap 2025/2026", color: "bg-[#6BA1CC] text-white" },
    { id: 8, date: "2026-04-20", title: "Ujian Sekolah Kelas IX", color: "bg-[#E1EFF9] text-[#0A1931]" }
  ];
  if (isAdding) {
    return <div className="animate-fadeIn space-y-6 pb-20">
        {
      /* Breadcrumb & Header */
    }
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
              <span>Dashboard</span>
              <span>&rsaquo;</span>
              <span className="cursor-pointer hover:text-[#1A3D63]" onClick={() => setIsAdding(false)}>Tahun Ajaran</span>
              <span>&rsaquo;</span>
              <span className="text-[#1A3D63]">Tambah Baru</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Tambah Tahun Ajaran</h1>
            <p className="text-[14px] text-gray-500">Buat periode tahun ajaran baru beserta detail semesternya.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
      onClick={() => setIsAdding(false)}
      className="px-6 py-2.5 rounded-full border border-gray-200 text-[13px] font-bold text-[#1F2937] bg-white hover:bg-gray-50 shadow-sm transition-all"
    >
              × Batal
            </button>
            <button className="flex items-center bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-full font-bold text-[13px] shadow-lg shadow-[#1A3D63]/20 transition-all">
              <SaveIcon />
              Simpan Tahun Ajaran
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {
      /* Left Column */
    }
          <div className="lg:col-span-8 space-y-6">
            {
      /* Informasi Tahun Ajaran */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <CalendarIconSmall />
                  Informasi Tahun Ajaran
                </h3>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Label Tahun Ajaran</label>
                    <input
      type="text"
      defaultValue="TA 2026/2027"
      className="w-full px-5 py-3 bg-[#F9FAFB] border border-gray-200 rounded-full text-[14px] font-bold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                    <p className="text-[10px] text-gray-400 mt-1 ml-3">Format penamaan otomatis: YYYY/YYYY (contoh: 2026/2027)</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Tanggal Mulai</label>
                    <div className="relative">
                      <input
      type="text"
      placeholder="Pilih tanggal mulai"
      className="w-full pl-5 pr-12 py-3 bg-[#F9FAFB] border border-gray-200 rounded-full text-[14px] font-semibold text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                         <SolidCalendarIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Tanggal Selesai</label>
                    <div className="relative">
                      <input
      type="text"
      placeholder="Pilih tanggal selesai"
      className="w-full pl-5 pr-12 py-3 bg-[#F9FAFB] border border-gray-200 rounded-full text-[14px] font-semibold text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 focus:bg-white transition-all"
    />
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                         <SolidCalendarIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {
      /* Pengaturan Semester */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <LayersIcon />
                  Pengaturan Semester
                </h3>
              </div>

              <div className="p-8 space-y-6">
                {
      /* Semester Ganjil */
    }
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[24px] p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    <h4 className="text-[14px] font-bold text-[#16A34A]">Semester Ganjil</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 ml-1">Tanggal Mulai Semester</label>
                      <div className="relative">
                        <input
      type="text"
      placeholder="Pilih tanggal"
      className="w-full pl-5 pr-12 py-3 bg-white border border-white rounded-full text-[14px] font-semibold text-gray-400 focus:outline-none"
    />
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                          <SolidCalendarIcon />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 ml-1">Tanggal Selesai Semester</label>
                      <div className="relative">
                        <input
      type="text"
      placeholder="Pilih tanggal"
      className="w-full pl-5 pr-12 py-3 bg-white border border-white rounded-full text-[14px] font-semibold text-gray-400 focus:outline-none"
    />
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                          <SolidCalendarIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {
      /* Semester Genap */
    }
                <div className="bg-[#F4F7FB] border border-[#E5EBF2] rounded-[24px] p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <h4 className="text-[14px] font-bold text-[#1A3D63]">Semester Genap</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 ml-1">Tanggal Mulai Semester</label>
                      <div className="relative">
                        <input
      type="text"
      placeholder="Pilih tanggal"
      className="w-full pl-5 pr-12 py-3 bg-white border border-white rounded-full text-[14px] font-semibold text-gray-400 focus:outline-none"
    />
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                          <SolidCalendarIcon />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 ml-1">Tanggal Selesai Semester</label>
                      <div className="relative">
                        <input
      type="text"
      placeholder="Pilih tanggal"
      className="w-full pl-5 pr-12 py-3 bg-white border border-white rounded-full text-[14px] font-semibold text-gray-400 focus:outline-none"
    />
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                          <SolidCalendarIcon />
                        </div>
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
      /* Status Tahun Ajaran */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <ToggleIcon />
                  Status Tahun Ajaran
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="py-4 px-6 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#16A34A]">Jadikan Aktif Saat Ini</h4>
                    <p className="text-[10px] text-[#2B8B67] mt-0.5 leading-relaxed">Otomatis menonaktifkan tahun ajaran sebelumnya.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-VII-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D9488]" />
                  </label>
                </div>

                <div className="py-4 px-5 bg-gray-50 border border-gray-100 rounded-[20px] flex gap-3">
                  <InfoIcon />
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Disarankan tidak mengaktifkan tahun ajaran baru jika tahun ajaran saat ini masih berjalan untuk menghindari kesalahan input nilai.
                  </p>
                </div>
              </div>
            </div>

            {
      /* Salin Data Akademik */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <CopyIcon />
                  Salin Data Akademik
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                  Salin referensi data dari tahun ajaran sebelumnya untuk mempercepat pengaturan.
                </p>

                <label className="flex items-center gap-4 py-3.5 px-5 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="relative flex items-center shrink-0">
                    <input type="checkbox" className="peer w-5 h-5 appearance-none border border-gray-300 rounded focus:outline-none checked:bg-[#1A3D63] checked:border-[#1A3D63] transition-colors" defaultChecked />
                    <svg className="absolute w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1F2937]">Salin Daftar Mata Pelajaran</h4>
                  </div>
                </label>

                <label className="flex items-center gap-4 py-3.5 px-5 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="relative flex items-center shrink-0">
                    <input type="checkbox" className="peer w-5 h-5 appearance-none border border-gray-300 rounded focus:outline-none checked:bg-[#1A3D63] checked:border-[#1A3D63] transition-colors" defaultChecked />
                    <svg className="absolute w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1F2937] leading-tight">Salin Struktur Kelas</h4>
                    <p className="text-[10px] text-gray-400">Tanpa menyalin siswanya</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 py-3.5 px-5 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="relative flex items-center shrink-0">
                    <input type="checkbox" className="peer w-5 h-5 appearance-none border border-gray-300 rounded focus:outline-none checked:bg-[#1A3D63] checked:border-[#1A3D63] transition-colors" />
                    <svg className="absolute w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1F2937] leading-tight">Salin Komponen SPP</h4>
                    <p className="text-[10px] text-gray-400">Komponen tagihan keuangan siswa</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  if (isEditingSemester) {
    return <div className="animate-fadeIn space-y-6 pb-20">
        {
      /* Breadcrumb & Header */
    }
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
              <span>Dashboard</span>
              <span>&rsaquo;</span>
              <span className="cursor-pointer hover:text-[#1A3D63]" onClick={() => setIsEditingSemester(false)}>Tahun Ajaran</span>
              <span>&rsaquo;</span>
              <span className="text-[#1A3D63]">Edit Semester</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Edit Semester Ganjil</h1>
            <p className="text-[14px] text-gray-500">Tahun Ajaran 2025/2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button
      onClick={() => setIsEditingSemester(false)}
      className="px-6 py-2.5 rounded-full border border-gray-200 text-[13px] font-bold text-[#1F2937] bg-white hover:bg-gray-50 shadow-sm transition-all"
    >
              × Batal
            </button>
            <button className="flex items-center bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-full font-bold text-[13px] shadow-lg shadow-[#1A3D63]/20 transition-all">
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
      /* Detail Waktu Pelaksanaan */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <CalendarIconSmall />
                  Detail Waktu Pelaksanaan
                </h3>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Nama Semester</label>
                    <input
      type="text"
      value="Semester Ganjil"
      readOnly
      className="w-full px-5 py-3 bg-[#F9FAFB] border border-gray-200 rounded-full text-[14px] font-semibold text-gray-500 cursor-not-allowed focus:outline-none"
    />
                    <p className="text-[10px] text-gray-400 mt-1 ml-3">Nama semester tidak dapat diubah, karena terikat dengan sistem.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Tanggal Mulai</label>
                    <div className="relative">
                      <input
      type="text"
      defaultValue="14 Juli 2025"
      className="w-full pl-5 pr-12 py-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full text-[14px] font-bold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
    />
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                         <SolidCalendarIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Tanggal Selesai</label>
                    <div className="relative">
                      <input
      type="text"
      defaultValue="20 Desember 2025"
      className="w-full pl-5 pr-12 py-3 bg-[#F9FAFB] border border-gray-200 rounded-full text-[14px] font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all"
    />
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                         <SolidCalendarIcon />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                    <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Total Hari Efektif (Estimasi)</label>
                    <input
      type="text"
      defaultValue="112 Hari"
      className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full text-[14px] font-bold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/5 transition-all"
    />
                    <p className="text-[10px] text-gray-400 mt-1 ml-3">Dihitung otomatis berdasarkan rentang tanggal, dikurangi hari libur yang ada di kalender akademik.</p>
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
      /* Status Semester */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <ToggleIcon />
                  Status Semester
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="py-4 px-6 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#16A34A]">Jadikan Aktif Saat Ini</h4>
                    <p className="text-[10px] text-[#2B8B67] mt-0.5 leading-relaxed">Mengaktifkan semester ini untuk input nilai dan absensi.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-VII-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D9488]" />
                  </label>
                </div>

                <div className="py-4 px-5 bg-white border border-gray-200 rounded-[20px] flex gap-3 shadow-sm">
                  <WarningIcon />
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Perhatian: Mengubah status menjadi aktif akan memengaruhi perhitungan e-Rapor dan sistem presensi pada semua kelas.
                  </p>
                </div>
              </div>
            </div>

            {
      /* Konfigurasi Lanjutan */
    }
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-[#1F2937] flex items-center">
                  <SettingsIcon />
                  Konfigurasi Lanjutan
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="py-4 px-6 bg-white border border-gray-200 rounded-full flex items-center justify-between gap-4 shadow-sm hover:border-gray-300 transition-colors">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1F2937]">Kunci Input Nilai</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Guru tidak bisa lagi mengubah nilai rapor</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-VII-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D9488]" />
                  </label>
                </div>

                <div className="py-4 px-6 bg-white border border-gray-200 rounded-full flex items-center justify-between gap-4 shadow-sm hover:border-gray-300 transition-colors">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1F2937]">Buka Publikasi Rapor</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Siswa dapat melihat rapor di portal</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-VII-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D9488]" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="animate-fadeIn space-y-6 pb-10">
      {
    /* ── Page Header ── */
  }
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#4A7FA7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-900/10">
             <CalendarIcon />
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#4A7FA7] mb-0.5">Dashboard / <span className="text-gray-400">Tahun Ajaran</span></div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Tahun Ajaran</h1>
            <p className="text-[14px] text-gray-500">Kelola tahun ajaran, semester, dan agenda akademik</p>
          </div>
        </div>
        <button
    onClick={() => setIsAdding(true)}
    className="bg-[#0A1931] hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg transition-all flex items-center gap-2"
  >
          <span className="text-base leading-none font-medium">+</span>
          Tambah Tahun Ajaran
        </button>
      </div>

      {
    /* ── Top Summary Cards ── */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm relative">
           <div className="text-[12px] font-medium text-white/70 mb-1">Tahun Ajaran Aktif</div>
           <div className="text-[28px] font-bold text-white mb-1">2025/2026</div>
           <div className="text-[12px] text-white/70">Semester Ganjil sedang berjalan</div>
        </div>
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm relative">
           <div className="text-[12px] font-medium text-white/70 mb-1">Semester Aktif</div>
           <div className="text-[28px] font-bold text-white mb-1">Ganjil</div>
           <div className="text-[12px] text-white/70">14 Jul — 20 Des 2025</div>
        </div>
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm relative">
           <div className="text-[12px] font-medium text-white/70 mb-1">Total Hari Efektif</div>
           <div className="text-[28px] font-bold text-white mb-1">112</div>
           <div className="text-[12px] text-white/70">dari 182 hari semester</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Year List */
  }
        <div className="lg:col-span-8 space-y-6">
          {years_data.map((year) => <div key={year.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
    className="p-6 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors"
    onClick={() => setExpandedYear(expandedYear === year.id ? null : year.id)}
  >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${year.status === "Aktif" ? "bg-[#5EE9B5]/10 text-[#5EE9B5]" : "bg-gray-100 text-gray-400"}`}>
                    {year.status === "Aktif" ? <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 11V7a4 4 0 1 1 8 0m-4 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /><rect x="5" y="11" width="14" height="10" rx="2" /></svg> : <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><circle cx="12" cy="16" r="1" /><path d="M8 11V7a4 4 0 1 1 8 0" /></svg>}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#1F2937]">Tahun Ajaran {year.year}</h3>
                    <p className="text-[13px] text-gray-400 mt-0.5">{year.range}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${year.status === "Aktif" ? "bg-[#5EE9B5]/20 text-[#2B8B67]" : "bg-gray-100 text-gray-400"}`}>
                    {year.status}
                  </span>
                  <div className={`transition-transform duration-300 ${expandedYear === year.id ? "rotate-180" : ""}`}>
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {expandedYear === year.id && <div className="p-8 pt-2 border-t border-gray-50 animate-fadeIn">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Semester</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {
    /* Ganjil */
  }
                    <div className="border-2 border-[#5EE9B5] bg-[#5EE9B5]/5 rounded-2xl p-6 relative">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-[16px] font-bold text-[#1F2937]">Semester Ganjil</h4>
                        <span className="bg-[#5EE9B5] text-[#0A1931] text-[10px] font-bold px-2.5 py-0.5 rounded-full">Aktif</span>
                      </div>
                      <div className="text-[13px] text-gray-500 mb-6">
                        2025-07-14<br />s/d 2025-12-20
                      </div>
                      <button
    onClick={() => setIsEditingSemester(true)}
    className="w-full py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
  >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        Edit Semester
                      </button>
                    </div>

                    {
    /* Genap */
  }
                    <div className="border-2 border-gray-200 bg-white rounded-2xl p-6 relative">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-[16px] font-bold text-[#1F2937]">Semester Genap</h4>
                        <span className="bg-[#E5E7EB] text-gray-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Belum Mulai</span>
                      </div>
                      <div className="text-[13px] text-gray-500 mb-6">
                        2026-01-05<br />s/d 2026-06-27
                      </div>
                      <button
    onClick={() => setIsEditingSemester(true)}
    className="w-full py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
  >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        Edit Semester
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                     <button className="bg-[#0A1931] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-black transition-colors">
                        Edit Tahun Ajaran
                     </button>
                  </div>
                </div>}
            </div>)}
        </div>

        {
    /* Calendar Sidebar */
  }
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="text-[18px] font-bold text-[#1F2937] mb-6">Agenda Kalender Akademik</h3>
             <div className="space-y-3">
               {agenda_items.map((item) => <div key={item.id} className={`${item.color} rounded-xl p-4 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer`}>
                    <div className="text-[11px] font-bold opacity-70 mb-1">{item.date}</div>
                    <div className="text-[13px] font-bold leading-tight">{item.title}</div>
                 </div>)}
             </div>
             <button className="w-full mt-4 py-3 bg-[#F9FAFB] border border-gray-100 rounded-xl text-[13px] font-bold text-[#1A3D63] hover:bg-gray-50 transition-colors">
               + Tambah Agenda
             </button>
          </div>
        </div>
      </div>
    </div>;
};
var AcademicYear_default = AcademicYear;
export {
  AcademicYear_default as default
};



