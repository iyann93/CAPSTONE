import React, { useState } from "react";
import GradePromotionCriteria from "./GradePromotionCriteria";
import GradePromotionDetail from "./GradePromotionDetail";

const mockClasses = [
  { no: 1, kelas: "Kelas X IPA 1", kode: "X-IPA-1", tingkat: "Kelas X", jurusan: "IPA", jurusanColor: "bg-blue-100 text-blue-700", wali: "Ibu Sari Dewi, S.Pd", naik: 30, total: 32, tidakNaik: 2, belum: 0, status: "Selesai" },
  { no: 2, kelas: "Kelas X IPA 2", kode: "X-IPA-2", tingkat: "Kelas X", jurusan: "IPA", jurusanColor: "bg-blue-100 text-blue-700", wali: "Bpk. Ahmad Fauzi, M.Pd", naik: 28, total: 31, tidakNaik: 1, belum: 2, status: "Dalam Proses" },
  { no: 3, kelas: "Kelas X IPS 1", kode: "X-IPS-1", tingkat: "Kelas X", jurusan: "IPS", jurusanColor: "bg-green-100 text-green-700", wali: "Ibu Dewi Anggraini, S.Pd", naik: 0, total: 30, tidakNaik: 0, belum: 30, status: "Belum Diproses" },
  { no: 4, kelas: "Kelas X IPS 2", kode: "X-IPS-2", tingkat: "Kelas X", jurusan: "IPS", jurusanColor: "bg-green-100 text-green-700", wali: "Bpk. Rudi Hartono, S.Pd", naik: 0, total: 29, tidakNaik: 0, belum: 29, status: "Belum Diproses" },
  { no: 5, kelas: "Kelas X Bahasa 1", kode: "X-BHS-1", tingkat: "Kelas X", jurusan: "Bahasa", jurusanColor: "bg-orange-100 text-orange-700", wali: "Ibu Nurdiana, S.Pd", naik: 0, total: 28, tidakNaik: 0, belum: 28, status: "Belum Diproses" },
  { no: 6, kelas: "Kelas XI IPA 1", kode: "XI-IPA-1", tingkat: "Kelas XI", jurusan: "IPA", jurusanColor: "bg-blue-100 text-blue-700", wali: "Ibu Rani Kusuma, S.Pd", naik: 33, total: 33, tidakNaik: 0, belum: 0, status: "Selesai" },
  { no: 7, kelas: "Kelas XI IPA 2", kode: "XI-IPA-2", tingkat: "Kelas XI", jurusan: "IPA", jurusanColor: "bg-blue-100 text-blue-700", wali: "Bpk. Hendra Wijaya, M.Pd", naik: 31, total: 32, tidakNaik: 1, belum: 0, status: "Selesai" },
  { no: 8, kelas: "Kelas XI IPS 1", kode: "XI-IPS-1", tingkat: "Kelas XI", jurusan: "IPS", jurusanColor: "bg-green-100 text-green-700", wali: "Ibu Maya Sari, S.Pd", naik: 27, total: 30, tidakNaik: 2, belum: 1, status: "Dalam Proses" },
  { no: 9, kelas: "Kelas XI IPS 2", kode: "XI-IPS-2", tingkat: "Kelas XI", jurusan: "IPS", jurusanColor: "bg-green-100 text-green-700", wali: "Bpk. Agus Santoso, S.Pd", naik: 0, total: 31, tidakNaik: 0, belum: 31, status: "Belum Diproses" },
  { no: 10, kelas: "Kelas XII IPA 1", kode: "XII-IPA-1", tingkat: "Kelas XII", jurusan: "IPA", jurusanColor: "bg-blue-100 text-blue-700", wali: "Ibu Siti Aminah, M.Pd", naik: 28, total: 28, tidakNaik: 0, belum: 0, status: "Selesai" },
  { no: 11, kelas: "Kelas XII IPA 2", kode: "XII-IPA-2", tingkat: "Kelas XII", jurusan: "IPA", jurusanColor: "bg-blue-100 text-blue-700", wali: "Bpk. Dodi Pratama, M.Pd", naik: 29, total: 30, tidakNaik: 1, belum: 0, status: "Selesai" },
  { no: 12, kelas: "Kelas XII IPS 1", kode: "XII-IPS-1", tingkat: "Kelas XII", jurusan: "IPS", jurusanColor: "bg-green-100 text-green-700", wali: "Ibu Rina Wati, S.Pd", naik: 0, total: 29, tidakNaik: 0, belum: 29, status: "Belum Diproses" },
];

