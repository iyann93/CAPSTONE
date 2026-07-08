import re

with open('src/pages/dashboards/PengumumanSekolah.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add handleSaveNewAnn
handle_save_code = '''  const handleSaveNewAnn = () => {
    if(!newAnn.title || !newAnn.desc) {
      alert("Judul dan Deskripsi wajib diisi!");
      return;
    }
    const newId = mockAnnouncements.length > 0 ? Math.max(...mockAnnouncements.map(a => a.id)) + 1 : 1;
    const finalAnn = {
      ...newAnn,
      id: newId,
      date: new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}),
      author: user?.name || "Admin Tata Usaha"
    };
    mockAnnouncements.unshift(finalAnn);
    setIsAdding(false);
    setNewAnn({ title: "", date: "", author: "", category: "Akademik", importance: "Normal", desc: "", attachment: "" });
    setSelectedAnnouncement(finalAnn);
    alert("Pengumuman berhasil diterbitkan!");
  };

  const filtered = mockAnnouncements.filter(ann => {'''
content = content.replace('  const filtered = mockAnnouncements.filter(ann => {', handle_save_code)

# 2. Add Add Button
old_header = '''      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Pengumuman Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">Informasi resmi terupdate dari pihak sekolah</p>
        </div>
      </div>'''

new_header = '''      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Pengumuman Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">Informasi resmi terupdate dari pihak sekolah</p>
        </div>
        {(!user?.anak) && (
          <button onClick={() => setIsAdding(true)} className="bg-[#1A3D63] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#122A44] transition-colors flex items-center gap-2 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Buat Pengumuman Baru
          </button>
        )}
      </div>'''
content = content.replace(old_header, new_header)

# 3. Add Modal
modal_code = '''      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-xl flex flex-col overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#1F3A5F] text-white">
              <h3 className="text-[16px] font-bold">Buat Pengumuman Baru</h3>
              <button onClick={() => setIsAdding(false)} className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Judul Pengumuman</label>
                <input type="text" value={newAnn.title} onChange={e => setNewAnn({...newAnn, title: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3D63]" placeholder="Contoh: Jadwal Ujian Tengah Semester..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Kategori</label>
                  <select value={newAnn.category} onChange={e => setNewAnn({...newAnn, category: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3D63]">
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Penerimaan">Penerimaan</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Tingkat Kepentingan</label>
                  <select value={newAnn.importance} onChange={e => setNewAnn({...newAnn, importance: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3D63]">
                    <option value="Normal">Normal</option>
                    <option value="Penting">Penting</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Deskripsi Lengkap</label>
                <textarea value={newAnn.desc} onChange={e => setNewAnn({...newAnn, desc: e.target.value})} rows="5" className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3D63]" placeholder="Tuliskan detail pengumuman di sini..."></textarea>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Nama File Lampiran (Opsional)</label>
                <input type="text" value={newAnn.attachment} onChange={e => setNewAnn({...newAnn, attachment: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3D63]" placeholder="Contoh: Jadwal_UTS.pdf" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={handleSaveNewAnn} className="px-5 py-2 bg-[#1A3D63] text-white rounded-lg text-[13px] font-bold hover:bg-[#122A44] transition-colors">Terbitkan Pengumuman</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}'''
content = content.replace('      {/* Main Layout */}', modal_code)

with open('src/pages/dashboards/PengumumanSekolah.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching completed.")
