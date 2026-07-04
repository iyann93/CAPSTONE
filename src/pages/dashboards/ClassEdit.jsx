import React, { useState } from "react";

const ClassEdit = ({ setView, initialData, teachers, onSave, onDelete }) => {
  const [editForm, setEditForm] = useState(initialData || {
    id: Date.now(),
    code: "VII-1",
    name: "Kelas VII 1",
    desc: "",
    level: "Kelas VII",
    teacher: "Ibu Sari Dewi, S.Pd",
    capacity: 36,
    students: 32,
    room: "Ruang 101",
    status: "Aktif",
    year: "2023/2024",
    semester: "Ganjil"
  });

  const handleSave = () => {
    if (onSave) onSave(editForm);
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn font-sans bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] font-medium text-gray-500 mb-4">
        Dashboard <span className="mx-2">›</span> Data Kelas <span className="mx-2">›</span> Kelas X IPA 1 <span className="mx-2">›</span> <span className="text-[#1e293b] font-bold">Edit</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("list")}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Edit Kelas</h1>
              <span className="text-[13px] text-gray-400 font-bold uppercase tracking-wider">{editForm.code}</span>
            </div>
            <p className="text-[14px] text-gray-500 mt-1">Anda sedang mengubah data {editForm.name}. Perubahan akan berpengaruh pada jadwal dan rapor semester yang berjalan.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            if (onDelete) {
              onDelete(editForm.id);
              setView("list");
            }
          }}
          className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path></svg>
          Hapus Kelas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Identitas Kelas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Kode Kelas<span className="text-red-500">*</span></label>
                <input type="text" value={editForm.code} onChange={e => setEditForm({...editForm, code: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
                <p className="text-[11px] text-gray-400 mt-1.5">Kode unik, tidak boleh sama dengan kelas lain</p>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Nama Kelas<span className="text-red-500">*</span></label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Deskripsi</label>
              <textarea rows="3" value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} placeholder="Deskripsi kelas (opsional)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-[#F8FAFC]"></textarea>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Tingkat Kelas</h3>
            
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Tingkat Kelas<span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  {["Kelas VII", "Kelas VIII", "Kelas IX"].map(t => (
                    <button key={t} onClick={() => setEditForm({...editForm, level: t})} className={`flex-1 py-3 text-[13px] font-bold rounded-xl border ${editForm.level === t ? 'border-[#3B82F6] text-white bg-[#3B82F6]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Pengaturan Kelas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Ruangan<span className="text-red-500">*</span></label>
                <input type="text" value={editForm.room} onChange={e => setEditForm({...editForm, room: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Kapasitas Siswa</label>
                <input type="number" value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Tahun Ajaran</label>
                <input type="text" value={editForm.year} onChange={e => setEditForm({...editForm, year: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Semester</label>
                <input type="text" value={editForm.semester} onChange={e => setEditForm({...editForm, semester: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-6">Riwayat Perubahan</h3>
            
            <div className="relative pl-6 space-y-6">
              <div className="absolute top-2 bottom-2 left-[11px] w-px bg-gray-200"></div>
              
              <div className="relative">
                <div className="absolute -left-[28px] top-1 w-6 h-6 rounded-full bg-[#818CF8] text-white flex items-center justify-center text-[9px] font-bold border-2 border-white">SR</div>
                <div>
                  <div className="text-[13px] font-bold text-[#1e293b]">Siti Rahayu</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">Memperbarui wali kelas dari Bpk. Dani ke Ibu Sari Dewi</div>
                  <div className="text-[11px] text-gray-400 mt-1">10 Nov 2023 · 14:30</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[28px] top-1 w-6 h-6 rounded-full bg-[#818CF8] text-white flex items-center justify-center text-[9px] font-bold border-2 border-white">SR</div>
                <div>
                  <div className="text-[13px] font-bold text-[#1e293b]">Siti Rahayu</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">Mengubah kapasitas kelas dari 35 menjadi 36</div>
                  <div className="text-[11px] text-gray-400 mt-1">2 Okt 2023 · 09:15</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[28px] top-1 w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[9px] font-bold border-2 border-white">AS</div>
                <div>
                  <div className="text-[13px] font-bold text-[#1e293b]">Admin Sistem</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">Membuat data kelas pertama kali</div>
                  <div className="text-[11px] text-gray-400 mt-1">12 Jul 2023 · 08:00</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[#3B82F6]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline>
              </svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Wali Kelas</h3>
            </div>
            
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#818CF8] text-white flex items-center justify-center font-bold text-sm">
                {editForm.teacher ? editForm.teacher.substring(0,2).toUpperCase() : "WK"}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1e293b]">{editForm.teacher}</div>
                <div className="text-[11px] text-gray-500">Guru Utama</div>
              </div>
            </div>

            <select 
              value={editForm.teacherId || ""} 
              onChange={e => {
                const sel = teachers.find(t => t.id === e.target.value);
                setEditForm({...editForm, teacherId: e.target.value, teacher: sel ? sel.nama : "Belum Ditentukan"});
              }} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700"
            >
              <option value="">-- Pilih Wali Kelas --</option>
              {teachers && teachers.map(t => (
                <option key={t.id} value={t.id}>{t.nama}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Status Kelas</h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-bold text-[#1e293b]">Aktif</div>
                <div className="text-[11px] text-gray-400">Kelas dapat digunakan dalam jadwal</div>
              </div>
              <div onClick={() => setEditForm({...editForm, status: editForm.status === 'Aktif' ? 'Nonaktif' : 'Aktif'})} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${editForm.status === 'Aktif' ? 'bg-[#3B82F6]' : 'bg-gray-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${editForm.status === 'Aktif' ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Dibuat</span>
                <span className="text-[13px] text-[#1e293b] font-medium">12 Jul 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Diperbarui</span>
                <span className="text-[13px] text-[#1e293b] font-medium">5 Nov 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Jumlah Siswa</span>
                <span className="text-[13px] text-[#1e293b] font-medium">{editForm.students} siswa</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={handleSave} className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Simpan Perubahan
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
};

export default ClassEdit;
