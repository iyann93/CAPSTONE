const GraduationCapIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /><path d="M12 22v-3" />
  </svg>;
const PrintIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" />
  </svg>;
const EyeIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>;
const DownloadIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>;
const FileTextIcon = () => <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-200 mb-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
  </svg>;
const ERapor = () => {
  const students = [
    { id: 1, name: "Ahmad Rizky", nis: "2025001", score: 80.5, grade: "B", status: "Draft" },
    { id: 2, name: "Bella Anggraini", nis: "2025002", score: 90.4, grade: "A", status: "Final" },
    { id: 3, name: "Cahyo Nugroho", nis: "2025003", score: 74.8, grade: "C", status: "Draft" },
    { id: 4, name: "Dinda Permata", nis: "2025004", score: 84.8, grade: "B", status: "Final" },
    { id: 5, name: "Eko Saputra", nis: "2025005", score: 68.4, grade: "C", status: "Draft" }
  ];
  return <div className="animate-fadeIn space-y-6 pb-10">
      {
    /* Header Area */
  }
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#4A7FA7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-900/10">
            <GraduationCapIcon />
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#4A7FA7] mb-0.5">Dashboard / <span className="text-gray-400">Generate Rapor</span></div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Generate E-Rapor</h1>
            <p className="text-[14px] text-gray-500">Buat dan cetak rapor digital siswa</p>
          </div>
        </div>
        <button className="bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg transition-all flex items-center">
          <PrintIcon />
          Cetak Semua PDF
        </button>
      </div>

      {
    /* Selectors Bar */
  }
      <div className="bg-[#F3F4F6] p-4 rounded-xl flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-3">
          <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Kelas</label>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-100 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-[#1F2937] font-semibold focus:outline-none w-44 shadow-sm">
              <option>X IPA 1</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-gray-400"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Semester</label>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-100 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-[#1F2937] font-semibold focus:outline-none w-56 shadow-sm">
              <option>Genap 2024/2025</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-gray-400"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Student List */
  }
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-[#F9FAFB]/50">
             <h3 className="text-[15px] font-bold text-[#1F2937]">X IPA 1 — Ganjil 2025/2026</h3>
             <span className="text-[12px] text-gray-400 font-medium">5 siswa</span>
          </div>
          <div className="divide-y divide-gray-50">
            {students.map((s) => <div key={s.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#4A7FA7] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1F2937]">{s.name}</h4>
                    <p className="text-[12px] text-[#94A3B8] font-medium">{s.nis}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-[#1F2937]">{s.score}</span>
                    <span className={`text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm transition-colors ${s.status === "Final" ? "bg-[#5EE9B5]" : "bg-[#4A7FA7]"}`}>
                      {s.grade}
                    </span>
                  </div>
                  
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${s.status === "Final" ? "bg-[#5EE9B5] text-white shadow-sm" : "bg-[#F3F4F6] text-[#94A3B8]"}`}>
                    {s.status === "Final" ? "Final" : "Draft"}
                  </span>
                  
                  <div className="flex items-center gap-4">
                    <button className="p-1 text-[#D1D5DB] hover:text-[#4A7FA7] transition-colors">
                      <EyeIcon />
                    </button>
                    <button className="p-1 text-[#D1D5DB] hover:text-[#4A7FA7] transition-colors">
                      <DownloadIcon />
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* Preview Area */
  }
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
           <FileTextIcon />
           <div className="text-[13px] text-[#94A3B8] font-medium leading-relaxed max-w-[200px]">
             Klik tombol <span className="inline-flex items-center align-middle mx-0.5"><EyeIcon /></span> pada siswa <br /> untuk preview rapor
           </div>
        </div>
      </div>
    </div>;
};
var ERapor_default = ERapor;
export {
  ERapor_default as default
};
