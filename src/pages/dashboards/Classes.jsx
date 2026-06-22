import React, { useState } from "react";
import ClassDetail from "./ClassDetail";
import ClassEdit from "./ClassEdit";
// Icons
const IconPrint = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.5-1.12-1.129L6.34 18m11.32 0a3 3 0 0 0 0-6M6.34 18a3 3 0 0 1 0-6m0 0a3 3 0 0 1 3-3h5.32a3 3 0 0 1 3 3m0 0v1.125m-6.32-6h6.32m-6.32 0a3 3 0 0 0-3 3v1.125m-6-2.25h16.5a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H3.75A1.5 1.5 0 0 1 2.25 15V11.25a1.5 1.5 0 0 1 1.5-1.5Z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const IconChart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const MOCK_CLASSES = [
  { id: 1, code: "X-IPA-1", name: "Kelas X IPA 1", level: "Kelas X", major: "IPA", teacher: "Ibu Sari Dewi, S.Pd", students: 32, capacity: 36, room: "Ruang 101", status: "Aktif" },
  { id: 2, code: "X-IPA-2", name: "Kelas X IPA 2", level: "Kelas X", major: "IPA", teacher: "Bpk. Ahmad Fauzi, M.Pd", students: 31, capacity: 36, room: "Ruang 102", status: "Aktif" },
  { id: 3, code: "X-IPS-1", name: "Kelas X IPS 1", level: "Kelas X", major: "IPS", teacher: "Ibu Dewi Anggraini, S.Pd", students: 30, capacity: 36, room: "Ruang 201", status: "Aktif" },
  { id: 4, code: "X-IPS-2", name: "Kelas X IPS 2", level: "Kelas X", major: "IPS", teacher: "Bpk. Budi Hartono, S.Pd", students: 29, capacity: 36, room: "Ruang 202", status: "Aktif" },
  { id: 5, code: "X-BHS-1", name: "Kelas X Bahasa 1", level: "Kelas X", major: "Bahasa", teacher: "Ibu Nurdiana, S.Pd", students: 28, capacity: 36, room: "Ruang 203", status: "Aktif" },
  { id: 6, code: "XI-IPA-1", name: "Kelas XI IPA 1", level: "Kelas XI", major: "IPA", teacher: "Ibu Rani Kusuma, S.Pd", students: 33, capacity: 36, room: "Ruang 301", status: "Aktif" },
  { id: 7, code: "XI-IPA-2", name: "Kelas XI IPA 2", level: "Kelas XI", major: "IPA", teacher: "Bpk. Hendra Wijaya, M.Pd", students: 32, capacity: 36, room: "Ruang 302", status: "Aktif" },
  { id: 8, code: "XI-IPS-1", name: "Kelas XI IPS 1", level: "Kelas XI", major: "IPS", teacher: "Ibu Maya Sari, S.Pd", students: 30, capacity: 36, room: "Ruang 303", status: "Aktif" },
  { id: 9, code: "XI-IPS-2", name: "Kelas XI IPS 2", level: "Kelas XI", major: "IPS", teacher: "Bpk. Agus Santoso, S.Pd", students: 31, capacity: 36, room: "Ruang 304", status: "Aktif" },
  { id: 10, code: "XII-IPA-1", name: "Kelas XII IPA 1", level: "Kelas XII", major: "IPA", teacher: "Ibu Siti Aminah, M.Pd", students: 28, capacity: 36, room: "Ruang 401", status: "Aktif" }
];

