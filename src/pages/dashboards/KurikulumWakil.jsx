import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const emptyForm = { kodeKurikulum: "", namaKurikulum: "", tahunAjaranId: "", deskripsi: "", status: "Aktif" };

const KurikulumWakil = () => {
  const [data, setData] = useState([]);
  const [tahunAjarans, setTahunAjarans] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resKurikulum, resTA] = await Promise.all([
        api.get('/kurikulum'),
        api.get('/tahun-ajaran')
      ]);
      setData(resKurikulum.data.data);
      setTahunAjarans(resTA.data.data);
    } catch (error) {
      console.error(error);
      showToast("Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.kodeKurikulum?.trim()) e.kodeKurikulum = "Kode Kurikulum wajib diisi";
    if (!form.namaKurikulum?.trim()) e.namaKurikulum = "Nama Kurikulum wajib diisi";
    if (!form.tahunAjaranId) e.tahunAjaranId = "Tahun ajaran wajib dipilih";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = {
        kode_kurikulum: form.kodeKurikulum,
        nama_kurikulum: form.namaKurikulum,
        tahun_ajaran_id: form.tahunAjaranId,
        deskripsi: form.deskripsi,
        status: form.status
      };
      if (editId) {
        await api.put(`/kurikulum/${editId}`, payload);
        showToast("Kurikulum berhasil diperbarui!");
      } else {
        await api.post('/kurikulum', payload);
        showToast("Kurikulum berhasil ditambahkan!");
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      setErrors({});
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  const handleEdit = (item) => {
    setForm({ 
      kodeKurikulum: item.kode_kurikulum || "", 
      namaKurikulum: item.nama_kurikulum || "", 
      tahunAjaranId: item.tahun_ajaran_id || "", 
      deskripsi: item.deskripsi || "", 
      status: item.status || "Aktif" 
    });
    setEditId(item.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/kurikulum/${id}`);
      setDeleteConfirm(null);
      showToast("Kurikulum berhasil dihapus!");
      fetchData();
    } catch (err) {
      setDeleteConfirm(null);
      showToast(err.response?.data?.message || "Gagal menghapus", "error");
    }
  };

  const filtered = data.filter(d => {
    const s = (d.nama_kurikulum || '').toLowerCase().includes(search.toLowerCase()) || (d.kode_kurikulum || '').toLowerCase().includes(search.toLowerCase());
    const f = filterStatus === "Semua" || d.status === filterStatus;
    return s && f;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-white text-[13px] font-bold flex items-center gap-2 animate-fadeIn ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          {toast.msg}
        </div>
      )}

      <div className="text-[13px] text-gray-400">Dashboard &gt; <span className="text-[#2A4365] font-semibold">Kelola Kurikulum</span></div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Kelola Kurikulum</h1>
          <p className="text-[14px] text-gray-500 mt-1">Manajemen kurikulum akademik (Master Data)</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setErrors({}); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl text-[13px] font-bold shadow-sm transition-colors"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Tambah Kurikulum
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex gap-2">
          {["Semua", "Aktif", "Draft", "Arsip"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${filterStatus === f ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f}</button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Cari kurikulum..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-4 py-2 w-full text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                {["NO", "KODE KURIKULUM", "NAMA KURIKULUM", "TAHUN AJARAN", "STATUS", "AKSI"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-[13px]">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-[13px]">Tidak ada data kurikulum ditemukan.</td></tr>
              ) : filtered.map((item, i) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 text-[13px] text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-gray-800">{item.kode_kurikulum}</td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-bold text-gray-800">{item.nama_kurikulum}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 max-w-[250px] whitespace-normal">{item.deskripsi}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-600">{item.tahun_ajaran_nama || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === "Aktif" ? "bg-green-50 text-green-600 border border-green-100" : item.status === "Draft" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(item)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#1A3D63] rounded-lg text-[11px] font-bold hover:bg-blue-100 transition-colors">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(item)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[560px] shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#1e293b]">{editId ? "Edit Kurikulum" : "Tambah Kurikulum Baru"}</h3>
              <button onClick={() => { setShowForm(false); setErrors({}); }} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Kode Kurikulum *</label>
                  <input value={form.kodeKurikulum} onChange={e => setForm({ ...form, kodeKurikulum: e.target.value })} placeholder="cth: KUR-MERDEKA" className={`w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 ${errors.kodeKurikulum ? "border-red-300 bg-red-50" : "border-gray-200"}`}/>
                  {errors.kodeKurikulum && <p className="text-[11px] text-red-500 mt-1">{errors.kodeKurikulum}</p>}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Tahun Ajaran *</label>
                  <select value={form.tahunAjaranId} onChange={e => setForm({ ...form, tahunAjaranId: e.target.value })} className={`w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 ${errors.tahunAjaranId ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                    <option value="" disabled>Pilih Tahun Ajaran</option>
                    {tahunAjarans.map(t => <option key={t.id} value={t.id}>{t.nama}</option>)}
                  </select>
                  {errors.tahunAjaranId && <p className="text-[11px] text-red-500 mt-1">{errors.tahunAjaranId}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Nama Kurikulum *</label>
                  <input value={form.namaKurikulum} onChange={e => setForm({ ...form, namaKurikulum: e.target.value })} placeholder="cth: Kurikulum Merdeka 2025" className={`w-full px-3.5 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 ${errors.namaKurikulum ? "border-red-300 bg-red-50" : "border-gray-200"}`}/>
                  {errors.namaKurikulum && <p className="text-[11px] text-red-500 mt-1">{errors.namaKurikulum}</p>}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Status</label>
                <div className="flex gap-3">
                  {["Draft", "Aktif", "Arsip"].map(s => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className={`flex-1 py-2.5 rounded-xl text-[12px] font-semibold border transition-colors ${form.status === s ? "bg-[#1A3D63] text-white border-[#1A3D63]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3} placeholder="Deskripsi kurikulum..." className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"/>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setErrors({}); }} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl font-bold transition-colors">
                  {editId ? "Simpan Perubahan" : "Tambah Kurikulum"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </div>
            <div className="text-center">
              <h3 className="text-[17px] font-bold text-gray-800">Hapus Kurikulum?</h3>
              <p className="text-[13px] text-gray-500 mt-1"><strong>{deleteConfirm.nama_kurikulum}</strong> akan dihapus permanen.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KurikulumWakil;
