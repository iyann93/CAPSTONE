import React, { useState, useEffect } from "react";
import StudentForm from "./StudentForm";
import StudentDetail from "./StudentDetail";
import StudentEdit from "./StudentEdit";
import api from "../../api/axios";

// Helper to format tanggal_lahir
const formatDate = (dateStr) => {
  if (!dateStr) return <span className="text-gray-300 italic text-[13px]">—</span>;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric"
    });
  } catch {
    return dateStr;
  }
};

const mapSiswa = (s, index) => {
  const colors = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#6366F1"];
  const nameParts = s.nama_lengkap ? s.nama_lengkap.split(" ") : ["?"];
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0][0] || "U").toUpperCase();

  const isX  = s.nama_kelas?.toUpperCase().startsWith("X ");
  const isXI = s.nama_kelas?.toUpperCase().startsWith("XI ");
  const tingkat = isX ? "Kelas X" : isXI ? "Kelas XI" : "Kelas XII";

  return {
    id:           s.id,
    nis:          s.nis,
    nama_lengkap: s.nama_lengkap,
    tempat_lahir: s.tempat_lahir || null,
    tanggal_lahir:s.tanggal_lahir || null,
    jenis_kelamin:s.jenis_kelamin,
    kelas:        s.nama_kelas || "-",
    kelas_id:     s.kelas_id,
    tingkat,
    status:       s.status || "aktif",
    avatarColor:  colors[index % colors.length],
    initials,
    // Keep legacy fields for StudentDetail/Edit compatibility
    name:         s.nama_lengkap,
    gender:       s.jenis_kelamin,
    email:        `${s.nis}@student.mbsprambanan.sch.id`,
    nisn:         s.nisn || (s.nis + "000"),
    jurusan:      s.nama_jurusan || "-",
    nilaiRataRata:80 + (index % 15),
    kehadiran:    90 + (index % 10),
  };
};

