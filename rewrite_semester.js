import fs from 'fs';
const file = 'src/pages/dashboards/Semester.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('const [isAdding, setIsAdding] = useState(false);', 'const [view, setView] = useState("list");');
content = content.replace('if (isAdding) {', 'if (view === "add") {');
content = content.split('setIsAdding(false)').join('setView("list")');
content = content.split('setIsAdding(true)').join('setView("add")');

// Replace The List View
content = content.replace(/\/\/ The List View\r?\n\s*return \(/, 'if (view === "list") {\n  return (');

// Wire the Detail icon (using .replace with simple string match since it's exactly formatted)
const detailOld = '<button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">\\n                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12';
const detailNew = '<button onClick={() => setView(\'detail\')} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">\\n                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12';
content = content.replace(detailOld, detailNew).replace(detailOld, detailNew); // Replace twice for the 2 rows

// Wire the Edit icon
const editOld = '<button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">\\n                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4';
const editNew = '<button onClick={() => setView(\'edit\')} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">\\n                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4';
content = content.replace(editOld, editNew).replace(editOld, editNew); // Replace twice for the 2 rows

// Now append the Edit and Detail Views at the bottom.
const appendContent = `  );
}

if (view === "edit") {
  return <SemesterEdit setView={setView} />;
}

if (view === "detail") {
  return <SemesterDetail setView={setView} />;
}

return null;
};

// --- EDIT VIEW COMPONENT ---
const SemesterEdit = ({ setView }) => {
  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <div className="text-[13px] text-gray-500 font-medium mb-2">
            Dashboard <span className="mx-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº</span> Kelola Akademik <span className="mx-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº</span> <span className="cursor-pointer hover:text-[#1A3D63] hover:underline" onClick={() => setView("list")}>Semester</span> <span className="mx-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº</span> <span className="text-[#1A3D63] font-semibold">Edit</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-[26px] font-bold text-[#1e293b]">Edit Semester</h1>
            <span className="text-[14px] font-bold text-gray-500 mt-1">SMT-2023-1</span>
            <span className="bg-[#ECFDF5] text-[#059669] text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Aktif
            </span>
          </div>
          <p className="text-gray-500 text-[14px] mt-1">
            Perbarui informasi dan pengaturan Semester Ganjil 2023/2024.
          </p>
        </div>
        <button 
          onClick={() => setView("list")}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Daftar
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-[#FFF8EB] border border-[#FDE68A] rounded-xl p-4 flex gap-3 items-start">
        <div className="text-[#D97706] mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <p className="text-[13px] text-[#92400E] leading-relaxed">
          Semester ini sedang <span className="font-bold">aktif berjalan</span>. Perubahan tanggal atau periode akan langsung memengaruhi jadwal, absensi, dan penilaian yang sedang berlangsung.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identitas Semester */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Identitas Semester</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-gray-500 mb-2">ID Semester</label>
                <div className="relative">
                  <input type="text" readOnly value="SMT-2023-1" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-28 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-gray-400 text-[10px] font-semibold">Tidak dapat diubah</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Tahun Ajaran</label>
                <div className="relative">
                  <input type="text" readOnly value="2023/2024" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-gray-400 text-[10px] font-semibold">Terkunci</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Nama Semester <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Ganjil 2023/2024" className="w-full bg-white border border-[#1A3D63] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Tipe Semester</label>
                <div className="relative">
                  <input type="text" readOnly value="Ganjil" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-gray-400 text-[10px] font-semibold">Terkunci</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Periode Semester */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Periode Semester</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" value="17 Jul 2023" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-20 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" readOnly />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="text-gray-400 text-[10px] font-semibold">Terkunci</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Tanggal mulai tidak dapat diubah setelah semester aktif.</p>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="22 Des 2023" className="w-full bg-white border border-[#1A3D63] rounded-xl pl-4 pr-10 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar inside Edit */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Progress semester: <span className="font-bold text-[#1e293b]">100 / 159 hari</span>
                  </div>
                  <div className="text-[12px] font-bold text-[#1e293b]">63% Selesai</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 relative overflow-hidden">
                  <div className="bg-[#1A3D63] h-2 rounded-full" style={{ width: '63%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[11px] font-medium text-gray-400">
                  <div>17 Jul 2023</div>
                  <div className="text-green-600 font-bold">Hari ini: 25 Okt 2023</div>
                  <div>22 Des 2023</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Hari Efektif Belajar</label>
                  <div className="relative">
                    <input type="text" defaultValue="140" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    <div className="absolute inset-y-0 right-0 flex">
                      <div className="flex items-center px-4 text-[13px] font-medium text-gray-500 border-l border-gray-200">hari</div>
                      <div className="flex flex-col border-l border-gray-200 w-8">
                        <button className="flex-1 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 rounded-tr-xl"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                        <button className="flex-1 flex items-center justify-center hover:bg-gray-50 rounded-br-xl"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Minggu Efektif</label>
                  <div className="relative">
                    <input type="text" readOnly value="20" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-32 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    <div className="absolute inset-y-0 right-24 flex items-center pointer-events-none">
                      <span className="text-[13px] font-medium text-gray-500">minggu</span>
                    </div>
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-1 rounded shadow-sm border border-gray-200">Kalkulasi otomatis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jadwal Penilaian & Ujian */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Jadwal Penilaian & Ujian</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Ujian Tengah Semester (UTS)</label>
                  <div className="relative">
                    <input type="text" readOnly value="16 Okt 2023" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-gray-600 focus:outline-none" />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="bg-[#ECFDF5] text-[#059669] text-[10px] font-bold px-2 py-1 rounded">Selesai</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Ujian Akhir Semester (UAS)</label>
                  <div className="relative">
                    <input type="text" defaultValue="11 Des 2023" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Pembagian Rapor</label>
                  <div className="relative">
                    <input type="text" defaultValue="23 Des 2023" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Deadline Input Nilai Guru</label>
                  <div className="relative">
                    <input type="text" defaultValue="18 Des 2023" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Riwayat Perubahan */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Riwayat Perubahan</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                  <div className="text-[13px] text-[#1e293b]"><span className="font-bold">Siti Rahayu</span> ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Mengubah tanggal selesai dari 20 Des menjadi 22 Des 2023</div>
                  <div className="text-[11px] text-gray-400 mt-1">14 Okt 2023, 09:15</div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                  <div className="text-[13px] text-[#1e293b]"><span className="font-bold">Siti Rahayu</span> ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Memperbarui jadwal UAS menjadi 11 Des 2023</div>
                  <div className="text-[11px] text-gray-400 mt-1">3 Sep 2023, 11:40</div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                  <div className="text-[13px] text-[#1e293b]"><span className="font-bold">Admin Sistem</span> ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Semester dibuat dan diaktifkan pertama kali</div>
                  <div className="text-[11px] text-gray-400 mt-1">17 Jul 2023, 07:30</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Semester */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Status Semester</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 flex items-start gap-3">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#059669] shrink-0"></div>
                <div>
                  <div className="text-[14px] font-bold text-[#065F46]">Sedang Aktif</div>
                  <div className="text-[12px] text-[#065F46]/80 mt-0.5">Semester ini sedang berjalan.</div>
                </div>
              </div>
              <div className="border border-orange-200 bg-[#FFF8EB] rounded-xl p-4 flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <div className="text-[11px] text-[#D97706] leading-relaxed">
                  Untuk menutup semester ini, gunakan tombol "Tutup Semester" di halaman daftar semester.
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Semester Ini */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Statistik Semester Ini</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
                  Total Siswa Terdaftar
                </div>
                <div className="font-bold text-[#1e293b] text-[14px]">1,248</div>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <div className="w-6 h-6 rounded bg-purple-50 text-purple-500 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></div>
                  Kelas Aktif
                </div>
                <div className="font-bold text-[#1e293b] text-[14px]">32</div>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <div className="w-6 h-6 rounded bg-green-50 text-green-500 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>
                  Guru Mengajar
                </div>
                <div className="font-bold text-[#1e293b] text-[14px]">86</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <div className="w-6 h-6 rounded bg-orange-50 text-orange-500 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                  Rata-rata Absensi
                </div>
                <div className="font-bold text-[#1e293b] text-[14px]">94.2%</div>
              </div>
            </div>
          </div>

          {/* Informasi Data */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Informasi Data</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-gray-500">Dibuat</span>
                <span className="font-bold text-[#1e293b]">17 Jul 2023</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-gray-500">Terakhir diperbarui</span>
                <span className="font-bold text-[#1e293b]">14 Okt 2023</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-gray-500">Diperbarui oleh</span>
                <span className="font-bold text-[#1e293b]">Siti Rahayu</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Simpan Perubahan
            </button>
            <button 
              onClick={() => setView("list")}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DETAIL VIEW COMPONENT ---
const SemesterDetail = ({ setView }) => {
  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <div className="text-[13px] text-gray-500 font-medium mb-2">
            Dashboard <span className="mx-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº</span> Kelola Akademik <span className="mx-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº</span> <span className="cursor-pointer hover:text-[#1A3D63] hover:underline" onClick={() => setView("list")}>Semester</span> <span className="mx-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº</span> <span className="text-[#1A3D63] font-semibold">Detail</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-[26px] font-bold text-[#1e293b]">Ganjil 2023/2024</h1>
            <span className="text-[14px] font-bold text-gray-500 mt-1">SMT-2023-1</span>
            <span className="bg-[#ECFDF5] text-[#059669] text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Sedang Berjalan
            </span>
          </div>
          <p className="text-gray-500 text-[14px] mt-1">
            Ringkasan lengkap data dan aktivitas Semester Ganjil Tahun Ajaran 2023/2024.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Ekspor Laporan
          </button>
          <button 
            onClick={() => setView("edit")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-xl text-[13px] font-bold transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Semester
          </button>
        </div>
      </div>

      {/* Top Full Width Progress */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-bold text-[#1e293b] text-[15px]">Progress Semester</span>
          </div>
          <div className="text-[13px] font-medium text-gray-500">
            17 Jul 2023 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â 22 Des 2023
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3.5 mb-3 relative overflow-hidden">
          <div className="bg-[#1A3D63] h-3.5 rounded-full" style={{ width: '63%' }}></div>
        </div>
        <div className="flex justify-between items-center text-[12px] font-medium text-gray-500">
          <div>Mulai: 17 Jul 2023</div>
          <div className="font-bold text-[#1e293b]">63% Selesai ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â 100 / 159 Hari</div>
          <div>Selesai: 22 Des 2023</div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-0.5">Siswa Terdaftar</div>
            <div className="text-[20px] font-bold text-[#1e293b]">1,248</div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-0.5">Kelas Aktif</div>
            <div className="text-[20px] font-bold text-[#1e293b]">32</div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-0.5">Guru Mengajar</div>
            <div className="text-[20px] font-bold text-[#1e293b]">86</div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-0.5">Rata-rata Absensi</div>
            <div className="text-[20px] font-bold text-[#1e293b]">94.2%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Jadwal Penilaian & Ujian */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Jadwal Penilaian & Ujian</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1e293b]">Ujian Tengah Semester (UTS)</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">16 Okt 2023</div>
                  </div>
                </div>
                <div className="bg-[#ECFDF5] text-[#059669] text-[11px] font-bold px-3 py-1.5 rounded-full">Selesai</div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8EB] text-[#D97706] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1e293b]">Deadline Input Nilai Guru</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">18 Des 2023</div>
                  </div>
                </div>
                <div className="bg-[#FFF8EB] text-[#D97706] text-[11px] font-bold px-3 py-1.5 rounded-full">Mendatang</div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8EB] text-[#D97706] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1e293b]">Ujian Akhir Semester (UAS)</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">11 Des 2023</div>
                  </div>
                </div>
                <div className="bg-[#FFF8EB] text-[#D97706] text-[11px] font-bold px-3 py-1.5 rounded-full">Mendatang</div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1e293b]">Pembagian Rapor</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">23 Des 2023</div>
                  </div>
                </div>
                <div className="bg-[#FFF8EB] text-[#D97706] text-[11px] font-bold px-3 py-1.5 rounded-full">Mendatang</div>
              </div>
            </div>
          </div>

          {/* Distribusi Siswa */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Distribusi Siswa per Tingkat</h2>
              </div>
              <div className="text-[12px] text-gray-500">Total: 1,248 siswa</div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 text-[13px] font-bold text-[#1e293b]">Kelas X</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#1A3D63]" style={{ width: '35%' }}></div>
                </div>
                <div className="w-16 text-right text-[13px] font-bold text-[#1e293b]">432 <span className="font-normal text-gray-500">siswa</span></div>
                <div className="w-16 text-right text-[12px] text-gray-500">11 kelas</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-[13px] font-bold text-[#1e293b]">Kelas XI</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#8B5CF6]" style={{ width: '33%' }}></div>
                </div>
                <div className="w-16 text-right text-[13px] font-bold text-[#1e293b]">418 <span className="font-normal text-gray-500">siswa</span></div>
                <div className="w-16 text-right text-[12px] text-gray-500">11 kelas</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-[13px] font-bold text-[#1e293b]">Kelas XII</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#10B981]" style={{ width: '32%' }}></div>
                </div>
                <div className="w-16 text-right text-[13px] font-bold text-[#1e293b]">398 <span className="font-normal text-gray-500">siswa</span></div>
                <div className="w-16 text-right text-[12px] text-gray-500">10 kelas</div>
              </div>
            </div>
          </div>

          {/* Rekapitulasi Absensi */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Rekapitulasi Absensi Bulan Oktober</h2>
              </div>
              <a href="#" className="text-[#1A3D63] text-[13px] font-bold flex items-center gap-1 hover:underline">
                Lihat Detail <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">MINGGU</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">HADIR</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">IZIN</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">SAKIT</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">ALPHA</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">% HADIR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">2 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â 6 Okt</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">1,211</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">18</td>
                    <td className="px-6 py-4 text-[13px] text-center text-orange-500 font-semibold">14</td>
                    <td className="px-6 py-4 text-[13px] text-center text-red-500 font-semibold">5</td>
                    <td className="px-6 py-4 text-[13px] text-right font-bold text-[#059669]">97.0%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">9 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â 13 Okt</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">1,197</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">22</td>
                    <td className="px-6 py-4 text-[13px] text-center text-orange-500 font-semibold">20</td>
                    <td className="px-6 py-4 text-[13px] text-center text-red-500 font-semibold">9</td>
                    <td className="px-6 py-4 text-[13px] text-right font-bold text-[#059669]">95.9%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">16 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â 20 Okt</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">1,182</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">31</td>
                    <td className="px-6 py-4 text-[13px] text-center text-orange-500 font-semibold">25</td>
                    <td className="px-6 py-4 text-[13px] text-center text-red-500 font-semibold">16</td>
                    <td className="px-6 py-4 text-[13px] text-right font-bold text-[#059669]">94.7%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">23 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â 27 Okt</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">1,175</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">28</td>
                    <td className="px-6 py-4 text-[13px] text-center text-orange-500 font-semibold">30</td>
                    <td className="px-6 py-4 text-[13px] text-center text-red-500 font-semibold">15</td>
                    <td className="px-6 py-4 text-[13px] text-right font-bold text-[#059669]">94.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Informasi Semester */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Informasi Semester</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Tahun Ajaran</span>
                <span className="font-bold text-[#1e293b]">2023/2024</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Tipe</span>
                <span className="font-bold text-[#1e293b]">Ganjil</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Tanggal Mulai</span>
                <span className="font-bold text-[#1e293b]">17 Jul 2023</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Tanggal Selesai</span>
                <span className="font-bold text-[#1e293b]">22 Des 2023</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Total Durasi</span>
                <span className="font-bold text-[#1e293b]">159 hari</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Hari Efektif</span>
                <span className="font-bold text-[#1e293b]">140 hari</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Minggu Efektif</span>
                <span className="font-bold text-[#1e293b]">20 minggu</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Kurikulum</span>
                <span className="font-bold text-[#1e293b]">Kurikulum Merdeka</span>
              </div>
            </div>
          </div>

          {/* Mata Pelajaran Aktif */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Mata Pelajaran Aktif</h2>
              </div>
              <span className="bg-gray-100 text-[#1e293b] text-[12px] font-bold px-2.5 py-1 rounded-lg">48</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 text-[#1e293b] font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#1A3D63]"></div>
                  Wajib
                </div>
                <div className="font-bold text-[#059669]">8 mapel</div>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 text-[#1e293b] font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  IPA
                </div>
                <div className="font-bold text-[#059669]">14 mapel</div>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 text-[#1e293b] font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                  IPS
                </div>
                <div className="font-bold text-[#D97706]">14 mapel</div>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 text-[#1e293b] font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                  Lintas Minat
                </div>
                <div className="font-bold text-[#7C3AED]">12 mapel</div>
              </div>
            </div>
          </div>

          {/* Aksi Terkait */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Aksi Terkait</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 text-[13px] font-bold text-[#1e293b]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Lihat Absensi Lengkap
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl hover:bg-[#D1FAE5] transition-colors">
                <div className="flex items-center gap-3 text-[13px] font-bold text-[#065F46]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#059669]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Generate Rapor Semester
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#059669]"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#FFF8EB] border border-[#FDE68A] rounded-xl hover:bg-[#FEF3C7] transition-colors">
                <div className="flex items-center gap-3 text-[13px] font-bold text-[#92400E]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D97706]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Tutup Semester Ini
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D97706]"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Informasi Data */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Informasi Data</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-gray-500">Dibuat</span>
                <span className="font-bold text-[#1e293b]">17 Jul 2023</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-gray-500">Terakhir diperbarui</span>
                <span className="font-bold text-[#1e293b]">14 Okt 2023</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-gray-500">Diperbarui oleh</span>
                <span className="font-bold text-[#1e293b]">Siti Rahayu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Semester;
`;

content = content.replace(/  \);\r?\n};\r?\n\r?\nexport default Semester;/g, appendContent);

fs.writeFileSync(file, content);
console.log('Successfully updated Semester.jsx with Edit and Detail views!');
