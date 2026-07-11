import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const JAM = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

const emptyForm = { mapelId: "", guruId: "", kelasId: "", hari: "Senin", jamMulai: "07:00", jamSelesai: "08:00", semesterId: "" };

const detectConflicts = (jadwal) => {
  const conflicts = [];
  for (let i = 0; i < jadwal.length; i++) {
    for (let j = i + 1; j < jadwal.length; j++) {
      const a = jadwal[i], b = jadwal[j];
      if (a.hari === b.hari && a.jam_mulai === b.jam_mulai) {
        if (a.guru_id === b.guru_id) conflicts.push({ type: "guru", msg: `${a.guru_nama} dijadwalkan 2x pada ${a.hari} ${a.jam_mulai}`, ids: [a.id, b.id] });
        if (a.kelas_id === b.kelas_id) conflicts.push({ type: "kelas", msg: `Kelas ${a.nama_kelas} dijadwalkan 2x pada ${a.hari} ${a.jam_mulai}`, ids: [a.id, b.id] });
      }
    }
  }
  return conflicts;
};

const JadwalPelajaranWakil = () => {
  const [jadwal, setJadwal] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterHari, setFilterHari] = useState("Semua");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [viewMode, setViewMode] = useState("tabel");

  // Master Data States
  const [mapelList, setMapelList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resMapel, resGuru, resKelas, resSemester, resJadwal] = await Promise.all([
        api.get('/mapel?limit=100'),
        api.get('/guru?limit=100'),
        api.get('/kelas?limit=100'),
        api.get('/semester'),
        api.get('/jadwal-pelajaran?limit=100')
      ]);
      setMapelList(resMapel.data.data || []);
      setGuruList(resGuru.data.data || []);
      setKelasList(resKelas.data.data || []);
      setSemesterList(resSemester.data.data || []);
      
      const jadwalDataRaw = resJadwal.data.data || [];
      setJadwal(jadwalDataRaw);
    } catch (err) {
      console.error("Gagal memuat master data:", err);
    }
  };

  const conflicts = detectConflicts(jadwal);
  const conflictIds = new Set(conflicts.flatMap(c => c.ids));

  const showToast = window.showToast;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        mapelId: form.mapelId,
        guruId: form.guruId,
        kelasId: form.kelasId,
        semesterId: form.semesterId,
        hari: form.hari,
        jamMulai: form.jamMulai,
        jamSelesai: form.jamSelesai
      };
      
      if (editId) {
        await api.put(`/jadwal-pelajaran/${editId}`, payload);
        showToast("Jadwal berhasil diperbarui!");
      } else {
        await api.post('/jadwal-pelajaran', payload);
        showToast("Jadwal berhasil ditambahkan!");
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      fetchData(); // reload
    } catch (err) {
      showToast(err.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  const handleEdit = (item) => {
    setForm({ 
      mapelId: item.mata_pelajaran_id, 
      guruId: item.guru_id, 
      kelasId: item.kelas_id, 
      hari: item.hari, 
      jamMulai: item.jam_mulai, 
      jamSelesai: item.jam_selesai, 
      semesterId: item.semester_id 
    });
    setEditId(item.id); 
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/jadwal-pelajaran/${deleteConfirm.id}`);
      showToast("Jadwal dihapus!");
      setDeleteConfirm(null);
      fetchData(); // reload
    } catch (err) {
      showToast("Gagal menghapus jadwal", "error");
    }
  };

  const filtered = jadwal.filter(j => {
    const hOk = filterHari === "Semua" || j.hari === filterHari;
    const kOk = filterKelas === "Semua" || j.kelas_id === filterKelas;
    return hOk && kOk;
  });

  return (
    <div className="p-6 md:p-8 space-y-5 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-white text-[13px] font-bold flex items-center gap-2 animate-fadeIn ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          {toast.msg}
        </div>
      )}

      <div className="text-[13px] text-gray-400">Dashboard &gt; <span className="text-[#2A4365] font-semibold">Jadwal Pelajaran</span></div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Jadwal Pelajaran</h1>
          <p className="text-[14px] text-gray-500 mt-1">Kelola jadwal mengajar & deteksi bentrok otomatis</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl text-[13px] font-bold shadow-sm transition-colors">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Tambah Jadwal
        </button>
      </div>

      {conflicts.length > 0 && (
        <div className="space-y-2">
          {conflicts.map((c, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5" className="flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p className="text-[13px] font-semibold text-amber-800">⚠️  Bentrok: {c.msg}</p>
            </div>
          ))}
        </div>
      )}
      {conflicts.length === 0 && jadwal.length > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
          <p className="text-[13px] font-semibold text-green-700">Tidak ada bentrok jadwal terdeteksi</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select value={filterHari} onChange={e => setFilterHari(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="Semua">Semua Hari</option>
            {HARI.map(h => <option key={h}>{h}</option>)}
          </select>
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="Semua">Semua Kelas</option>
            {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          {["tabel", "grid"].map(m => (
            <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-colors ${viewMode === m ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600"}`}>
              {m === "tabel" ? "📋 Tabel" : "📅 Grid"}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "tabel" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>{["MATA PELAJARAN", "GURU", "KELAS", "HARI", "JAM", "SEMESTER", "AKSI"].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(j => (
                  <tr key={j.id} className={`transition-colors ${conflictIds.has(j.id) ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-gray-50/50"}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {conflictIds.has(j.id) && <span className="text-amber-500 text-[14px]">⚠️ </span>}
                        <span className="text-[13px] font-bold text-gray-800">{j.nama_mapel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600">{j.guru_nama}</td>
                    <td className="px-4 py-3.5"><span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold">{j.nama_kelas}</span></td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600">{j.hari}</td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-[#1A3D63]">{j.jam_mulai} - {j.jam_selesai}</td>
                    <td className="px-4 py-3.5 text-[12px] text-gray-400">{j.semester_nama}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(j)} className="px-3 py-1.5 bg-blue-50 text-[#1A3D63] rounded-lg text-[11px] font-bold hover:bg-blue-100">Edit</button>
                        <button onClick={() => setDeleteConfirm(j)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400 text-[13px]">Tidak ada jadwal untuk filter ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "grid" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-full max-w-[700px]">
            <div className="grid grid-cols-6 border-b border-gray-100">
              <div className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jam</div>
              {HARI.map(h => (
                <div key={h} className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">{h}</div>
              ))}
            </div>
            {JAM.map(jam => (
              <div key={jam} className="grid grid-cols-6 border-b border-gray-50 min-h-[56px]">
                <div className="px-4 py-3 text-[12px] font-bold text-[#1A3D63] flex items-center">{jam}</div>
                {HARI.map(hari => {
                  const cell = jadwal.find(j => j.jam_mulai === jam && j.hari === hari);
                  return (
                    <div key={hari} className="px-2 py-2 border-l border-gray-50 flex items-center">
                      {cell ? (
                        <div className={`w-full px-2.5 py-2 rounded-lg text-[10px] leading-tight cursor-pointer hover:opacity-90 transition-opacity ${conflictIds.has(cell.id) ? "bg-amber-100 border border-amber-300" : "bg-blue-50 border border-blue-100"}`}
                          onClick={() => handleEdit(cell)}>
                          <p className="font-bold text-gray-800 truncate">{cell.nama_mapel}</p>
                          <p className="text-gray-500 truncate">{cell.nama_kelas}</p>
                        </div>
                      ) : <div className="w-full h-8" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[560px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-[17px] font-bold text-[#1e293b]">{editId ? "Edit Jadwal" : "Tambah Jadwal Baru"}</h3>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Mata Pelajaran</label>
                  <select value={form.mapelId} onChange={e => setForm({ ...form, mapelId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="" disabled>Pilih Mapel</option>
                    {mapelList.map(o => <option key={o.id} value={o.id}>{o.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Guru</label>
                  <select value={form.guruId} onChange={e => setForm({ ...form, guruId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="" disabled>Pilih Guru</option>
                    {guruList.map(o => <option key={o.id} value={o.id}>{o.nama_lengkap || o.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Kelas</label>
                  <select value={form.kelasId} onChange={e => setForm({ ...form, kelasId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="" disabled>Pilih Kelas</option>
                    {kelasList.map(o => <option key={o.id} value={o.id}>{o.nama_kelas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Hari</label>
                  <select value={form.hari} onChange={e => setForm({ ...form, hari: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                    {HARI.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Jam Mulai</label>
                  <select value={form.jamMulai} onChange={e => setForm({ ...form, jamMulai: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                    {JAM.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Jam Selesai</label>
                  <select value={form.jamSelesai} onChange={e => setForm({ ...form, jamSelesai: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                    {JAM.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Semester</label>
                <select value={form.semesterId} onChange={e => setForm({ ...form, semesterId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="" disabled>Pilih Semester</option>
                  {semesterList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[12px] text-blue-700 flex gap-2">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                Sistem akan otomatis mendeteksi bentrok guru dan kelas setelah disimpan.
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl font-bold">Simpan Jadwal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl p-6 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </div>
              <h3 className="text-[17px] font-bold text-gray-800">Hapus Jadwal?</h3>
              <p className="text-[13px] text-gray-500 mt-1">{deleteConfirm.nama_mapel} — {deleteConfirm.nama_kelas} ({deleteConfirm.hari}, {deleteConfirm.jam_mulai})</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalPelajaranWakil;