const Classes = () => {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classes_data");
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return MOCK_CLASSES;
  });

  React.useEffect(() => {
    localStorage.setItem("classes_data", JSON.stringify(classes));
  }, [classes]);

  const [view, setView] = useState("list"); // list, add, detail, edit
  const [activeTab, setActiveTab] = useState("Semua Tingkat");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  
  // Add form state
  const [addForm, setAddForm] = useState({
    code: "", name: "", desc: "", major: "IPA", room: "", capacity: 36, year: "2023/2024", semester: "Ganjil", teacher: ""
  });
  const [level, setLevel] = useState("Kelas X");
  const [isActive, setIsActive] = useState(true);

  const handleExport = () => {
    const headers = ["ID", "KODE", "NAMA KELAS", "TINGKAT", "JURUSAN", "WALI KELAS", "SISWA", "KAPASITAS", "RUANGAN", "STATUS"];
    const rows = classes.map(c => [c.id, c.code, c.name, c.level, c.major, c.teacher, c.students, c.capacity, c.room, c.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daftar_kelas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAdd = () => {
    if (!addForm.code || !addForm.name) {
      alert("Kode dan Nama Kelas wajib diisi!");
      return;
    }
    const newClass = {
      id: Date.now(),
      code: addForm.code,
      name: addForm.name,
      level: level,
      major: addForm.major || "Umum",
      teacher: addForm.teacher || "Belum Ditentukan",
      students: 0,
      capacity: parseInt(addForm.capacity) || 36,
      room: addForm.room || "TBA",
      status: isActive ? "Aktif" : "Nonaktif"
    };
    setClasses([newClass, ...classes]);
    setView("list");
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      setClasses(prev => prev.filter(c => c.id !== id));
    }
  };

  if (view === "detail") {
    return <ClassDetail setView={setView} />;
  }

  if (view === "edit") {
    return <ClassEdit setView={setView} initialData={selectedClass} onSave={(updatedData) => {
      setClasses(prev => prev.map(c => c.id === updatedData.id ? updatedData : c));
      setView("list");
    }} />;
  }

  if (view === "add") {
    return (
      <div className="p-6 md:p-8 animate-fadeIn font-sans bg-[#F4F6FA] min-h-full">
        <div className="text-[13px] font-medium text-gray-500 mb-4">
          Dashboard <span className="mx-2">›</span> Data Kelas <span className="mx-2">›</span> <span className="text-[#1A3D63] font-bold">Tambah Kelas</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setView("list")}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b]">Tambah Kelas Baru</h1>
            <p className="text-[14px] text-gray-500 mt-1">Isi form untuk menambahkan data kelas baru ke dalam sistem.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Form) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Identitas Kelas */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Identitas Kelas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Kode Kelas<span className="text-red-500">*</span></label>
                  <input type="text" value={addForm.code} onChange={(e) => setAddForm({...addForm, code: e.target.value})} placeholder="cth. X-IPA-1" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                  <p className="text-[11px] text-gray-400 mt-1.5">Kode unik untuk mengidentifikasi kelas</p>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Nama Kelas<span className="text-red-500">*</span></label>
                  <input type="text" value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} placeholder="cth. Kelas X IPA 1" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Deskripsi</label>
                <textarea rows="3" value={addForm.desc} onChange={(e) => setAddForm({...addForm, desc: e.target.value})} placeholder="Deskripsi singkat tentang kelas ini (opsional)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]"></textarea>
              </div>
            </div>

            {/* Tingkat & Jurusan */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Tingkat & Jurusan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Tingkat Kelas<span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {["Kelas X", "Kelas XI", "Kelas XII"].map(t => (
                      <button 
                        key={t}
                        onClick={() => setLevel(t)}
                        className={`flex-1 py-3 text-[13px] font-bold rounded-xl border ${level === t ? 'border-[#3B82F6] text-[#3B82F6] bg-[#EFF6FF]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Jurusan / Program<span className="text-red-500">*</span></label>
                  <input type="text" value={addForm.major} onChange={(e) => setAddForm({...addForm, major: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                </div>
              </div>
            </div>

            {/* Pengaturan Kelas */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Pengaturan Kelas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Ruangan<span className="text-red-500">*</span></label>
                  <input type="text" value={addForm.room} onChange={(e) => setAddForm({...addForm, room: e.target.value})} placeholder="cth. Ruang 101" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Kapasitas Siswa</label>
                  <input type="number" value={addForm.capacity} onChange={(e) => setAddForm({...addForm, capacity: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Tahun Ajaran</label>
                  <input type="text" value={addForm.year} onChange={(e) => setAddForm({...addForm, year: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Semester</label>
                  <input type="text" value={addForm.semester} onChange={(e) => setAddForm({...addForm, semester: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                </div>
              </div>
            </div>

            {/* Catatan Tambahan */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Catatan Tambahan</h3>
              <textarea rows="3" placeholder="Catatan tambahan tentang kelas ini (opsional)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-[#F8FAFC]"></textarea>
            </div>

          </div>

          {/* Right Column (Sidebar actions) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Wali Kelas */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#3B82F6]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
                <h3 className="text-[15px] font-bold text-[#1e293b]">Wali Kelas</h3>
              </div>
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3 flex items-start gap-2 mb-4 text-[#2563EB]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <p className="text-[12px]">Pilih wali kelas dari daftar di bawah</p>
              </div>
              <input type="text" value={addForm.teacher} onChange={(e) => setAddForm({...addForm, teacher: e.target.value})} placeholder="Nama Wali Kelas" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700" />
            </div>

            {/* Status Kelas */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Status Kelas</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[14px] font-bold text-[#1e293b]">Aktif</div>
                  <div className="text-[11px] text-gray-400">Kelas dapat digunakan dalam jadwal</div>
                </div>
                <div 
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isActive ? 'bg-[#3B82F6]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-[24px] p-5">
              <div className="flex items-start gap-2 text-[#A16207] mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span className="text-[13px] font-bold">Perhatian</span>
              </div>
              <p className="text-[11px] text-[#A16207] leading-relaxed">
                Pastikan kode kelas bersifat unik dan belum digunakan. Setelah disimpan, beberapa data tidak dapat diubah tanpa konfirmasi admin.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button onClick={handleSaveAdd}
                className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Simpan Kelas
              </button>
              <button 
                onClick={() => setView("list")}
                className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Batalkan
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] font-medium text-gray-500 mb-1">Dashboard <span className="mx-2">›</span> Kelola Akademik <span className="mx-2">›</span> <span className="text-[#1e293b] font-bold">Semester</span></div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Data Kelas</h1>
          <p className="text-[14px] text-gray-500 mt-1">Kelola data kelas, wali kelas, dan informasi ruangan belajar siswa.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Ekspor Daftar
          </button>
          <button
            onClick={() => setView("add")}
            className="bg-[#1A3D63] hover:bg-[#122A44] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            Tambah Kelas
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Kelas</div>
            <div className="text-3xl font-black text-white">13</div>
            <div className="text-xs font-medium text-blue-300 mt-2">12 kelas aktif</div>
          </div>
        </div>

        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Kelas Aktif</div>
            <div className="text-3xl font-black text-white">12</div>
            <div className="text-xs font-medium text-blue-300 mt-2">1 tidak aktif</div>
          </div>
        </div>

        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Siswa</div>
            <div className="text-3xl font-black text-white">390</div>
            <div className="text-xs font-medium text-blue-300 mt-2">Seluruh kelas</div>
          </div>
        </div>

        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Rata-rata Siswa/Kelas</div>
            <div className="text-3xl font-black text-white">30</div>
            <div className="text-xs font-medium text-blue-300 mt-2">siswa per kelas</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filters and Search */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
            {["Semua Tingkat", "Kelas X", "Kelas XI", "Kelas XII"].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 text-[12px] font-bold rounded-lg transition-colors ${activeTab === t ? 'bg-[#1A3D63] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 focus:outline-none focus:border-[#1A3D63]">
                <option>Semua Jurusan</option>
                <option>IPA</option>
                <option>IPS</option>
                <option>Bahasa</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-3 text-gray-400"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-3.5 text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari kelas atau wali kelas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#1A3D63] w-[250px] font-medium" 
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-3 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">NO</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">KODE KELAS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">NAMA KELAS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">TINGKAT</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">JURUSAN</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">WALI KELAS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">SISWA / KAPASITAS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">RUANGAN</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">STATUS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {classes.filter(item => 
                (activeTab === "Semua Tingkat" || item.level === activeTab) &&
                (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase()) || item.teacher.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">{item.id}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-gray-500">{item.code}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-[#1e293b]">{item.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                      item.major === 'IPA' ? 'bg-[#1A3D63]/10 text-[#1A3D63] border-[#1A3D63]/20' :
                      item.major === 'IPS' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {item.major}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600 font-medium">{item.teacher}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold text-[#1e293b] w-12">{item.students}/{item.capacity}</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#1A3D63]" 
                          style={{ width: `${(item.students/item.capacity)*100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">{item.room}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center justify-center gap-1.5 mx-auto w-fit">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setSelectedClass(item); setView("detail"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button onClick={() => { setSelectedClass(item); setView("edit"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-[13px] text-gray-500">
            Menampilkan 1-10 dari 13 kelas
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A3D63] text-white text-[13px] font-bold shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-[13px] font-bold shadow-sm">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Classes;
