import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const KELOMPOK_COLORS = {
  "Wajib":         "bg-slate-100 text-slate-700",
  "IPA":           "bg-blue-50 text-blue-700",
  "IPS":           "bg-orange-50 text-orange-700",
  "Muatan Lokal":  "bg-purple-50 text-purple-700",
  "Lintas Minat":  "bg-green-50 text-green-700",
};

const KELOMPOK_LIST = ["Wajib", "IPA", "IPS", "Muatan Lokal", "Lintas Minat"];
const TINGKAT_LIST  = ["VII", "VIII", "IX"];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <tbody>
    {[...Array(6)].map((_, i) => (
      <tr key={i} className="border-b border-gray-50">
        {[...Array(7)].map((__, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

// ─── Modal Form ───────────────────────────────────────────────────────────────
const MapelModal = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState(data || {
    kode: "", nama: "", kelompok: "Wajib", kkm: 75, jumlah_jam: 2, tingkat: "VII,VIII,IX", guru_pengampu_id: "", kurikulum_id: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [kurikulums, setKurikulums] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/guru?limit=1000"),
      api.get("/kurikulum?limit=1000")
    ])
    .then(([resGuru, resKurikulum]) => {
      setTeachers(resGuru.data?.data || []);
      setKurikulums(resKurikulum.data?.data || []);
    })
    .catch(err => console.error("Gagal load data", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.kode || !form.nama) { setError("Kode dan Nama wajib diisi."); return; }
    setSaving(true);
    try {
      const payload = {
        kode: form.kode, nama: form.nama, kelompok: form.kelompok,
        kkm: parseInt(form.kkm), jumlah_jam: parseInt(form.jumlah_jam), tingkat: form.tingkat,
        guru_pengampu_id: form.guru_pengampu_id || null,
        kurikulum_id: form.kurikulum_id || null
      };
      if (data?.id) {
        await api.put(`/mapel/${data.id}`, payload);
      } else {
        await api.post("/mapel", payload);
      }
      onSave();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menyimpan data.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative my-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {data?.id ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kode <span className="text-red-500">*</span></label>
              <input value={form.kode} onChange={e => setForm({...form, kode: e.target.value})} placeholder="cth: MTK" maxLength={20} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kelompok</label>
              <select value={form.kelompok} onChange={e => setForm({...form, kelompok: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                {KELOMPOK_LIST.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Mata Pelajaran <span className="text-red-500">*</span></label>
            <input value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} placeholder="cth: Matematika" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenjang / Tingkat</label>
            <div className="flex flex-wrap gap-2">
              {TINGKAT_LIST.map(t => {
                const active = (form.tingkat || "").split(",").map(x => x.trim()).includes(t);
                return (
                  <button key={t} type="button" onClick={() => {
                    const curr = (form.tingkat || "").split(",").map(x => x.trim()).filter(Boolean);
                    setForm({...form, tingkat: (active ? curr.filter(x => x !== t) : [...curr, t]).join(",")});
                  }} className={`px-3 py-1.5 rounded-md text-sm font-medium border ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                    Kelas {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">KKM</label>
              <input type="number" min={0} max={100} value={form.kkm} onChange={e => setForm({...form, kkm: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jam / Minggu</label>
              <input type="number" min={1} max={10} value={form.jumlah_jam} onChange={e => setForm({...form, jumlah_jam: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kurikulum</label>
            <select value={form.kurikulum_id || ""} onChange={e => setForm({...form, kurikulum_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              <option value="">-- Pilih Kurikulum --</option>
              {kurikulums.map(k => <option key={k.id} value={k.id}>{k.nama_kurikulum} ({k.tahun_ajaran_nama})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Guru Pengampu</label>
            <select value={form.guru_pengampu_id || ""} onChange={e => setForm({...form, guru_pengampu_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              <option value="">-- Pilih Guru --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.nama}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Komponen Utama ───────────────────────────────────────────────────────────
const Subjects = () => {
  const [subjects, setSubjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [filterKelompok, setFilterKelompok] = useState("");
  const [filterTingkat, setFilterTingkat]   = useState("");
  const [modal, setModal]             = useState(null); // null | { data }
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      showToast("Tidak ada data untuk diekspor.", "error");
      return;
    }
    const csvContent = [
      ["No", "Kode", "Nama Mata Pelajaran", "Kelompok", "Jenjang", "KKM", "Jam/Minggu", "Guru Pengampu"],
      ...filtered.map((item, idx) => [
        idx + 1,
        item.kode,
        item.nama,
        item.kelompok || "-",
        (item.tingkat || "").replace(/,/g, " & "),
        item.kkm,
        item.jumlah_jam,
        item.guru_nama || "Belum ditentukan"
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Data_Mata_Pelajaran.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchMapel = async () => {
    setLoading(true);
    try {
      const res = await api.get("/mapel?limit=100");
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat mapel", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMapel(); }, []);

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Hapus mata pelajaran "${nama}"?`)) return;
    try {
      await api.delete(`/mapel/${id}`);
      showToast("Mata pelajaran berhasil dihapus.");
      fetchMapel();
    } catch (err) {
      showToast("Gagal menghapus.", "error");
    }
  };

  const handleSave = () => {
    setModal(null);
    fetchMapel();
    showToast("Data berhasil disimpan.");
  };

  const filtered = subjects.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (s.nama || "").toLowerCase().includes(q) || (s.kode || "").toLowerCase().includes(q);
    const matchKelompok = filterKelompok ? s.kelompok === filterKelompok : true;
    const matchTingkat  = filterTingkat  ? (s.tingkat || "").includes(filterTingkat) : true;
    return matchSearch && matchKelompok && matchTingkat;
  });

  const totalJam = subjects.reduce((acc, s) => acc + (Number(s.jumlah_jam) || 0), 0);

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-[13px] font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {modal && <MapelModal data={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="text-[13px] font-medium text-gray-400 mb-1">
            Dashboard <span className="mx-1">&gt;</span> Kelola Akademik <span className="mx-1">&gt;</span>
            <span className="text-gray-600 font-bold">Mata Pelajaran</span>
          </div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Mata Pelajaran</h1>
          <p className="text-gray-500 text-[14px] mt-1">
            Kelola daftar mata pelajaran SMP, alokasi jam, dan kelompok pelajaran.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Ekspor Daftar
          </button>
          <button
            onClick={() => setModal({ data: null })}
            className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122A44] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Mata Pelajaran
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Mapel",   value: subjects.length, sub: `${filtered.length} ditampilkan` },
          { label: "Kelompok Wajib", value: subjects.filter(s => s.kelompok === "Wajib").length },
          { label: "Peminatan IPA/IPS", value: subjects.filter(s => s.kelompok === "IPA" || s.kelompok === "IPS").length },
          { label: "Total Jam/Minggu", value: totalJam, sub: "jam" },
        ].map((c, i) => (
          <div key={i} className="bg-[#1A3D63] rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{c.label}</div>
            <div className="text-3xl font-black text-white">{c.value}</div>
            {c.sub && <div className="text-xs text-blue-300 mt-1">{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input type="text" placeholder="Cari mata pelajaran..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-[220px] focus:outline-none focus:border-[#1A3D63] transition-colors" />
            </div>
            {/* Filter Kelompok */}
            <select value={filterKelompok} onChange={e => setFilterKelompok(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#1A3D63] bg-white">
              <option value="">Semua Kelompok</option>
              {KELOMPOK_LIST.map(k => <option key={k}>{k}</option>)}
            </select>
            {/* Filter Tingkat */}
            <select value={filterTingkat} onChange={e => setFilterTingkat(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#1A3D63] bg-white">
              <option value="">Semua Jenjang</option>
              {TINGKAT_LIST.map(t => <option key={t} value={t}>Kelas {t}</option>)}
            </select>
          </div>
          <span className="text-[13px] text-gray-400">{filtered.length} dari {subjects.length} data</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
          <table className="w-full text-left relative">
            <thead className="sticky top-0 z-10 bg-gray-50 shadow-[0_1px_0_0_#f3f4f6]">
              <tr>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">No</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Kode</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Nama Mata Pelajaran</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Kelompok</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Jenjang</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">KKM</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Jam/Minggu</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Guru Pengampu</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right bg-gray-50">Aksi</th>
              </tr>
            </thead>
            {loading ? <Skeleton /> : (
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center text-gray-400 text-[14px]">Tidak ada data yang cocok.</td></tr>
                ) : filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-[13px] text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-bold text-gray-800 font-mono tracking-wide">{item.kode}</span>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-bold text-[#1e293b]">{item.nama}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${KELOMPOK_COLORS[item.kelompok] || "bg-gray-100 text-gray-600"}`}>
                        {item.kelompok || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(item.tingkat || "").split(",").filter(Boolean).map(t => (
                          <span key={t} className="text-[11px] font-semibold text-[#1A3D63] bg-[#1A3D63]/10 px-2 py-0.5 rounded-md">{t.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700">{item.kkm}</td>
                    <td className="px-6 py-4 text-[13px]">
                      <span className="font-bold text-gray-800">{item.jumlah_jam}</span>
                      <span className="text-gray-400"> jam</span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-500">
                      {item.guru_nama || <span className="text-gray-300 italic">Belum ditentukan</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 transition-opacity">
                        <button onClick={() => setModal({ data: item })} title="Edit"
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama)} title="Hapus"
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
