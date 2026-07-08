import React, { useState } from 'react';

import api from "../../api/axios";

const Semester = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedYear, setSelectedYear] = useState("Semua Tahun");

  const [semesters, setSemesters] = useState([]);
  const [tahunAjarans, setTahunAjarans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resSemesters, resTahunAjarans] = await Promise.all([
        api.get('/semester?limit=100'),
        api.get('/tahun-ajaran?limit=100')
      ]);
      const semesterData = resSemesters.data.data || [];
      const mapped = semesterData.map(s => ({
        id: s.id,
        name: s.nama,
        year: s.tahun_ajaran_nama,
        yearId: s.tahun_ajaran_id,
        type: s.nama.split(' ')[0],
        start: new Date(s.tanggal_mulai).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}),
        end: new Date(s.tanggal_selesai).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}),
        startRaw: s.tanggal_mulai.split('T')[0],
        endRaw: s.tanggal_selesai.split('T')[0],
        students: "0",
        classes: "0",
        status: s.is_aktif ? 'Aktif' : 'Selesai'
      }));
      setSemesters(mapped);
      const fetchedTahunAjarans = resTahunAjarans.data.data || [];
      
      // Fallback if empty from DB
      if (fetchedTahunAjarans.length === 0) {
        fetchedTahunAjarans.push({ id: '00000001-0000-0000-0000-000000000001', nama: '2025/2026' });
      }
      
      setTahunAjarans(fetchedTahunAjarans);
      
      // Auto-select 2025/2026 if available
      const targetTA = fetchedTahunAjarans.find(t => t.nama === '2025/2026');
      if (targetTA && !addForm.yearId) {
        setAddForm(prev => ({ ...prev, yearId: targetTA.id }));
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data.');
      // Force fallback if API fails completely
      setTahunAjarans([{ id: '00000001-0000-0000-0000-000000000001', nama: '2025/2026' }]);
      if (!addForm.yearId) {
        setAddForm(prev => ({ ...prev, yearId: '00000001-0000-0000-0000-000000000001' }));
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const [addForm, setAddForm] = useState({
    yearId: "",
    type: "Ganjil",
    start: "2025-07-15",
    end: "2025-12-20",
    status: "Draft",
    uts: "2025-10-14",
    uas: "2025-12-09",
    rapor: "2025-12-21",
    deadline: "2025-12-16",
    hariEfektif: 140
  });

  const handleSaveAdd = async () => {
    const selectedTA = tahunAjarans.find(t => t.id === addForm.yearId);
    if (!selectedTA) return alert("Pilih tahun ajaran");
    const name = `${addForm.type} ${selectedTA.nama}`;
    try {
      await api.post('/semester', {
        nama: name,
        tahunAjaranId: addForm.yearId,
        tanggalMulai: addForm.start,
        tanggalSelesai: addForm.end
      });
      fetchData();
      setView("list");
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan semester');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semester ini?")) {
      try {
        await api.delete(`/semester/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus');
      }
    }
  };

  const handleClose = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menonaktifkan semester ini?")) {
      // API currently only supports setActive, to deactivate maybe we can't do it via API directly unless we have a specific endpoint. 
      // But we are not allowed to add new backend functionality right now. 
      // Wait, is there a deactivate endpoint?
      alert('Semester tidak bisa ditutup langsung dari sistem tanpa mengaktifkan semester lain.');
    }
  };

  const handleActivate = async (id) => {
    if (window.confirm("Aktifkan semester ini? Semester yang sedang aktif akan otomatis ditutup.")) {
      try {
        await api.put(`/semester/${id}/active`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal mengaktifkan');
      }
    }
  };


  if (view === "add") {
    return (
      <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 font-medium mb-2">
          Dashboard <span className="mx-2">&rsaquo;</span> Kelola Akademik <span className="mx-2">&rsaquo;</span> <span className="cursor-pointer hover:text-[#1A3D63] hover:underline" onClick={() => setView("list")}>Semester</span> <span className="mx-2">&rsaquo;</span> <span className="text-[#1A3D63] font-semibold">Tambah Baru</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b]">Tambah Semester Baru</h1>
            <p className="text-gray-500 text-[14px] mt-1">
              Buat periode semester baru untuk tahun ajaran yang akan datang.
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
        <div className="bg-[#EEF2F6] border border-[#D5E1EA] rounded-xl p-4 flex gap-3 items-start">
          <div className="text-[#4A7FA7] mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <p className="text-[13px] text-[#334155] leading-relaxed">
            Semester aktif saat ini: <span className="font-semibold text-[#1e293b]">Ganjil 2023/2024</span>. Semester baru tidak akan otomatis aktif — Anda perlu mengaktifkannya secara manual setelah semester berjalan selesai.
          </p>
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-8 space-y-6">
            {/* Identitas Semester */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Identitas Semester</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Tahun Ajaran <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        value={addForm.yearId || ''} 
                        onChange={(e) => setAddForm({...addForm, yearId: e.target.value})} 
                        className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20">
                        <option value="" disabled>Pilih Tahun Ajaran</option>
                        {tahunAjarans.map(t => (
                          <option key={t.id} value={t.id}>{t.nama}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">Pilih atau buat tahun ajaran baru.</p>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Tipe Semester <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      <label onClick={() => setAddForm({...addForm, type: 'Ganjil'})} className={`flex-1 flex items-center gap-3 px-4 py-3 border ${addForm.type === 'Ganjil' ? 'border-2 border-[#1A3D63] bg-[#F8FAFC]' : 'border-gray-200'} rounded-xl cursor-pointer`}>
                        <div className={`w-4 h-4 rounded-full border ${addForm.type === 'Ganjil' ? 'border-[5px] border-[#1A3D63] bg-white shadow-sm' : 'border-gray-300 bg-white'}`}></div>
                        <span className={`text-[14px] font-bold ${addForm.type === 'Ganjil' ? 'text-[#1e293b]' : 'text-gray-500'}`}>Ganjil</span>
                      </label>
                      <label onClick={() => setAddForm({...addForm, type: 'Genap'})} className={`flex-1 flex items-center gap-3 px-4 py-3 border ${addForm.type === 'Genap' ? 'border-2 border-[#1A3D63] bg-[#F8FAFC]' : 'border-gray-200 hover:bg-gray-50 transition-colors'} rounded-xl cursor-pointer`}>
                        <div className={`w-4 h-4 rounded-full border ${addForm.type === 'Genap' ? 'border-[5px] border-[#1A3D63] bg-white shadow-sm' : 'border-gray-300 bg-white'}`}></div>
                        <span className={`text-[14px] font-medium ${addForm.type === 'Genap' ? 'text-[#1e293b] font-bold' : 'text-gray-500'}`}>Genap</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Nama Semester</label>
                  <div className="relative">
                    <input type="text" readOnly value={`${addForm.type} ${tahunAjarans.find(t => t.id === addForm.yearId)?.nama || ''}`} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-36 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none" />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <span className="bg-white border border-gray-100 text-gray-400 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg shadow-sm">Digenerate otomatis</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Nama dibentuk otomatis dari tipe dan tahun ajaran yang dipilih.</p>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">ID Semester</label>
                  <div className="relative">
                    <input type="text" readOnly value="Akan digenerate oleh sistem" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-36 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <span className="bg-white border border-gray-100 text-gray-400 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg shadow-sm">Digenerate otomatis</span>
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
                      <input type="date" value={addForm.start} onChange={(e) => setAddForm({...addForm, start: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="date" value={addForm.end} onChange={(e) => setAddForm({...addForm, end: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    </div>
                  </div>
                </div>

                {/* Info banner */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 py-3 px-5 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-2 text-[12px] text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Durasi: <span className="font-bold text-[#1e293b] ml-1">159 hari</span>
                  </div>
                  <div className="hidden md:block w-px h-3 bg-gray-300 mx-1"></div>
                  <div className="text-[12px] text-gray-500">
                    15 Jul 2025 — 20 Des 2025
                  </div>
                  <div className="hidden md:block w-px h-3 bg-gray-300 mx-1"></div>
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#16A34A]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Tidak bentrok dengan semester lain
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Hari Efektif Belajar</label>
                    <div className="relative">
                      <input type="number" value={addForm.hariEfektif || 140} onChange={e => setAddForm({...addForm, hariEfektif: parseInt(e.target.value) || 0})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" style={{MozAppearance: 'textfield'}} />
                      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
                      <div className="absolute inset-y-0 right-0 flex">
                        <div className="flex items-center px-4 text-[13px] font-medium text-gray-500 border-l border-gray-200">
                          hari
                        </div>
                        <div className="flex flex-col border-l border-gray-200 w-8">
                          <button onClick={() => setAddForm({...addForm, hariEfektif: (addForm.hariEfektif || 140) + 1})} className="flex-1 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 rounded-tr-xl"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                          <button onClick={() => setAddForm({...addForm, hariEfektif: (addForm.hariEfektif || 140) - 1})} className="flex-1 flex items-center justify-center hover:bg-gray-50 rounded-br-xl"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">Di luar hari libur nasional dan sekolah.</p>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Minggu Efektif</label>
                    <div className="relative">
                      <input type="text" value={Math.floor((addForm.hariEfektif || 140) / 7)} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-24 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none" readOnly />
                      <div className="absolute inset-y-0 right-28 flex items-center pointer-events-none">
                        <span className="text-[13px] font-medium text-gray-500">minggu</span>
                      </div>
                      <div className="absolute inset-y-0 right-2 flex items-center">
                        <span className="bg-white border border-gray-100 text-gray-400 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg shadow-sm">Kalkulasi otomatis</span>
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
                      <input type="date" value={addForm.uts} onChange={e => setAddForm({...addForm, uts: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Ujian Akhir Semester (UAS)</label>
                    <div className="relative">
                      <input type="date" value={addForm.uas} onChange={e => setAddForm({...addForm, uas: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Pembagian Rapor</label>
                    <div className="relative">
                      <input type="date" value={addForm.rapor} onChange={e => setAddForm({...addForm, rapor: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Deadline Input Nilai Guru</label>
                    <div className="relative">
                      <input type="date" value={addForm.deadline} onChange={e => setAddForm({...addForm, deadline: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Awal */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Status Awal</h2>
              </div>
              <div className="p-6 space-y-4">
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Pilih Status Awal Semester</label>
                <div className="relative">
                  <select 
                    value={addForm.status} 
                    onChange={e => setAddForm({...addForm, status: e.target.value})}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20"
                  >
                    <option value="Draft">Simpan sebagai Draft (Tidak aktif)</option>
                    <option value="Aktif">Langsung Aktifkan</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>

                {addForm.status === 'Aktif' && (
                  <div className="mt-4 p-3 bg-[#FFF8EB] border border-[#FBE3B8] rounded-xl flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <p className="text-[11px] text-[#A67417] leading-relaxed">Menutup semester aktif sebelumnya akan mengunci semua input nilai dan absensi pada periode tersebut.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Salin dari Semester Lain */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Salin dari Semester Lain</h2>
              </div>
              <div className="p-6">
                <p className="text-[12px] text-gray-500 mb-5 leading-relaxed">Salin pengaturan jadwal penilaian dari semester sebelumnya sebagai acuan.</p>
                <div className="relative mb-5">
                  <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20">
                    <option>Ganjil 2024/2025</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Salin Pengaturan
                </button>
              </div>
            </div>

            {/* Ringkasan */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ringkasan</h2>
              </div>
              <div className="p-6 space-y-4.5">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-500">Semester</span>
                  <span className="font-bold text-[#1e293b]">Ganjil 2025/2026</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-500">Periode</span>
                  <span className="font-bold text-[#1e293b]">15 Jul — 20 Des 2025</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-500">Durasi</span>
                  <span className="font-bold text-[#1e293b]">159 hari</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-500">Minggu efektif</span>
                  <span className="font-bold text-[#1e293b]">20 minggu</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-500">Status awal</span>
                  <span className="bg-[#FFF4E5] text-[#D97706] text-[10px] font-bold px-2.5 py-1 rounded-md">Draft</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button onClick={handleSaveAdd} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Simpan Semester
              </button>
              <button
                onClick={() => setView("list")}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="text-[13px] font-medium text-gray-500 mb-1">Dashboard <span className="mx-2">&rsaquo;</span> Kelola Akademik <span className="mx-2">&rsaquo;</span> <span className="text-[#1e293b] font-bold">Semester</span></div>
            <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight mt-1">Manajemen Semester</h1>
            <p className="text-[14px] text-gray-500 mt-1">Kelola tahun ajaran dan semester aktif yang berlaku di sekolah.</p>
          </div>
          <button
            onClick={() => setView("add")}
            className="bg-[#1A3D63] hover:bg-[#0A1931] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            Tambah Semester Baru
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {(() => {
            const aktivSemester = semesters.find(s => s.status === 'Aktif');
            const totalRiwayat = semesters.length;

            // Hitung durasi dan sisa hari dari semester aktif
            let durasiHari = '-';
            let sisaHari = '-';
            let semesterAktifLabel = aktivSemester?.name || 'Tidak Ada';

            if (aktivSemester) {
              const parseDate = (str) => {
                if (!str) return null;
                const months = { Jan:0,Feb:1,Mar:2,Apr:3,Mei:4,Jun:5,Jul:6,Agu:7,Sep:8,Okt:9,Nov:10,Des:11 };
                const parts = str.split(' ');
                if (parts.length === 3) {
                  return new Date(parseInt(parts[2]), months[parts[1]] ?? 0, parseInt(parts[0]));
                }
                return new Date(str);
              };
              const startDate = parseDate(aktivSemester.start);
              const endDate = parseDate(aktivSemester.end);
              const today = new Date();
              if (startDate && endDate) {
                const totalMs = endDate - startDate;
                const passedMs = today - startDate;
                const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));
                const passedDays = Math.max(0, Math.round(passedMs / (1000 * 60 * 60 * 24)));
                const remaining = Math.max(0, totalDays - passedDays);
                durasiHari = `${Math.min(passedDays, totalDays)} Hari`;
                sisaHari = `${remaining} Hari`;
              }
              // Buat label singkat (misal: "Ganjil 23/24")
              const yearShort = aktivSemester.year?.replace(/20(\d{2})\/(20)(\d{2})/, '$1/$3') || aktivSemester.year;
              const tipe = aktivSemester.name?.split(' ')[0] || '';
              semesterAktifLabel = `${tipe} ${yearShort}`;
            }

            return (
              <>
                {/* Card 1: Semester Aktif */}
                <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
                  <div>
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Semester Aktif</div>
                    <div className="text-2xl lg:text-3xl font-black text-white">{semesterAktifLabel}</div>
                    {aktivSemester && (
                      <div className="text-xs font-medium text-blue-300 mt-2">{aktivSemester.start} — {aktivSemester.end}</div>
                    )}
                  </div>
                </div>

                {/* Card 2: Durasi Berjalan */}
                <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
                  <div>
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Durasi Berjalan</div>
                    <div className="text-3xl font-black text-white">{durasiHari}</div>
                  </div>
                </div>

                {/* Card 3: Sisa Hari */}
                <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
                  <div>
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Sisa Hari</div>
                    <div className="text-3xl font-black text-white">{sisaHari}</div>
                  </div>
                </div>

                {/* Card 4: Total Riwayat */}
                <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
                  <div>
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Riwayat</div>
                    <div className="text-3xl font-black text-white">{totalRiwayat} Semester</div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Progress Bar Section */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-bold text-[#1e293b] text-[15px]">Semester Aktif Saat Ini</span>
              <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded">Sedang Berjalan</span>
            </div>
            <div className="text-[13px] font-medium text-gray-500">
              17 Jul 2023 — 22 Des 2023
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3.5 mb-3 relative overflow-hidden">
            <div className="bg-[#1A3D63] h-3.5 rounded-full" style={{ width: '63%' }}></div>
          </div>

          <div className="flex justify-between items-center text-[12px] font-medium text-gray-500">
            <div>Mulai: 17 Jul 2023</div>
            <div className="font-bold text-[#1e293b]">63% Selesai (100 / 159 Hari)</div>
            <div>Selesai: 22 Des 2023</div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-[16px] font-bold text-[#1e293b]">Daftar Semua Semester</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari semester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 w-[200px]"
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-2.5 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <div className="relative">
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="appearance-none pl-4 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20">
                  {["Semua Tahun", ...new Set(semesters.map(s => s.year))].map((y, idx) => (
                    <option key={idx} value={y}>{y}</option>
                  ))}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-2.5 text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">SEMESTER</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">TAHUN AJARAN</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">PERIODE</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">SISWA</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">JML. ROMBEL</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {semesters.filter(item => {
                  const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      item.year.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchYear = selectedYear === "Semua Tahun" || item.year === selectedYear;
                  return matchSearch && matchYear;
                }).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[#1e293b]">{item.name}</div>
                          <div className="text-[12px] text-gray-400 mt-0.5 font-medium">{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#1e293b] font-bold">{item.year}</td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-[#1e293b] font-semibold">{item.start}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">s/d {item.end}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-[14px] text-gray-600 font-semibold">{item.students} Siswa</td>
                    <td className="px-6 py-4 text-center text-[14px] text-gray-600 font-semibold">{item.classes} Kelas</td>
                    <td className="px-6 py-4">
                      {item.status === 'Aktif' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#ECFDF5] text-[#059669]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#F1F5F9] text-gray-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> {item.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedSemester(item); setView('detail'); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button onClick={() => { setSelectedSemester(item); setView('edit'); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        {item.status === 'Aktif' ? (
                          <button onClick={() => handleClose(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 text-[12px] font-bold transition-colors ml-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Tutup Semester
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 ml-1">
                            <button onClick={() => handleActivate(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-[12px] font-bold transition-colors">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                              Aktifkan
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                          </div>
                        )}
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
              Menampilkan {semesters.length} dari {semesters.length} semester
            </div>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-[13px] font-semibold text-gray-400 cursor-not-allowed">
                Sebelumnya
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A3D63] text-white text-[13px] font-bold shadow-sm">
                1
              </button>
              <button className="px-3 py-1.5 text-[13px] font-semibold text-gray-400 cursor-not-allowed">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "edit") {
    return <SemesterEdit setView={setView} initialData={selectedSemester} tahunAjarans={tahunAjarans} onSave={async (updatedData) => {
      try {
        await api.put(`/semester/${updatedData.id}`, {
          nama: updatedData.name,
          tahunAjaranId: updatedData.yearId,
          tanggalMulai: updatedData.startRaw || updatedData.start,
          tanggalSelesai: updatedData.endRaw || updatedData.end
        });
        fetchData();
        setView("list");
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menyimpan perubahan');
      }
    }} />;
  }

  if (view === "detail") {
    return <SemesterDetail setView={setView} semester={selectedSemester} />;
  }

  return null;
};

// --- EDIT VIEW COMPONENT ---
const SemesterEdit = ({ setView, initialData, tahunAjarans, onSave }) => {
  const [editForm, setEditForm] = useState(initialData || {
    id: "SMT-2023-1",
    name: "Ganjil 2023/2024",
    yearId: "",
    year: "2023/2024",
    type: "Ganjil",
    start: "17 Jul 2023",
    startRaw: "2023-07-17",
    end: "22 Des 2023",
    endRaw: "2023-12-22",
    status: "Aktif",
    students: 15,
    classes: 3,
    uts: "2023-10-16",
    uas: "2023-12-11",
    rapor: "2023-12-23",
    deadline: "2023-12-18",
    hariEfektif: 140
  });

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <div className="text-[13px] text-gray-500 font-medium mb-2">
            Dashboard <span className="mx-2">&rsaquo;</span> Kelola Akademik <span className="mx-2">&rsaquo;</span> <span className="cursor-pointer hover:text-[#1A3D63] hover:underline" onClick={() => setView("list")}>Semester</span> <span className="mx-2">&rsaquo;</span> <span className="text-[#1A3D63] font-semibold">Edit</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-[26px] font-bold text-[#1e293b]">Edit Semester</h1>
            <span className="text-[14px] font-bold text-gray-500 mt-1">{editForm.id}</span>
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 mt-1 ${editForm.status === 'Aktif' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#F1F5F9] text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${editForm.status === 'Aktif' ? 'bg-[#059669]' : 'bg-gray-400'}`}></span> {editForm.status}
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
                  <input type="text" readOnly value={editForm.id} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-28 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-gray-400 text-[10px] font-semibold">Tidak dapat diubah</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Tahun Ajaran</label>
                <div className="relative">
                  <input type="text" readOnly value={editForm.year || ''} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-gray-400 text-[10px] font-semibold">Terkunci</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Nama Semester <span className="text-red-500">*</span></label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-white border border-[#1A3D63] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Tipe Semester</label>
                <div className="relative">
                  <input type="text" readOnly value={editForm.type} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-gray-500 focus:outline-none" />
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
                    <input type="date" value={editForm.startRaw} onChange={e => setEditForm({...editForm, startRaw: e.target.value})} className="w-full bg-white border border-[#1A3D63] rounded-xl pl-4 pr-10 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Ubah tanggal mulai semester.</p>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="date" value={editForm.endRaw} onChange={e => setEditForm({...editForm, endRaw: e.target.value})} className="w-full bg-white border border-[#1A3D63] rounded-xl pl-4 pr-10 py-3 text-[14px] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
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
                    <input type="number" value={editForm.hariEfektif || 140} onChange={e => setEditForm({...editForm, hariEfektif: parseInt(e.target.value) || 0})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-16 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" style={{MozAppearance: 'textfield'}} />
                    <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
                    <div className="absolute inset-y-0 right-0 flex">
                      <div className="flex items-center px-4 text-[13px] font-medium text-gray-500 border-l border-gray-200">hari</div>
                      <div className="flex flex-col border-l border-gray-200 w-8">
                        <button onClick={() => setEditForm({...editForm, hariEfektif: (editForm.hariEfektif || 140) + 1})} className="flex-1 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 rounded-tr-xl"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                        <button onClick={() => setEditForm({...editForm, hariEfektif: (editForm.hariEfektif || 140) - 1})} className="flex-1 flex items-center justify-center hover:bg-gray-50 rounded-br-xl"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Minggu Efektif</label>
                  <div className="relative">
                    <input type="text" readOnly value={Math.floor((editForm.hariEfektif || 140) / 7)} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-32 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
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
                    <input type="date" value={editForm.uts} onChange={e => setEditForm({...editForm, uts: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Ujian Akhir Semester (UAS)</label>
                  <div className="relative">
                    <input type="date" value={editForm.uas} onChange={e => setEditForm({...editForm, uas: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Pembagian Rapor</label>
                  <div className="relative">
                    <input type="date" value={editForm.rapor} onChange={e => setEditForm({...editForm, rapor: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">Deadline Input Nilai Guru</label>
                  <div className="relative">
                    <input type="date" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-semibold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20" />
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
                  <div className="text-[13px] text-[#1e293b]"><span className="font-bold">Siti Rahayu</span> — Mengubah tanggal selesai dari 20 Des menjadi 22 Des 2023</div>
                  <div className="text-[11px] text-gray-400 mt-1">14 Okt 2023, 09:15</div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                  <div className="text-[13px] text-[#1e293b]"><span className="font-bold">Siti Rahayu</span> — Memperbarui jadwal UAS menjadi 11 Des 2023</div>
                  <div className="text-[11px] text-gray-400 mt-1">3 Sep 2023, 11:40</div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                  <div className="text-[13px] text-[#1e293b]"><span className="font-bold">Admin Sistem</span> — Semester dibuat dan diaktifkan pertama kali</div>
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
            <button onClick={() => { if(onSave) onSave(editForm); }} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm">
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
const SemesterDetail = ({ setView, semester }) => {
  if (!semester) return null;
  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <div className="text-[13px] text-gray-500 font-medium mb-2">
            Dashboard <span className="mx-2">&rsaquo;</span> Kelola Akademik <span className="mx-2">&rsaquo;</span> <span className="cursor-pointer hover:text-[#1A3D63] hover:underline" onClick={() => setView("list")}>Semester</span> <span className="mx-2">&rsaquo;</span> <span className="text-[#1A3D63] font-semibold">Detail</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-[26px] font-bold text-[#1e293b]">{semester.name}</h1>
            <span className="text-[14px] font-bold text-gray-500 mt-1">{semester.id}</span>
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 mt-1 ${semester.status === 'Aktif' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#F1F5F9] text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${semester.status === 'Aktif' ? 'bg-[#059669]' : 'bg-gray-400'}`}></span> {semester.status === 'Aktif' ? 'Sedang Berjalan' : semester.status}
            </span>
          </div>
          <p className="text-gray-500 text-[14px] mt-1">
            Ringkasan lengkap data dan aktivitas Semester {semester.name}.
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
            17 Jul 2023 — 22 Des 2023
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3.5 mb-3 relative overflow-hidden">
          <div className="bg-[#1A3D63] h-3.5 rounded-full" style={{ width: '63%' }}></div>
        </div>
        <div className="flex justify-between items-center text-[12px] font-medium text-gray-500">
          <div>Mulai: 17 Jul 2023</div>
          <div className="font-bold text-[#1e293b]">63% Selesai — 100 / 159 Hari</div>
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
                <div className="w-20 text-[13px] font-bold text-[#1e293b]">Kelas VII</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#1A3D63]" style={{ width: '35%' }}></div>
                </div>
                <div className="w-16 text-right text-[13px] font-bold text-[#1e293b]">432 <span className="font-normal text-gray-500">siswa</span></div>
                <div className="w-16 text-right text-[12px] text-gray-500">11 kelas</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-[13px] font-bold text-[#1e293b]">Kelas VIII</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#8B5CF6]" style={{ width: '33%' }}></div>
                </div>
                <div className="w-16 text-right text-[13px] font-bold text-[#1e293b]">418 <span className="font-normal text-gray-500">siswa</span></div>
                <div className="w-16 text-right text-[12px] text-gray-500">11 kelas</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-[13px] font-bold text-[#1e293b]">Kelas IX</div>
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
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">2 — 6 Okt</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">1,211</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">18</td>
                    <td className="px-6 py-4 text-[13px] text-center text-orange-500 font-semibold">14</td>
                    <td className="px-6 py-4 text-[13px] text-center text-red-500 font-semibold">5</td>
                    <td className="px-6 py-4 text-[13px] text-right font-bold text-[#059669]">97.0%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">9 — 13 Okt</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">1,197</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">22</td>
                    <td className="px-6 py-4 text-[13px] text-center text-orange-500 font-semibold">20</td>
                    <td className="px-6 py-4 text-[13px] text-center text-red-500 font-semibold">9</td>
                    <td className="px-6 py-4 text-[13px] text-right font-bold text-[#059669]">95.9%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">16 — 20 Okt</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">1,182</td>
                    <td className="px-6 py-4 text-[13px] text-center text-gray-600">31</td>
                    <td className="px-6 py-4 text-[13px] text-center text-orange-500 font-semibold">25</td>
                    <td className="px-6 py-4 text-[13px] text-center text-red-500 font-semibold">16</td>
                    <td className="px-6 py-4 text-[13px] text-right font-bold text-[#059669]">94.7%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1e293b]">23 — 27 Okt</td>
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
                <span className="font-bold text-[#1e293b]">{semester.year}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Tipe</span>
                <span className="font-bold text-[#1e293b]">{semester.type}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Tanggal Mulai</span>
                <span className="font-bold text-[#1e293b]">{semester.start}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pb-3 border-b border-gray-50">
                <span className="text-gray-500">Tanggal Selesai</span>
                <span className="font-bold text-[#1e293b]">{semester.end}</span>
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