const StudentData = () => {
  const [students, setStudents]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [viewMode, setViewMode]         = useState("list");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab]       = useState("Semua");
  const [searchQuery, setSearchQuery]   = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/siswa");
      setStudents((res.data.data || []).map(mapSiswa));
    } catch (err) {
      console.error("Failed to fetch students", err);
      setError("Gagal memuat data siswa. Pastikan Anda sudah login.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async (newStudent) => {
    try {
      await api.post("/siswa", {
        nis:          newStudent.nis,
        nisn:         newStudent.nisn,
        nama_lengkap: newStudent.name,
        jenis_kelamin:newStudent.gender,
        tempat_lahir: newStudent.tempatLahir || null,
        tanggal_lahir:newStudent.tanggalLahir || null,
        alamat:       newStudent.alamat || "-",
        status:       newStudent.status === "Aktif" ? "aktif" : "tidak_aktif",
        kelas_id:     newStudent.kelas_id || null,
      });
      await fetchStudents();
      setViewMode("list");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert("Gagal: " + (err.response.data.message || JSON.stringify(err.response.data)));
      } else {
        alert("Gagal menambahkan siswa: " + err.message);
      }
    }
  };

  const handleEdit = async (updatedStudent) => {
    try {
      // Normalize tanggal_lahir: trim ISO timestamp to YYYY-MM-DD
      const rawDate = updatedStudent.tanggalLahir || null;
      const tanggalLahir = rawDate ? rawDate.substring(0, 10) : null;

      await api.put(`/siswa/${updatedStudent.id}`, {
        nis:          updatedStudent.nis,
        nisn:         updatedStudent.nisn,
        nama_lengkap: updatedStudent.name,
        jenis_kelamin:updatedStudent.gender,
        tempat_lahir: updatedStudent.tempatLahir || null,
        tanggal_lahir: tanggalLahir,
        alamat:       updatedStudent.alamat || "-",
        status:       updatedStudent.status,
        kelas_id:     updatedStudent.kelas_id || null,
      });
      await fetchStudents();
      setViewMode("list");
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan siswa");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/siswa/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (viewMode !== "list") { setViewMode("list"); setSelectedStudent(null); }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus siswa");
    }
  };

  if (viewMode === "add")
    return <StudentForm onBack={() => setViewMode("list")} onSave={handleAdd} />;
  if (viewMode === "edit" && selectedStudent)
    return <StudentEdit student={selectedStudent} onBack={() => setViewMode("list")} onSave={handleEdit} onDelete={handleDelete} />;
  if (viewMode === "detail" && selectedStudent)
    return <StudentDetail student={selectedStudent} onBack={() => setViewMode("list")} onEdit={(s) => { setSelectedStudent(s); setViewMode("edit"); }} />;

  const TABS = ["Semua", "Laki-laki", "Perempuan", "Aktif", "Tidak Aktif"];

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (s.nama_lengkap || "").toLowerCase().includes(q) ||
      (s.nis || "").toLowerCase().includes(q) ||
      (s.kelas || "").toLowerCase().includes(q) ||
      (s.tempat_lahir || "").toLowerCase().includes(q);

    let matchTab = true;
    if (activeTab === "Laki-laki")   matchTab = s.jenis_kelamin === "L";
    if (activeTab === "Perempuan")   matchTab = s.jenis_kelamin === "P";
    if (activeTab === "Aktif")       matchTab = s.status === "aktif";
    if (activeTab === "Tidak Aktif") matchTab = s.status !== "aktif";

    return matchSearch && matchTab;
  });

  const totalL  = students.filter((s) => s.jenis_kelamin === "L").length;
  const totalP  = students.filter((s) => s.jenis_kelamin === "P").length;
  const totalAktif = students.filter((s) => s.status === "aktif").length;

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F4F6FA] min-h-full">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Data Siswa</h1>
          <p className="text-gray-500 text-[15px] mt-1">
            Kelola data seluruh siswa aktif, informasi pribadi, dan rekap akademik.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 shadow-sm transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Ekspor Data
          </button>
          <button
            onClick={() => setViewMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-xl text-[14px] font-bold shadow-sm transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Siswa",   val: students.length,  sub: "Semua data",       icon: "👥" },
          { label: "Laki-laki",     val: totalL,           sub: "Jenis kelamin L",  icon: "♂" },
          { label: "Perempuan",     val: totalP,           sub: "Jenis kelamin P",  icon: "♀" },
          { label: "Siswa Aktif",   val: totalAktif,       sub: "Status aktif",     icon: "✓" },
        ].map((c, i) => (
          <div key={i} className="bg-[#1A3D63] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">{c.label}</div>
            <div className="text-3xl font-black text-white">{loading ? "…" : c.val}</div>
            <div className="text-xs text-blue-300 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Main Table Card ────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#1A3D63] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-[280px]">
            <input
              type="text"
              placeholder="Cari nama, NIS, kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] bg-gray-50 focus:bg-white transition-all"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>

        {/* Loading / Error / Empty */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-3 text-[#1A3D63]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Memuat data siswa...
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-3">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/></svg>
            <p className="text-[14px] font-medium">{error}</p>
            <button onClick={fetchStudents} className="px-4 py-2 bg-[#1A3D63] text-white rounded-lg text-sm font-bold hover:bg-[#122A44] transition-colors">
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">No</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">NIS</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tempat Lahir</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tanggal Lahir</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Jenis Kelamin</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kelas</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-gray-400 text-[14px]">
                        Tidak ada data siswa ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, index) => (
                      <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                        {/* No */}
                        <td className="py-3.5 px-5 text-[13px] text-gray-400 font-medium">{index + 1}</td>

                        {/* NIS */}
                        <td className="py-3.5 px-5">
                          <span className="font-mono text-[13px] font-bold text-[#1A3D63] bg-[#1A3D63]/8 px-2 py-0.5 rounded-md">
                            {s.nis}
                          </span>
                        </td>

                        {/* Nama Lengkap */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black text-white flex-shrink-0"
                              style={{ backgroundColor: s.avatarColor }}
                            >
                              {s.initials}
                            </div>
                            <span className="text-[14px] font-semibold text-[#1e293b]">{s.nama_lengkap}</span>
                          </div>
                        </td>

                        {/* Tempat Lahir */}
                        <td className="py-3.5 px-5 text-[13px] text-gray-600">
                          {s.tempat_lahir
                            ? s.tempat_lahir
                            : <span className="text-gray-300 italic">NULL</span>}
                        </td>

                        {/* Tanggal Lahir */}
                        <td className="py-3.5 px-5 text-[13px] text-gray-600">
                          {formatDate(s.tanggal_lahir)}
                        </td>

                        {/* Jenis Kelamin */}
                        <td className="py-3.5 px-5 text-center">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-black ${
                            s.jenis_kelamin === "L"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-pink-100 text-pink-600"
                          }`}>
                            {s.jenis_kelamin}
                          </span>
                        </td>

                        {/* Kelas */}
                        <td className="py-3.5 px-5">
                          <span className="text-[13px] font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                            {s.kelas}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${
                            s.status === "aktif"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.status === "aktif" ? "bg-emerald-500" : "bg-gray-400"}`}/>
                            {s.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setSelectedStudent(s); setViewMode("detail"); }}
                              title="Lihat Detail"
                              className="p-1.5 text-gray-400 hover:text-[#1A3D63] hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                            <button
                              onClick={() => { setSelectedStudent(s); setViewMode("edit"); }}
                              title="Edit"
                              className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>
                            <button
                              onClick={() => { if (window.confirm(`Hapus siswa "${s.nama_lengkap}"?`)) handleDelete(s.id); }}
                              title="Hapus"
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-[13px] text-gray-500">
              <span>
                Menampilkan <span className="font-bold text-[#1A3D63]">{filtered.length}</span> dari {students.length} siswa
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-400">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#1A3D63] text-white rounded-lg font-bold text-[13px]">1</button>
                <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-400">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentData;
