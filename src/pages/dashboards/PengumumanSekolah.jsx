import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getTagihan } from "../../api/finance";
import { uploadAnnouncementFile } from "../../api/system";
import { getAnnouncements, addAnnouncement, deleteAnnouncement, toggleAnnouncementStatus, editAnnouncement } from "../../utils/announcementStore";

const BULAN_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const EMPTY_FORM = {
  title: "",
  date: "",
  author: "",
  category: "Akademik",
  importance: "Normal",
  desc: "",
  attachment: "",
  attachmentData: ""
};

const PengumumanSekolah = ({ user, onNavigate }) => {
  const [tab, setTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [tunggakanList, setTunggakanList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAdminTU = user?.role === 'admin_tu' || user?.role === 'Admin TU';

  // Load announcements from store
  useEffect(() => {
    setAnnouncements(getAnnouncements());
  }, []);

  useEffect(() => {
    if (!user) return;
    getTagihan({ limit: 5000 })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const anakId = user?.anak?.id;
        const anakNis = user?.anak?.nis;
        const anakNisn = user?.anak?.nisn;
        const anakNama = user?.anak?.nama;

        const myTagihans = arr.filter(t => 
           (anakId && t.id_siswa === anakId) ||
           (anakNis && t.nis === anakNis) ||
           (anakNama && (t.nama_siswa === anakNama || t.nama === anakNama)) ||
           (anakNisn && t.nisn === anakNisn)
        );
        setTunggakanList(myTagihans.filter(t => t.status === "belum_bayar" || t.status === "menunggu_konfirmasi"));
      })
      .catch(() => setTunggakanList([]));
  }, [user]);

  const filtered = announcements.filter(ann => {
    const tabOk = tab === "Semua" || ann.category === tab;
    const searchOk = ann.title.toLowerCase().includes(search.toLowerCase()) || 
                     ann.desc.toLowerCase().includes(search.toLowerCase());
    return tabOk && searchOk;
  });

  const tagihanAnnouncements = tunggakanList.map((t, idx) => {
    const bulanNama = BULAN_NAMES[(t.bulan ?? 1) - 1] || "-";
    const nominalValue = t.nominal_akhir || t.nominal;
    const nominal = nominalValue ? `Rp ${Number(nominalValue).toLocaleString('id-ID')}` : "-";
    const jatuhTempo = t.jatuh_tempo ? new Date(t.jatuh_tempo).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : "-";
    const isOverdue = t.jatuh_tempo && new Date(t.jatuh_tempo) < new Date();
    
    return {
      id: `tagihan-${t.id || idx}`,
      title: `Tagihan SPP — ${bulanNama} ${t.tahun ?? ""}`,
      date: jatuhTempo,
      author: "Bendahara Sekolah",
      category: "Tagihan SPP",
      importance: "Penting",
      desc: `Terdapat tagihan SPP bulan ${bulanNama} sebesar ${nominal} yang belum dilunasi. Jatuh tempo pada tanggal ${jatuhTempo}.${isOverdue ? ' Status saat ini telah melewati batas jatuh tempo.' : ''}`,
      isTagihan: true
    };
  });

  const combinedList = [...tagihanAnnouncements, ...filtered].filter(ann => {
    if (tab !== "Semua" && ann.category !== tab) return false;
    return true;
  });

  // Form handlers
  const handleFormChange = async (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          setFormError("File lampiran harus berformat PDF.");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setFormError("Ukuran file maksimal 5MB.");
          return;
        }
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await uploadAnnouncementFile(formData);
          setForm(prev => ({ ...prev, attachment: file.name, attachmentData: response.url }));
          setFormError("");
        } catch (error) {
          setFormError("Gagal mengunggah file ke server.");
        }
      } else {
        setForm(prev => ({ ...prev, attachment: "", attachmentData: "" }));
      }
    } else {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
      setFormError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title?.trim()) { setFormError("Judul pengumuman wajib diisi."); return; }
    if (!form.desc?.trim()) { setFormError("Isi pengumuman wajib diisi."); return; }
    const authorName = (form.author || "").trim() || (user?.nama || user?.name || user?.fullName || "Admin TU");
    
    let updated;
    if (form.id) {
      updated = editAnnouncement(form.id, { ...form, author: authorName });
    } else {
      updated = addAnnouncement({ ...form, author: authorName });
    }
    
    setAnnouncements(updated);
    if (form.id && selectedAnnouncement?.id === form.id) {
      setSelectedAnnouncement(updated.find(a => a.id === form.id));
    }
    
    setShowForm(false);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleDelete = (id) => {
    const updated = deleteAnnouncement(id);
    setAnnouncements(updated);
    if (selectedAnnouncement?.id === id) setSelectedAnnouncement(null);
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (id) => {
    const updated = toggleAnnouncementStatus(id);
    setAnnouncements(updated);
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement(updated.find(a => a.id === id));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Pengumuman Sekolah</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Pengumuman Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">Informasi resmi terupdate dari pihak sekolah</p>
        </div>
        {isAdminTU && (
          <button
            onClick={() => { setShowForm(true); setSelectedAnnouncement(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white text-[13px] font-bold rounded-xl shadow-sm transition-all"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Tambah Pengumuman
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-6">
        {/* Left Side: List of Announcements */}
        <div className={`lg:col-span-2 space-y-4 ${(showForm || selectedAnnouncement) ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {["Semua", "Akademik", "Kegiatan", "Penerimaan", "Tagihan SPP"].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                    tab === t ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-full md:w-52"
              />
            </div>
          </div>

          <div className="space-y-4">
            {combinedList.map(ann => (
              <div
                key={ann.id}
                onClick={() => { setSelectedAnnouncement(ann); setShowForm(false); }}
                className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md cursor-pointer transition-all ${
                  selectedAnnouncement?.id === ann.id ? "border-[#1A3D63] bg-blue-50/10" : "border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-2 flex-wrap">
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      ann.importance === "Penting" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {ann.importance}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500">
                      {ann.category}
                    </span>
                    {ann.isActive === false && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 line-through">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400">{ann.date}</span>
                    {isAdminTU && !ann.isTagihan && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); handleToggleStatus(ann.id); }}
                          title={ann.isActive === false ? "Aktifkan pengumuman" : "Nonaktifkan pengumuman"}
                          className={`p-1.5 rounded-lg transition-colors ${ann.isActive === false ? 'hover:bg-green-50 text-gray-400 hover:text-green-500' : 'hover:bg-amber-50 text-gray-400 hover:text-amber-500'}`}
                        >
                          {ann.isActive === false ? (
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setForm(ann); setShowForm(true); setSelectedAnnouncement(null); }}
                          title="Edit pengumuman"
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteConfirm(ann); }}
                          title="Hapus pengumuman"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-[15.5px] font-bold text-gray-800 hover:text-[#1A3D63] transition-colors">{ann.title}</h3>
                <p className="text-[13px] text-gray-500 line-clamp-2 mt-2 leading-relaxed">{ann.desc}</p>
                <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <span className="text-[11.5px] text-gray-400">Oleh: {ann.author}</span>
                  {!ann.isTagihan && (
                    <span className="text-[12px] font-bold text-[#1A3D63] hover:underline flex items-center gap-1 cursor-pointer">
                      Baca Selengkapnya
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
            {combinedList.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
                Belum ada pengumuman untuk pencarian ini.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detail or Add Form */}
        <div className={`space-y-4 ${(showForm || selectedAnnouncement) ? 'block' : 'hidden lg:block'}`}>
          {/* Form Tambah Pengumuman (Admin TU) */}
          {showForm && isAdminTU ? (
            <div className="bg-white rounded-2xl border border-[#1A3D63] shadow-sm p-6 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="text-[14px] font-bold text-[#1A3D63]">{form.id ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}</h3>
                <button onClick={() => { setShowForm(false); setFormError(""); setForm(EMPTY_FORM); }} className="text-gray-400 hover:text-gray-600">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Judul Pengumuman *</label>
                  <input
                    name="title"
                    value={form.title || ""}
                    onChange={handleFormChange}
                    placeholder="Masukkan judul pengumuman..."
                    className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option>Akademik</option>
                      <option>Kegiatan</option>
                      <option>Penerimaan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tingkat</label>
                    <select
                      name="importance"
                      value={form.importance}
                      onChange={handleFormChange}
                      className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option>Normal</option>
                      <option>Penting</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tanggal</label>
                    <input
                      name="date"
                      value={form.date || ""}
                      onChange={handleFormChange}
                      placeholder="Misal: 20 Jun 2026"
                      className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pembuat</label>
                    <input
                      name="author"
                      value={form.author || ""}
                      onChange={handleFormChange}
                      placeholder={user?.nama || user?.name || user?.fullName || "Nama pembuat..."}
                      className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Isi Pengumuman *</label>
                  <textarea
                    name="desc"
                    value={form.desc || ""}
                    onChange={handleFormChange}
                    rows={5}
                    placeholder="Tulis isi pengumuman secara lengkap..."
                    className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Lampiran File (Hanya PDF, Max 5MB)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    name="attachmentFile"
                    onChange={handleFormChange}
                    className="w-full text-[12px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-blue-50 file:text-[#1A3D63] hover:file:bg-blue-100"
                  />
                  {form.attachment && (
                    <p className="text-[11px] text-gray-400 mt-1">File saat ini: {form.attachment}</p>
                  )}
                </div>

                 
                {formError && (
                  <p className="text-[12px] text-red-500 font-semibold flex items-center gap-1">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {formError}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white text-[13px] font-bold rounded-xl transition-colors"
                  >
                    Publikasikan
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(""); }}
                    className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-bold rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          ) : selectedAnnouncement ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 sticky top-6 animate-fadeIn">
              <div className="flex flex-wrap justify-between items-center pb-2 border-b border-gray-50">
                <h3 className="text-[14px] font-bold text-gray-700">Detail Pengumuman</h3>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    selectedAnnouncement.importance === "Penting" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                    {selectedAnnouncement.importance}
                  </span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold">
                    {selectedAnnouncement.category}
                  </span>
                </div>
                <h2 className="text-[18px] font-bold text-gray-800 leading-tight">{selectedAnnouncement.title}</h2>
                <div className="text-[12px] text-gray-400 space-y-0.5">
                  <p>Tanggal: {selectedAnnouncement.date}</p>
                  <p>Pembuat: {selectedAnnouncement.author}</p>
                </div>
                <p className="text-[13.5px] text-gray-600 leading-relaxed pt-2 whitespace-pre-line">{selectedAnnouncement.desc}</p>
                
                {selectedAnnouncement.attachment && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1A3D63" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      <span className="text-[12px] font-bold text-[#1A3D63]">{selectedAnnouncement.attachment}</span>
                    </div>
                    {selectedAnnouncement.attachmentData ? (
                      <a 
                        href={selectedAnnouncement.attachmentData}
                        download={selectedAnnouncement.attachment}
                        className="text-[11px] font-bold bg-white text-[#1A3D63] px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        Unduh
                      </a>
                    ) : (
                      <button 
                        onClick={() => alert(`Mengunduh file: ${selectedAnnouncement.attachment}`)}
                        className="text-[11px] font-bold bg-white text-[#1A3D63] px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        Unduh
                      </button>
                    )}
                  </div>
                )}
                                
                {selectedAnnouncement.isTagihan && onNavigate && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => onNavigate("Tagihan SPP")}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                      Buka Menu Tagihan SPP
                    </button>
                  </div>
                )}

                {isAdminTU && !selectedAnnouncement.isTagihan && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setDeleteConfirm(selectedAnnouncement)}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                      Hapus Pengumuman Ini
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-400 h-60 flex flex-col justify-center items-center">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p className="text-[13px]">Pilih pengumuman di sebelah kiri untuk melihat detail isi.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth="2.5">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-800">Hapus Pengumuman?</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[13px] font-semibold text-gray-700 line-clamp-2">{deleteConfirm.title}</p>
              <p className="text-[11px] text-gray-400 mt-1">Oleh: {deleteConfirm.author} · {deleteConfirm.date}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold rounded-xl transition-colors"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengumumanSekolah;
