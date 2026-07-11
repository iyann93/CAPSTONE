import React, { useState, useEffect } from "react";
import api from "../../api/axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (namaAyah = "", namaIbu = "") => {
  const first = namaAyah ? namaAyah[0] : "";
  const second = namaIbu ? namaIbu[0] : "";
  return (first + second).toUpperCase() || "OT";
};

const AVATAR_COLORS = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981",
  "#EF4444", "#6366F1", "#14B8A6", "#F97316", "#84CC16"
];

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex flex-wrap items-center gap-4 px-5 py-4 border-b border-gray-50">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
        <div className="h-6 bg-gray-100 rounded-lg w-20" />
        <div className="h-3.5 bg-gray-100 rounded w-28" />
      </div>
    ))}
  </div>
);

// ─── Komponen Utama ───────────────────────────────────────────────────────────
const ParentData = ({ readOnly = false }) => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'form'
  const [formData, setFormData] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Siswa list for dropdown ──
  const [siswaList, setSiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");

  const showToast = window.showToast;

  // ── Fetch all orang tua ──
  const fetchParents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orang-tua");
      setParents(res.data.data || []);
    } catch (err) {
      setError("Gagal memuat data. Pastikan server berjalan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch siswa for dropdown ──
  const fetchSiswa = async () => {
    try {
      const res = await api.get("/siswa?limit=200");
      setSiswaList(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat data siswa", err);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await api.get("/kelas?limit=100");
      setKelasList(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat data kelas", err);
    }
  };

  useEffect(() => {
    fetchParents();
    fetchKelas();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleAdd = () => {
    fetchSiswa();
    setSelectedKelas("");
    setFormData({ id: null, siswa_id: "", nama_ayah: "", nama_ibu: "", no_telepon: "", pekerjaan_wali: "", hubungan: "ayah" });
    setViewMode("form");
  };

  const handleEdit = (parent) => {
    fetchSiswa();
    setSelectedKelas("");
    setFormData({
      id: parent.id,
      siswa_id: parent.siswa_id || "",
      nama_ayah: parent.nama_ayah || "",
      nama_ibu: parent.nama_ibu || "",
      no_telepon: parent.no_telepon || "",
      pekerjaan_wali: parent.pekerjaan_wali || "",
      hubungan: parent.hubungan || "ayah",
    });
    setViewMode("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data orang tua ini?")) return;
    try {
      await api.delete(`/orang-tua/${id}`);
      showToast("Data orang tua berhasil dihapus.");
      fetchParents();
    } catch (err) {
      showToast("Gagal menghapus data.", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.id) {
        await api.put(`/orang-tua/${formData.id}`, formData);
        showToast("Data orang tua berhasil diperbarui.");
      } else {
        await api.post("/orang-tua", formData);
        showToast("Data orang tua berhasil ditambahkan.");
      }
      fetchParents();
      setViewMode("list");
    } catch (err) {
      showToast(err?.response?.data?.message || "Gagal menyimpan data.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredParents = parents.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.nama_ayah || "").toLowerCase().includes(q) ||
      (p.nama_ibu || "").toLowerCase().includes(q) ||
      (p.nama_siswa || "").toLowerCase().includes(q) ||
      (p.kelas || "").toLowerCase().includes(q)
    );
  });

  const filteredSiswaList = selectedKelas 
    ? siswaList.filter(s => s.kelas_id === selectedKelas)
    : siswaList;

  // ─── Form View ────────────────────────────────────────────────────────────
  if (viewMode === "form") {
    return (
      <div className="p-6 md:p-8 space-y-6 bg-[#F4F6FA] min-h-full">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setViewMode("list")}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-[#1e293b] shadow-sm transition-colors"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b]">{formData.id ? "Edit Data Orang Tua" : "Tambah Data Orang Tua"}</h1>
            <p className="text-gray-500 text-[15px] mt-1">Lengkapi form di bawah ini untuk menyimpan data.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700">Filter Kelas Siswa</label>
              <select
                value={selectedKelas}
                onChange={(e) => {
                  setSelectedKelas(e.target.value);
                  setFormData({ ...formData, siswa_id: "" });
                }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white"
              >
                <option value="">Semua Kelas</option>
                {kelasList.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700">Siswa <span className="text-red-500">*</span></label>
              <select
                required
                value={formData.siswa_id}
                onChange={(e) => setFormData({ ...formData, siswa_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white"
              >
                <option value="">-- Pilih Siswa --</option>
                {filteredSiswaList.map((s) => (
                  <option key={s.id} value={s.id}>{s.nama_lengkap} {s.kelas ? `(${s.nama_kelas || s.kelas})` : ""}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700">Nama Ayah</label>
              <input
                type="text"
                value={formData.nama_ayah}
                onChange={(e) => setFormData({ ...formData, nama_ayah: e.target.value })}
                placeholder="Nama lengkap ayah"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700">Nama Ibu</label>
              <input
                type="text"
                value={formData.nama_ibu}
                onChange={(e) => setFormData({ ...formData, nama_ibu: e.target.value })}
                placeholder="Nama lengkap ibu"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700">No. Telepon / WhatsApp</label>
              <input
                type="text"
                value={formData.no_telepon}
                onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700">Pekerjaan Wali</label>
              <input
                type="text"
                value={formData.pekerjaan_wali}
                onChange={(e) => setFormData({ ...formData, pekerjaan_wali: e.target.value })}
                placeholder="Contoh: PNS, Wiraswasta"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[13px] font-bold text-gray-700">Hubungan</label>
              <select
                value={formData.hubungan}
                onChange={(e) => setFormData({ ...formData, hubungan: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white"
              >
                <option value="ayah">Ayah</option>
                <option value="ibu">Ibu</option>
                <option value="wali">Wali</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-[14px] font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] disabled:opacity-60 text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm flex items-center gap-2"
            >
              {saving && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
              {saving ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-lg text-[13px] font-semibold text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Data Orang Tua</h1>
          <p className="text-gray-500 text-[15px] mt-1">
            {readOnly ? "Lihat informasi orang tua siswa." : "Kelola informasi kontak dan data orang tua siswa."}
          </p>
        </div>
        {!readOnly && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-xl text-[14px] font-bold shadow-sm transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Data
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-[300px]">
            <input
              type="text"
              placeholder="Cari nama orang tua, siswa, kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] bg-gray-50 focus:bg-white transition-all"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-400">{filteredParents.length} data</span>
            <button onClick={fetchParents} className="p-2 text-gray-400 hover:text-[#1A3D63] hover:bg-gray-50 rounded-lg transition-colors" title="Refresh">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="m-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600 font-medium flex items-center gap-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/></svg>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">No</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Orang Tua</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kontak</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hubungan</th>
                {!readOnly && <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={readOnly ? 6 : 7}><Skeleton /></td></tr>
              ) : filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 6 : 7} className="py-16 text-center text-gray-400 text-[14px]">
                    {searchQuery ? "Tidak ada data yang cocok dengan pencarian." : "Belum ada data orang tua."}
                  </td>
                </tr>
              ) : (
                filteredParents.map((p, index) => {
                  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                  const initials = getInitials(p.nama_ayah, p.nama_ibu);
                  return (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-3.5 px-5 text-[13px] text-gray-400 font-medium">{index + 1}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0" style={{ backgroundColor: color }}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#1e293b]">{p.nama_ayah || "-"}</p>
                            <p className="text-[12px] text-gray-500">{p.nama_ibu || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-[13px] text-[#1e293b] font-medium">{p.nama_siswa || "-"}</td>
                      <td className="py-3.5 px-5">
                        <span className="text-[12px] font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">{p.kelas || "-"}</span>
                      </td>
                      <td className="py-3.5 px-5 text-[13px] text-gray-600 font-mono">{p.no_telepon || "-"}</td>
                      <td className="py-3.5 px-5">
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg capitalize">{p.hubungan || "-"}</span>
                      </td>
                      {!readOnly && (
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(p)} title="Edit" className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(p.id)} title="Hapus" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParentData;