const TABS = ["Semua Tingkat", "Kelas X", "Kelas XI", "Kelas XII"];

const StatusBadge = ({ status }) => {
  if (status === "Selesai") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-green-50 text-green-600 border border-green-100">
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
      Selesai
    </span>
  );
  if (status === "Dalam Proses") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg>
      Dalam Proses
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/></svg>
      Belum Diproses
    </span>
  );
};

const ProgressBar = ({ value, max, color = "bg-green-500" }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: 60 }}>
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[12px] font-semibold text-gray-600 w-10 text-right">{value}/{max}</span>
    </div>
  );
};

const GradePromotion = () => {
  const [classes, setClasses] = useState(mockClasses);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState("Semua Tingkat");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [showCriteria, setShowCriteria] = useState(false);
  const perPage = 10;

  React.useEffect(() => {
    // Load state from backend for true persistence across sessions
    const fetchState = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const res = await api.get('/system/frontend-state');
        if (res.data?.data?.grade_promotion_classes) {
          setClasses(res.data.data.grade_promotion_classes);
          // Also sync to local storage for offline fast load
          localStorage.setItem("grade_promotion_classes", JSON.stringify(res.data.data.grade_promotion_classes));
        } else {
          // Fallback to local storage
          const saved = localStorage.getItem("grade_promotion_classes");
          if (saved) setClasses(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Gagal memuat status kenaikan kelas dari backend", err);
        const saved = localStorage.getItem("grade_promotion_classes");
        if (saved) setClasses(JSON.parse(saved));
      }
    };
    fetchState();
  }, []);

  const handleSavePromotion = async (classId, updatedStats) => {
    const updated = classes.map(c => {
      if (c.kode === classId) {
        return {
          ...c,
          naik: updatedStats.naik,
          tidakNaik: updatedStats.tidakNaik,
          belum: updatedStats.belum,
          status: updatedStats.status
        };
      }
      return c;
    });
    setClasses(updated);
    localStorage.setItem("grade_promotion_classes", JSON.stringify(updated));
    setView("list");
    
    // Save to backend database for persistent storage across logouts/sessions
    try {
      const { default: api } = await import('../../api/axios');
      const res = await api.get('/system/frontend-state');
      const currentState = res.data?.data || {};
      await api.put('/system/frontend-state', {
        ...currentState,
        grade_promotion_classes: updated
      });
    } catch (err) {
      console.error("Gagal menyimpan ke database", err);
    }
  };

  const filtered = activeTab === "Semua Tingkat"
    ? classes
    : classes.filter(c => c.tingkat === activeTab);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalSiswa = classes.reduce((a, c) => a + c.total, 0);
  const totalNaik = classes.reduce((a, c) => a + c.naik, 0);
  const totalTidakNaik = classes.reduce((a, c) => a + c.tidakNaik, 0);
  const totalBelum = classes.reduce((a, c) => a + c.belum, 0);
  const selesai = classes.filter(c => c.status === "Selesai").length;
  const proses = classes.filter(c => c.status === "Dalam Proses").length;
  const belumProses = classes.filter(c => c.status === "Belum Diproses").length;
  const progressPct = Math.round((selesai / classes.length) * 100);

  if (view === "criteria") {
    return <GradePromotionCriteria setView={setView} />;
  }

  if (view === "detail") {
    return <GradePromotionDetail setView={setView} classData={selectedClass} mode="selesai" onSave={handleSavePromotion} />;
  }

  if (view === "process") {
    return <GradePromotionDetail setView={setView} classData={selectedClass} mode="process" onSave={handleSavePromotion} />;
  }

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] font-medium text-gray-400">
        Dashboard &gt; <span className="text-gray-500">Kelola Akademik</span> &gt; <span className="text-[#2A4365] font-semibold">Kenaikan Kelas</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Kenaikan Kelas</h1>
          <p className="text-gray-500 text-[14px] mt-1">Proses kenaikan kelas siswa berdasarkan nilai akademik dan kehadiran semester ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCriteria(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Kriteria Kenaikan
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Ekspor Laporan
          </button>
        </div>
      </div>

      {/* Progress Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-3">
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#1e293b]">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Progress Kenaikan Kelas — Ganjil 2023/2024
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Selesai: {selesai} kelas</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Proses: {proses} kelas</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Belum: {belumProses} kelas</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[14px] font-bold text-green-600 w-10">{progressPct}%</span>
        </div>
        <p className="text-[13px] text-gray-500 mt-2">{selesai} dari {mockClasses.length} kelas selesai diproses</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {[
          { label: "Total Siswa", value: totalSiswa, subText: "Seluruh kelas" },
          { label: "Naik Kelas", value: totalNaik, subText: `${Math.round((totalNaik/totalSiswa)*100)}% dari total` },
          { label: "Tidak Naik", value: totalTidakNaik, subText: `${Math.round((totalTidakNaik/totalSiswa)*100)}% dari total` },
          { label: "Belum Diproses", value: totalBelum, subText: "Menunggu keputusan" },
        ].map((card, i) => (
          <div key={i} className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
            <div>
              <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{card.label}</div>
              <div className="text-3xl font-black text-white">{card.value}</div>
              <div className="text-xs font-medium text-blue-300 mt-2">{card.subText}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[#2A4365] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {["NO","KELAS","TINGKAT","JURUSAN","WALI KELAS","NAIK KELAS","TIDAK NAIK","BELUM DIPROSES","STATUS","AKSI"].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 text-[13px] text-gray-500">{row.no}</td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-semibold text-gray-800">{row.kelas}</p>
                    <p className="text-[11px] text-gray-400">{row.kode}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">{row.tingkat}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${row.jurusanColor}`}>{row.jurusan}</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-700">{row.wali}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-green-600">{row.naik}</span>
                      <span className="text-[13px] text-gray-400">/ {row.total}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: 50 }}>
                        <div className="h-full bg-green-400 rounded-full" style={{ width: `${row.total > 0 ? Math.round((row.naik / row.total) * 100) : 0}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-bold text-red-500">{row.tidakNaik}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-500">{row.belum}</td>
                  <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-5 py-4">
                    {row.status === "Belum Diproses" ? (
                      <button onClick={() => { setSelectedClass(row); setView("process"); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-lg text-[12px] font-bold transition-colors">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        Proses
                      </button>
                    ) : (
                      <button onClick={() => { setSelectedClass(row); setView("detail"); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-[12px] font-bold transition-colors">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-[13px] text-gray-500">Menampilkan {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length} kelas</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                  p === page ? "bg-[#2A4365] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
      {/* Kriteria Modal */}
      {showCriteria && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-gray-900">Kriteria Kenaikan Kelas</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">Tahun Ajaran 2023/2024</p>
              </div>
            </div>
            <div className="space-y-1 mb-5">
              {[
                { label: "Nilai rata-rata minimum", value: "≥ 70", color: "bg-green-50 text-green-600 border border-green-100" },
                { label: "Kehadiran minimum", value: "≥ 80%", color: "bg-blue-50 text-blue-600 border border-blue-100" },
                { label: "Nilai per mata pelajaran minimum", value: "≥ 60", color: "bg-purple-50 text-purple-600 border border-purple-100" },
                { label: "Maks. mapel nilai di bawah KKM", value: "≤ 2 mapel", color: "bg-amber-50 text-amber-600 border border-amber-100" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span className="text-[14px] text-gray-600">{item.label}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[13px] font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              </svg>
              <p className="text-[13px] text-amber-700 leading-relaxed">
                Siswa yang memenuhi semua kriteria di atas akan otomatis direkomendasikan naik kelas. Keputusan akhir tetap pada wali kelas.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCriteria(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-[14px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Tutup
              </button>
              <button onClick={() => { setShowCriteria(false); setView("criteria"); }} className="flex-1 py-3 rounded-xl bg-[#2A4365] hover:bg-[#1A365D] text-white text-[14px] font-bold transition-colors">
                Edit Kriteria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradePromotion;
