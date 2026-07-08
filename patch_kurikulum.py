import re

with open('src/pages/dashboards/KurikulumWakil.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update initData and emptyForm
initData_old = '''const initData = [
  { id: 1, namaKurikulum: "Kurikulum Merdeka", mapel: "Matematika", kelas: "IX IPA", tingkat: "SMP", tahunAjaran: "2025/2026", deskripsi: "Kurikulum yang diterapkan untuk siswa kelas IX IPA pada tahun ajaran 2025/2026 berdasarkan Kurikulum Merdeka.", status: "Aktif" },
  { id: 2, namaKurikulum: "Kurikulum Merdeka", mapel: "Fisika", kelas: "VIII IPA", tingkat: "SMP", tahunAjaran: "2025/2026", deskripsi: "Fisika modern dan mekanika kuantum", status: "Aktif" },
  { id: 3, namaKurikulum: "Kurikulum Merdeka", mapel: "Biologi", kelas: "VII IPA", tingkat: "SMP", tahunAjaran: "2025/2026", deskripsi: "Pengantar biologi sel dan genetika", status: "Aktif" },
  { id: 4, namaKurikulum: "Kurikulum 2013", mapel: "Sejarah Indonesia", kelas: "VII IPS", tingkat: "SMP", tahunAjaran: "2025/2026", deskripsi: "Sejarah nasional abad ke-20", status: "Revisi" },
  { id: 5, namaKurikulum: "Kurikulum Merdeka", mapel: "Bahasa Inggris", kelas: "VII IPA", tingkat: "SMP", tahunAjaran: "2025/2026", deskripsi: "Grammar, speaking, dan writing", status: "Aktif" },
  { id: 6, namaKurikulum: "Kurikulum 2013", mapel: "Kimia", kelas: "VIII IPA", tingkat: "SMP", tahunAjaran: "2025/2026", deskripsi: "Kimia organik dan reaksi", status: "Aktif" },
];

const emptyForm = { namaKurikulum: "", mapel: "", kelas: "", tingkat: "SMP", tahunAjaran: "2025/2026", deskripsi: "", status: "Aktif" };'''

initData_new = '''const initData = [
  { id: 1, namaKurikulum: "Kurikulum Merdeka", tahunAjaran: "2025/2026", deskripsi: "Kurikulum yang diterapkan untuk siswa pada tahun ajaran 2025/2026 berdasarkan Kurikulum Merdeka.", status: "Menunggu Persetujuan" },
  { id: 2, namaKurikulum: "Kurikulum 2013 Revisi", tahunAjaran: "2024/2025", deskripsi: "Penyelarasan standar kompetensi lulusan.", status: "Disetujui" },
];

const emptyForm = { namaKurikulum: "", tahunAjaran: "2025/2026", deskripsi: "", status: "Menunggu Persetujuan" };'''
content = content.replace(initData_old, initData_new)

# 2. Update validate
val_old = '''  const validate = () => {
    const e = {};
    if (!form.namaKurikulum?.trim()) e.namaKurikulum = "Nama Kurikulum wajib diisi";
    if (!form.mapel.trim()) e.mapel = "Mata pelajaran wajib diisi";
    if (!form.kelas.trim()) e.kelas = "Kelas wajib diisi";
    if (!form.tahunAjaran.trim()) e.tahunAjaran = "Tahun ajaran wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };'''
val_new = '''  const validate = () => {
    const e = {};
    if (!form.namaKurikulum?.trim()) e.namaKurikulum = "Nama Kurikulum wajib diisi";
    if (!form.tahunAjaran.trim()) e.tahunAjaran = "Tahun ajaran wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };'''
content = content.replace(val_old, val_new)

# 3. Update handleEdit
edit_old = '''  const handleEdit = (item) => {
    setForm({ namaKurikulum: item.namaKurikulum || "", mapel: item.mapel, kelas: item.kelas, tingkat: item.tingkat, tahunAjaran: item.tahunAjaran, deskripsi: item.deskripsi, status: item.status });
    setEditId(item.id);'''
edit_new = '''  const handleEdit = (item) => {
    setForm({ namaKurikulum: item.namaKurikulum || "", tahunAjaran: item.tahunAjaran, deskripsi: item.deskripsi, status: item.status });
    setEditId(item.id);'''
content = content.replace(edit_old, edit_new)

# 4. Update filter
filtered_old = '''  const filtered = data.filter(d => {
    const s = d.mapel.toLowerCase().includes(search.toLowerCase()) || d.kelas.toLowerCase().includes(search.toLowerCase());
    const f = filterStatus === "Semua" || d.status === filterStatus;
    return s && f;
  });'''
filtered_new = '''  const filtered = data.filter(d => {
    const s = d.namaKurikulum.toLowerCase().includes(search.toLowerCase()) || d.tahunAjaran.toLowerCase().includes(search.toLowerCase());
    const f = filterStatus === "Semua" || d.status === filterStatus;
    return s && f;
  });'''
content = content.replace(filtered_old, filtered_new)

# 5. Filter status pills
pills_old = '''          {["Semua", "Aktif", "Revisi"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} className={px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors }>{f}</button>
          ))}'''
pills_new = '''          {["Semua", "Menunggu Persetujuan", "Disetujui", "Ditolak"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} className={px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors }>{f}</button>
          ))}'''
content = content.replace(pills_old, pills_new)

# 6. Table Headers
th_old = '''{["NO", "NAMA KURIKULUM", "MATA PELAJARAN", "KELAS", "TINGKAT", "TAHUN AJARAN", "STATUS", "AKSI"].map(h => ('''
th_new = '''{["NO", "NAMA KURIKULUM", "TAHUN AJARAN", "DESKRIPSI", "STATUS", "AKSI"].map(h => ('''
content = content.replace(th_old, th_new)

# 7. Table Rows
td_old = '''                  <td className="px-5 py-4 text-[13px] text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-gray-800">{item.namaKurikulum}</td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-bold text-gray-800">{item.mapel}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 max-w-[250px] whitespace-normal">{item.deskripsi}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-600">{item.kelas}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-500">{item.tingkat}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-gray-700">{item.tahunAjaran}</td>
                  <td className="px-5 py-4">
                    <span className={px-2.5 py-1 rounded-md text-[11px] font-bold }>{item.status}</span>
                  </td>'''
td_new = '''                  <td className="px-5 py-4 text-[13px] text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-gray-800">{item.namaKurikulum}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-gray-700">{item.tahunAjaran}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-600 max-w-[300px] whitespace-normal">{item.deskripsi}</td>
                  <td className="px-5 py-4">
                    <span className={px-2.5 py-1 rounded-md text-[11px] font-bold }>{item.status}</span>
                  </td>'''
content = content.replace(td_old, td_new)

# 8. Form modal
form_old = '''              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Nama Kurikulum *</label>
                  <input value={form.namaKurikulum || ""} onChange={e => setForm({ ...form, namaKurikulum: e.target.value })} placeholder="cth: kurikulum merdeka" className={w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 }/>
                  {errors.namaKurikulum && <p className="text-[11px] text-red-500 mt-1">{errors.namaKurikulum}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Mata Pelajaran *</label>
                  <input value={form.mapel} onChange={e => setForm({ ...form, mapel: e.target.value })} placeholder="cth: Matematika" className={w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 }/>
                  {errors.mapel && <p className="text-[11px] text-red-500 mt-1">{errors.mapel}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Kelas *</label>
                  <input value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} placeholder="cth: VII" className={w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 }/>
                  {errors.kelas && <p className="text-[11px] text-red-500 mt-1">{errors.kelas}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Tingkat</label>
                  <select value={form.tingkat} onChange={e => setForm({ ...form, tingkat: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                    {["SMP", "SMA", "SMK"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Tahun Ajaran *</label>
                  <input value={form.tahunAjaran} onChange={e => setForm({ ...form, tahunAjaran: e.target.value })} placeholder="cth: 2025/2026" className={w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 }/>
                  {errors.tahunAjaran && <p className="text-[11px] text-red-500 mt-1">{errors.tahunAjaran}</p>}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Status</label>
                <div className="flex gap-3">
                  {["Aktif", "Revisi", "Nonaktif"].map(s => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className={lex-1 py-2.5 rounded-xl text-[12px] font-semibold border transition-colors }>{s}</button>
                  ))}
                </div>
              </div>'''
form_new = '''              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Nama Kurikulum *</label>
                  <input value={form.namaKurikulum || ""} onChange={e => setForm({ ...form, namaKurikulum: e.target.value })} placeholder="cth: Kurikulum Merdeka" className={w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 }/>
                  {errors.namaKurikulum && <p className="text-[11px] text-red-500 mt-1">{errors.namaKurikulum}</p>}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Tahun Ajaran *</label>
                  <input value={form.tahunAjaran} onChange={e => setForm({ ...form, tahunAjaran: e.target.value })} placeholder="cth: 2025/2026" className={w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 }/>
                  {errors.tahunAjaran && <p className="text-[11px] text-red-500 mt-1">{errors.tahunAjaran}</p>}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Status</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {["Menunggu Persetujuan", "Disetujui", "Ditolak"].map(s => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className={lex-1 py-2.5 px-3 rounded-xl text-[12px] font-semibold border transition-colors }>{s}</button>
                  ))}
                </div>
              </div>'''
content = content.replace(form_old, form_new)

# 9. Delete Confirm Message
del_old = '''<p className="text-[13px] text-gray-500 mt-1"><strong>{deleteConfirm.mapel}</strong> ?" {deleteConfirm.kelas} akan dihapus permanen.</p>'''
del_new = '''<p className="text-[13px] text-gray-500 mt-1"><strong>{deleteConfirm.namaKurikulum}</strong> akan dihapus permanen.</p>'''
content = content.replace(del_old, del_new)

with open('src/pages/dashboards/KurikulumWakil.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched KurikulumWakil.jsx")
