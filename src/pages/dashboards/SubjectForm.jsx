import React, { useState } from "react";

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`w-[44px] h-[24px] rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-[#1e293b]' : 'bg-gray-200'}`}
    >
      <div className={`w-[16px] h-[16px] bg-white rounded-full shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-[20px]' : 'translate-x-0'}`} />
    </div>
  );
};

const SubjectForm = ({ mode = "add", initialData = null, onBack, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    kode: initialData?.kode || "",
    nama: initialData?.nama || "",
    deskripsi: initialData?.deskripsi || "",
    kelompok: initialData?.kelompok || "Wajib",
    kurikulum: initialData?.kurikulum || "Kurikulum Merdeka",
    jenjang: initialData?.jenjang || ["Kelas X", "Kelas XI", "Kelas XII"],
    jam: initialData?.jam || 4,
    durasi: initialData?.durasi || "45",
    kkm: initialData?.kkm || 75,
    aktif: initialData?.aktif !== undefined ? initialData.aktif : true,
    masukRapor: initialData?.masukRapor !== undefined ? initialData.masukRapor : true,
    guru: initialData?.guru || { id: "DH", name: "Drs. Hendra, M.Pd.", role: "Guru Matematika", status: "Aktif" }
  });

  const toggleJenjang = (kelas) => {
    setFormData(prev => ({
      ...prev,
      jenjang: prev.jenjang.includes(kelas) 
        ? prev.jenjang.filter(k => k !== kelas)
        : [...prev.jenjang, kelas]
    }));
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[13px] font-medium text-gray-400 mb-1">
            Dashboard <span className="mx-1">&gt;</span> Kelola Akademik <span className="mx-1">&gt;</span> Mata Pelajaran <span className="mx-1">&gt;</span> <span className="text-gray-600 font-bold">{mode === 'add' ? 'Tambah Baru' : 'Edit'}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-bold text-[#1e293b]">
              {mode === 'add' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'}
            </h1>
            {mode === 'edit' && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[11px] font-bold tracking-wider">{initialData?.kode || 'MTK'}</span>
            )}
          </div>
          <p className="text-gray-500 text-[14px] mt-1">
            {mode === 'add' 
              ? 'Isi formulir berikut untuk menambahkan mata pelajaran baru ke dalam sistem.'
              : 'Perbarui informasi dan pengaturan mata pelajaran Matematika.'}
          </p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Daftar
        </button>
      </div>

      {/* Alert if Edit Mode */}
      {mode === 'edit' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <div className="text-orange-500 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <p className="text-[13px] text-orange-800 font-medium leading-relaxed">
            Anda sedang mengedit data aktif. Perubahan akan langsung berpengaruh pada jadwal pelajaran dan laporan semester yang berjalan.
          </p>
        </div>
      )}

      {/* Form Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column (Main Form) */}
        <div className="flex-1 space-y-6">
          
          {/* Card 1: Identitas Mata Pelajaran */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Identitas Mata Pelajaran</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Kode Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.kode}
                    onChange={(e) => setFormData({...formData, kode: e.target.value})}
                    disabled={mode === 'edit'}
                    className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:border-gray-400 transition-colors ${mode === 'edit' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'text-gray-800'}`}
                    placeholder="M T K"
                  />
                  {mode === 'edit' && (
                    <span className="absolute right-3 top-3 text-[11px] font-medium text-gray-400">Tidak dapat diubah</span>
                  )}
                </div>
                {mode === 'add' && <p className="text-[12px] text-gray-400 mt-1.5">Kode unik 2-4 huruf kapital, misal: MTK, BIN, FIS.</p>}
                {mode === 'edit' && <p className="text-[12px] text-gray-400 mt-1.5">Kode mata pelajaran bersifat permanen setelah dibuat.</p>}
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Nama Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="Matematika Wajib"
                />
                <p className="text-[12px] text-gray-400 mt-1.5">Nama lengkap sesuai kurikulum yang berlaku.</p>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Deskripsi Singkat</label>
              <textarea 
                value={formData.deskripsi}
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                placeholder="Mata pelajaran matematika wajib yang mencakup aljabar, geometri, dan kalkulus dasar..."
              ></textarea>
              <p className="text-[12px] text-gray-400 mt-1.5">Opsional. Maksimal 200 karakter.</p>
            </div>
          </div>

          {/* Card 2: Pengaturan Kurikulum */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Pengaturan Kurikulum</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Kelompok Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={formData.kelompok}
                    onChange={(e) => setFormData({...formData, kelompok: e.target.value})}
                    className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                  >
                    <option>Wajib</option>
                    <option>IPA</option>
                    <option>IPS</option>
                    <option>Lintas Minat</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <p className="text-[12px] text-gray-400 mt-1.5">Wajib / IPA / IPS / Lintas Minat / Mulok.</p>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Kurikulum <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={formData.kurikulum}
                    onChange={(e) => setFormData({...formData, kurikulum: e.target.value})}
                    className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                  >
                    <option>Kurikulum Merdeka</option>
                    <option>Kurikulum 2013</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">
                Jenjang Kelas <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {["Kelas X", "Kelas XI", "Kelas XII"].map(kelas => (
                  <button
                    key={kelas}
                    onClick={() => toggleJenjang(kelas)}
                    className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                      formData.jenjang.includes(kelas)
                        ? "bg-[#1e293b] text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {kelas}
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-gray-400 mt-2.5">Pilih jenjang kelas yang mengikuti mata pelajaran ini.</p>
            </div>
          </div>

          {/* Card 3: Alokasi Waktu */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Alokasi Waktu</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Jam / Minggu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.jam}
                    onChange={(e) => setFormData({...formData, jam: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                  <div className="absolute right-2 top-1.5 flex flex-col">
                    <button className="text-gray-400 hover:text-gray-600"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                    <button className="text-gray-400 hover:text-gray-600 -mt-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Durasi per Sesi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={formData.durasi}
                    onChange={(e) => setFormData({...formData, durasi: e.target.value})}
                    className="w-full appearance-none pl-4 pr-12 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                  >
                    <option value="40">40</option>
                    <option value="45">45</option>
                    <option value="50">50</option>
                  </select>
                  <span className="absolute right-10 top-3 text-[13px] text-gray-500 font-medium">menit</span>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  KKM (Nilai Minimum) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={formData.kkm}
                  onChange={(e) => setFormData({...formData, kkm: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="75"
                />
                <p className="text-[12px] text-gray-400 mt-1.5">Skala 0-100.</p>
              </div>
            </div>
          </div>

          {/* Riwayat Perubahan (Only in Edit Mode) */}
          {mode === 'edit' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-6">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Riwayat Perubahan</h2>
              </div>
              <div className="space-y-5 pl-2 relative before:absolute before:inset-y-2 before:left-3.5 before:w-px before:bg-gray-100">
                <div className="relative flex gap-4 items-start">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 z-10 mt-1"></div>
                  <div>
                    <p className="text-[13px] text-gray-800"><span className="font-bold">Siti Rahayu</span> — Memperbarui guru pengampu dari Bpk. Agus ke Drs. Hendra</p>
                    <span className="text-[11px] font-medium text-gray-400">12 Okt 2023, 10:22</span>
                  </div>
                </div>
                <div className="relative flex gap-4 items-start">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 z-10 mt-1"></div>
                  <div>
                    <p className="text-[13px] text-gray-800"><span className="font-bold">Siti Rahayu</span> — Mengubah KKM dari 70 menjadi 75</p>
                    <span className="text-[11px] font-medium text-gray-400">3 Sep 2023, 14:05</span>
                  </div>
                </div>
                <div className="relative flex gap-4 items-start">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 z-10 mt-1"></div>
                  <div>
                    <p className="text-[13px] text-gray-800"><span className="font-bold">Admin Sistem</span> — Mata pelajaran dibuat pertama kali</p>
                    <span className="text-[11px] font-medium text-gray-400">17 Jul 2023, 08:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Sidebar Settings) */}
        <div className="lg:w-[340px] space-y-6">
          
          {/* Guru Pengampu */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Guru Pengampu</h2>
            </div>
            
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Pilih Guru</label>
            <div className="relative mb-2">
              <select 
                value={formData.guru?.name || ""}
                onChange={(e) => {
                  const name = e.target.value;
                  if (!name) {
                    setFormData(prev => ({ ...prev, guru: null }));
                    return;
                  }
                  const id = name.substring(0, 2).toUpperCase();
                  setFormData(prev => ({
                    ...prev,
                    guru: { id, name, role: "Guru Mapel", status: "Aktif" }
                  }));
                }}
                className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              >
                <option value="">-- Pilih Guru Pengampu --</option>
                <option value="Drs. Hendra, M.Pd.">Drs. Hendra, M.Pd.</option>
                <option value="Ibu Nuraini, S.Pd.">Ibu Nuraini, S.Pd.</option>
                <option value="Mr. Andrian, M.A.">Mr. Andrian, M.A.</option>
                <option value="Ibu Sari, S.Pd.">Ibu Sari, S.Pd.</option>
                <option value="Bpk. Rudi, M.Si.">Bpk. Rudi, M.Si.</option>
                <option value="Ibu Dewi, S.Pd.">Ibu Dewi, S.Pd.</option>
                <option value="Ibu Kartika, S.E.">Ibu Kartika, S.E.</option>
                <option value="Bpk. Suherman, M.Pd.">Bpk. Suherman, M.Pd.</option>
                <option value="Ibu Ratna, S.Pd.">Ibu Ratna, S.Pd.</option>
                <option value="Bpk. Wahyu, M.Pd.">Bpk. Wahyu, M.Pd.</option>
                <option value="Ibu Marlina, S.Pd.">Ibu Marlina, S.Pd.</option>
                <option value="Bpk. Eko, S.Pd.">Bpk. Eko, S.Pd.</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            <p className="text-[12px] text-gray-400 mb-5">Guru utama yang mengampu mata pelajaran ini.</p>

            {/* Selected Guru Card */}
            {formData.guru && (
              <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
                    {formData.guru.id}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-800">{formData.guru.name}</div>
                    <div className="text-[11px] text-gray-500 font-medium">{formData.guru.role} — {formData.guru.status}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, guru: null }))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}
          </div>

          {/* Status Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Status</h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-0.5">Mata Pelajaran Aktif</div>
                  <div className="text-[11px] text-gray-500 font-medium">Aktifkan agar tampil di jadwal dan rapor.</div>
                </div>
                <ToggleSwitch checked={formData.aktif} onChange={(val) => setFormData({...formData, aktif: val})} />
              </div>
              <div className="h-px bg-gray-100 w-full"></div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-0.5">Masuk dalam Rapor</div>
                  <div className="text-[11px] text-gray-500 font-medium">Nilai akan dicetak pada rapor siswa.</div>
                </div>
                <ToggleSwitch checked={formData.masukRapor} onChange={(val) => setFormData({...formData, masukRapor: val})} />
              </div>
            </div>

            {mode === 'edit' && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Informasi Data</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-500">Dibuat</span>
                    <span className="font-bold text-gray-700">17 Jul 2023</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-500">Terakhir diperbarui</span>
                    <span className="font-bold text-gray-700">12 Okt 2023</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-500">Diperbarui oleh</span>
                    <span className="font-bold text-gray-700">Siti Rahayu</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-500">Kelas yang mengampu</span>
                    <span className="font-bold text-gray-700">32 kelas</span>
                  </div>
                </div>
              </div>
            )}

            {mode === 'add' && (
              <div className="mt-6 bg-gray-50 rounded-xl p-4 flex gap-3">
                <div className="text-gray-400 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                  Setelah mata pelajaran ditambahkan, Anda dapat mengassign-nya ke kelas melalui menu <span className="font-bold text-gray-700">Jadwal Pelajaran</span>, dan mengatur KKM per kelas di menu <span className="font-bold text-gray-700">Data Kelas</span>.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => {
                if (!formData.kode || !formData.nama) {
                  alert("Kode dan Nama Mata Pelajaran harus diisi!");
                  return;
                }
                onSave(formData);
              }}
              className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white py-3 rounded-xl text-[14px] font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              {mode === 'add' ? 'Simpan Mata Pelajaran' : 'Simpan Perubahan'}
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Batalkan
            </button>
            
            {mode === 'edit' && (
              <button 
                onClick={() => onDelete(formData.kode)}
                className="w-full bg-red-50/50 hover:bg-red-50 text-red-600 py-3 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 mt-4 border border-red-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Hapus Mata Pelajaran
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubjectForm;
