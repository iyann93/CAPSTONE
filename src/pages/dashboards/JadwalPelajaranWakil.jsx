import React, { useState } from "react";

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const JAM = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
const KELAS_LIST = ["VII IPA 1", "VII IPA 2", "VII IPS 1", "VIII IPA 1", "VIII IPA 2", "VIII IPS 1", "IX IPA 1", "IX IPA 2"];
const GURU_LIST = ["Bpk. Hendra", "Ibu Sari", "Bpk. Agus", "Ibu Lena", "Ibu Rina", "Bpk. Joko"];
const RUANG_LIST = ["R. 01", "R. 02", "R. 03", "Lab Fisika", "Lab Kimia", "Lab Komputer"];
const MAPEL_LIST = ["Matematika", "Fisika", "Kimia", "Biologi", "B. Indonesia", "B. Inggris", "Sejarah", "PKN"];

const initJadwal = [
  { id: 1, mapel: "Matematika", guru: "Bpk. Hendra", kelas: "VIII IPA 1", hari: "Senin", jam: "07:00", ruang: "R. 01", semester: "Genap 2023/2024" },
  { id: 2, mapel: "Fisika", guru: "Bpk. Hendra", kelas: "VIII IPA 2", hari: "Senin", jam: "08:00", ruang: "Lab Fisika", semester: "Genap 2023/2024" },
  { id: 3, mapel: "Kimia", guru: "Ibu Rina", kelas: "VIII IPA 1", hari: "Selasa", jam: "07:00", ruang: "Lab Kimia", semester: "Genap 2023/2024" },
  { id: 4, mapel: "B. Indonesia", guru: "Ibu Sari", kelas: "VII IPS 1", hari: "Rabu", jam: "10:00", ruang: "R. 12", semester: "Genap 2023/2024" },
  { id: 5, mapel: "B. Inggris", guru: "Ibu Lena", kelas: "VII IPA 1", hari: "Kamis", jam: "09:00", ruang: "R. 03", semester: "Genap 2023/2024" },
];

const emptyForm = { mapel: "Matematika", guru: "Bpk. Hendra", kelas: "VII IPA 1", hari: "Senin", jam: "07:00", ruang: "R. 01", semester: "Genap 2023/2024" };

const detectConflicts = (jadwal) => {
  const conflicts = [];
  for (let i = 0; i < jadwal.length; i++) {
    for (let j = i + 1; j < jadwal.length; j++) {
      const a = jadwal[i], b = jadwal[j];
      if (a.hari === b.hari && a.jam === b.jam) {
        if (a.guru === b.guru) conflicts.push({ type: "guru", msg: `${a.guru} dijadwalkan 2x pada ${a.hari} ${a.jam}`, ids: [a.id, b.id] });
        if (a.ruang === b.ruang) conflicts.push({ type: "ruang", msg: `Ruang ${a.ruang} dipakai 2x pada ${a.hari} ${a.jam}`, ids: [a.id, b.id] });
        if (a.kelas === b.kelas) conflicts.push({ type: "kelas", msg: `Kelas ${a.kelas} dijadwalkan 2x pada ${a.hari} ${a.jam}`, ids: [a.id, b.id] });
      }
    }
  }
  return conflicts;
};

