import { useState } from "react";
const BookIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>;
const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
const MOCK_SUBJECTS = [
  { id: 1, code: "MAT-X", name: "Matematika Wajib", group: "Wajib A", kkm: 75, hours: 4, teacher: "Eko Prasetyo, S.Pd" },
  { id: 2, code: "BIN-X", name: "Bahasa Indonesia", group: "Wajib A", kkm: 75, hours: 4, teacher: "Siti Rahayu, S.Pd" },
  { id: 3, code: "BIG-X", name: "Bahasa Inggris", group: "Wajib A", kkm: 75, hours: 3, teacher: "Dewi Anggraini, M.Pd" },
  { id: 4, code: "FIS-X", name: "Fisika", group: "Peminatan IPA", kkm: 72, hours: 3, teacher: "Agus Wibowo, S.Pd" },
  { id: 5, code: "KIM-X", name: "Kimia", group: "Peminatan IPA", kkm: 72, hours: 3, teacher: "Rini Susanti, S.Pd" },
  { id: 6, code: "BIO-X", name: "Biologi", group: "Peminatan IPA", kkm: 72, hours: 3, teacher: "Hendra Saputra, M.Pd" },
  { id: 7, code: "SEJ-X", name: "Sejarah Indonesia", group: "Wajib B", kkm: 75, hours: 2, teacher: "Fajar Nugroho, S.Pd" },
  { id: 8, code: "SOS-X", name: "Sosiologi", group: "Peminatan IPS", kkm: 72, hours: 3, teacher: "Wati Kusuma, S.Pd" },
  { id: 9, code: "EKO-X", name: "Ekonomi", group: "Peminatan IPS", kkm: 72, hours: 3, teacher: "Budi Santoso, S.Pd" },
  { id: 10, code: "GEO-X", name: "Geografi", group: "Peminatan IPS", kkm: 72, hours: 3, teacher: "Candra Wahyu, S.Pd" }
];
const Subjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return <div className="animate-fadeIn space-y-6 pb-10">
      {
    /* ── Page Header ── */
  }
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#4A7FA7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-900/10">
            <BookIcon />
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#4A7FA7] mb-0.5">Dashboard / <span className="text-gray-400">Mata Pelajaran</span></div>
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Mata Pelajaran</h1>
            <p className="text-[14px] text-gray-500">Kelola daftar mata pelajaran dan pengampunya</p>
          </div>
        </div>
        <button className="bg-[#1A3D63] hover:bg-[#0A1931] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] shadow-lg transition-all flex items-center gap-2">
          <span className="text-base leading-none font-medium">+</span>
          Tambah Mapel
        </button>
      </div>

      {
    /* ── Top Summary Cards ── */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm">
           <div className="text-[12px] font-medium text-white/70 mb-1">Total Mapel</div>
           <div className="text-[28px] font-bold text-white">30</div>
        </div>
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm">
           <div className="text-[12px] font-medium text-white/70 mb-1">Kelompok Wajib</div>
           <div className="text-[28px] font-bold text-white">12</div>
        </div>
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm">
           <div className="text-[12px] font-medium text-white/70 mb-1">Peminatan IPA</div>
           <div className="text-[28px] font-bold text-white">9</div>
        </div>
        <div className="bg-[#4A7FA7] p-6 rounded-2xl shadow-sm">
           <div className="text-[12px] font-medium text-white/70 mb-1">Peminatan IPS</div>
           <div className="text-[28px] font-bold text-white">9</div>
        </div>
      </div>

      {
    /* Filter Bar */
  }
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
    type="text"
    placeholder="Cari nama atau kode mapel..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-[13px] focus:outline-none transition-all w-full md:w-96"
  />
        </div>
        <div className="relative">
          <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-gray-600 focus:outline-none w-44">
            <option>Semua Mapel</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {
    /* Table Section */
  }
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kode</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Mata Pelajaran</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Kelompok</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">KKM</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Jam/Minggu</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Guru Pengampu</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SUBJECTS.map((s) => <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[13px] text-gray-400 tracking-tight">{s.code}</td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[#1F2937]">{s.name}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.group.includes("Wajib") ? "bg-[#1A3D63] text-white" : "bg-[#B3CFE5] text-[#1A3D63]"}`}>
                      {s.group}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[13px] text-gray-600 font-medium text-center">{s.kkm}</td>
                  <td className="px-6 py-5 text-[13px] text-gray-500 text-center">{s.hours} JP</td>
                  <td className="px-6 py-5 text-[13px] text-gray-600 font-medium">{s.teacher}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                       <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><EditIcon /></button>
                       <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
var Subjects_default = Subjects;
export {
  Subjects_default as default
};