const JadwalPelajaranWakil = () => {
  const [jadwal, setJadwal] = useState(() => {
    const s = localStorage.getItem("wakil_jadwal");
    return s ? JSON.parse(s) : initJadwal;
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterHari, setFilterHari] = useState("Semua");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [viewMode, setViewMode] = useState("tabel");

  const conflicts = detectConflicts(jadwal);
  const conflictIds = new Set(conflicts.flatMap(c => c.ids));

  const save = (d) => { setJadwal(d); localStorage.setItem("wakil_jadwal", JSON.stringify(d)); };
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = editId
      ? jadwal.map(j => j.id === editId ? { ...j, ...form } : j)
      : [...jadwal, { ...form, id: Date.now() }];
    save(updated);
    showToast(editId ? "Jadwal berhasil diperbarui!" : "Jadwal berhasil ditambahkan!");
    setShowForm(false); setEditId(null); setForm(emptyForm);
  };

  const handleEdit = (item) => {
    setForm({ mapel: item.mapel, guru: item.guru, kelas: item.kelas, hari: item.hari, jam: item.jam, ruang: item.ruang, semester: item.semester });
    setEditId(item.id); setShowForm(true);
  };

  const filtered = jadwal.filter(j => {
    const hOk = filterHari === "Semua" || j.hari === filterHari;
    const kOk = filterKelas === "Semua" || j.kelas === filterKelas;
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

      {/* Conflict Alerts */}
      {conflicts.length > 0 && (
        <div className="space-y-2">
          {conflicts.map((c, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5" className="flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p className="text-[13px] font-semibold text-amber-800">⚠️ Bentrok: {c.msg}</p>
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

      {/* Filters + View Toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select value={filterHari} onChange={e => setFilterHari(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="Semua">Semua Hari</option>
            {HARI.map(h => <option key={h}>{h}</option>)}
          </select>
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="Semua">Semua Kelas</option>
            {KELAS_LIST.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          {["tabel", "grid"].map(m => (
            <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-colors ${viewMode === m ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600"}`}>
              {m === "tabel" ? "📋 Tabel" : "ðŸ—“ï¸ Grid"}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      {viewMode === "tabel" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>{["MATA PELAJARAN", "GURU", "KELAS", "HARI", "JAM", "RUANG", "SEMESTER", "AKSI"].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(j => (
                  <tr key={j.id} className={`transition-colors ${conflictIds.has(j.id) ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-gray-50/50"}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {conflictIds.has(j.id) && <span className="text-amber-500 text-[14px]">⚠️</span>}
                        <span className="text-[13px] font-bold text-gray-800">{j.mapel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600">{j.guru}</td>
                    <td className="px-4 py-3.5"><span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold">{j.kelas}</span></td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600">{j.hari}</td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-[#1A3D63]">{j.jam}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{j.ruang}</td>
                    <td className="px-4 py-3.5 text-[12px] text-gray-400">{j.semester}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(j)} className="px-3 py-1.5 bg-blue-50 text-[#1A3D63] rounded-lg text-[11px] font-bold hover:bg-blue-100">Edit</button>
                        <button onClick={() => setDeleteConfirm(j)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400 text-[13px]">Tidak ada jadwal untuk filter ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-[700px]">
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
                  const cell = jadwal.find(j => j.jam === jam && j.hari === hari);
                  return (
                    <div key={hari} className="px-2 py-2 border-l border-gray-50 flex items-center">
                      {cell ? (
                        <div className={`w-full px-2.5 py-2 rounded-lg text-[10px] leading-tight cursor-pointer hover:opacity-90 transition-opacity ${conflictIds.has(cell.id) ? "bg-amber-100 border border-amber-300" : "bg-blue-50 border border-blue-100"}`}
                          onClick={() => handleEdit(cell)}>
                          <p className="font-bold text-gray-800 truncate">{cell.mapel}</p>
                          <p className="text-gray-500 truncate">{cell.kelas}</p>
                          <p className="text-gray-400 truncate">{cell.ruang}</p>
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[560px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-[17px] font-bold text-[#1e293b]">{editId ? "Edit Jadwal" : "Tambah Jadwal Baru"}</h3>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Mata Pelajaran", key: "mapel", opts: MAPEL_LIST },
                  { label: "Guru", key: "guru", opts: GURU_LIST },
                  { label: "Kelas", key: "kelas", opts: KELAS_LIST },
                  { label: "Ruang", key: "ruang", opts: RUANG_LIST },
                  { label: "Hari", key: "hari", opts: HARI },
                  { label: "Jam Mulai", key: "jam", opts: JAM },
                ].map(({ label, key, opts }) => (
                  <div key={key}>
                    <label className="block text-[12px] font-bold text-gray-600 mb-1.5">{label}</label>
                    <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100">
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Semester</label>
                <input value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} placeholder="Genap 2023/2024" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100"/>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[12px] text-blue-700 flex gap-2">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                Sistem akan otomatis mendeteksi bentrok guru, ruang, dan kelas setelah disimpan. Guru & Wali Kelas akan menerima notifikasi jadwal baru.
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl font-bold">Simpan Jadwal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl p-6 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </div>
              <h3 className="text-[17px] font-bold text-gray-800">Hapus Jadwal?</h3>
              <p className="text-[13px] text-gray-500 mt-1">{deleteConfirm.mapel} — {deleteConfirm.kelas} ({deleteConfirm.hari}, {deleteConfirm.jam})</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold">Batal</button>
              <button onClick={() => { save(jadwal.filter(j => j.id !== deleteConfirm.id)); setDeleteConfirm(null); showToast("Jadwal dihapus!", "error"); }} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalPelajaranWakil;


