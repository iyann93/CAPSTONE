import React, { useState, useEffect } from "react";
import { getBeasiswa, getDanaBeasiswa, getOperasional } from "../../api/finance";
import { getGlobalFinanceSummary } from "../../utils/financeHelpers";
import { getAnnouncements } from "../../utils/announcementStore";



// --- Icons ---
const IconX = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- Dummy Data (Akademik) ---
const stats = [
  { label: "Mata Pelajaran Aktif", val: 12, sub: "Kurikulum berjalan" },
  { label: "Jadwal Aktif", val: 38, sub: "Minggu ini" },
  { label: "Konflik Jadwal", val: 2, sub: "Perlu diselesaikan" },
];

const initJadwal = [
  { id: 1, mapel: "Matematika", guru: "Bpk. Hendra", kelas: "VIII IPA 1", hari: "Senin", jam: "07:00", ruang: "R. 01", semester: "Genap 2023/2024" },
  { id: 2, mapel: "Fisika", guru: "Bpk. Hendra", kelas: "VIII IPA 2", hari: "Senin", jam: "08:00", ruang: "Lab Fisika", semester: "Genap 2023/2024" },
  { id: 3, mapel: "Kimia", guru: "Ibu Rina", kelas: "VIII IPA 1", hari: "Selasa", jam: "07:00", ruang: "Lab Kimia", semester: "Genap 2023/2024" },
  { id: 4, mapel: "B. Indonesia", guru: "Ibu Sari", kelas: "VII IPS 1", hari: "Rabu", jam: "10:00", ruang: "R. 12", semester: "Genap 2023/2024" },
  { id: 5, mapel: "B. Inggris", guru: "Ibu Lena", kelas: "VII IPA 1", hari: "Kamis", jam: "09:00", ruang: "R. 03", semester: "Genap 2023/2024" },
];

const detectConflicts = (jadwal) => {
  const conflicts = [];
  for (let i = 0; i < jadwal.length; i++) {
    for (let j = i + 1; j < jadwal.length; j++) {
      const a = jadwal[i], b = jadwal[j];
      if (a.hari === b.hari && a.jam_mulai === b.jam_mulai) {
        if (a.guru_id === b.guru_id) conflicts.push({ type: "guru", guru: a.guru_nama, mapel: a.nama_mapel, kelas: `${a.nama_kelas} & ${b.nama_kelas}`, waktu: `${a.hari}, ${a.jam_mulai}` });
        else if (a.kelas_id === b.kelas_id) conflicts.push({ type: "kelas", guru: `${a.guru_nama} & ${b.guru_nama}`, mapel: a.nama_mapel, kelas: a.nama_kelas, waktu: `${a.hari}, ${a.jam_mulai}` });
      }
    }
  }
  return conflicts;
};

// Fetch kurikulum from backend instead of dummy data

// Fetch kurikulum from backend instead of dummy data

// --- Dummy Data (Keuangan) ---
const chartData = [
  { name: 'Juli', nominal: 15000000 },
  { name: 'Agustus', nominal: 18000000 },
  { name: 'September', nominal: 17500000 },
  { name: 'Oktober', nominal: 19000000 },
  { name: 'November', nominal: 16500000 },
  { name: 'Desember', nominal: 22000000 },
  { name: 'Januari', nominal: 20000000 },
  { name: 'Februari', nominal: 18500000 },
  { name: 'Maret', nominal: 19500000 },
  { name: 'April', nominal: 18000000 },
  { name: 'Mei', nominal: 18500000 },
  { name: 'Juni', nominal: 12000000 }
];


const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};



const WakilKepalaHome = ({ user, onNavigate }) => {
  const [tahunAjaran, setTahunAjaran] = useState("2025/2026");
  const [bulan, setBulan] = useState("Mei");
  
  const [programList, setProgramList] = useState([]);
  const [danaBeasiswaList, setDanaBeasiswaList] = useState([]);
  const [currentPengeluaranData, setCurrentPengeluaranData] = useState([]);
  const [currentPemasukanData, setCurrentPemasukanData] = useState([]);
  const [globalFinance, setGlobalFinance] = useState({ totalPemasukan: 0, totalPengeluaran: 0 });
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [liveAnn, setLiveAnn] = useState([]);

  useEffect(() => {
    setLiveAnn(getAnnouncements().slice(0, 3));
  }, []);

  const [recentCurriculumList, setRecentCurriculumList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const loadProgramsFromStorage = () => {
      try {
        const raw = localStorage.getItem('capstone_program_beasiswa');
        return raw ? JSON.parse(raw) : [];
      } catch (_) { return []; }
    };

    const loadData = async () => {
      try {
        const resKurikulum = await getBeasiswa().then(() => {}).catch(() => {}); // ignore dummy
      } catch(e) {}
      
      try {
        const { default: api } = await import('../../api/axios');
        const [resKurikulum, resJadwal] = await Promise.all([
          api.get('/kurikulum?limit=5'),
          api.get('/jadwal-pelajaran?limit=1000')
        ]);
        if (resKurikulum.data?.data) {
          setRecentCurriculumList(resKurikulum.data.data);
        }
        if (resJadwal.data?.data) {
          const INVERSE_HARI_MAP = { 1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu", 7: "Minggu" };
          const jadwalData = resJadwal.data.data.map(j => ({ ...j, hari: INVERSE_HARI_MAP[j.hari] || j.hari }));
          setJadwalList(jadwalData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      try {
        const programs = await getBeasiswa();
        setProgramList(Array.isArray(programs) ? programs : []);
      } catch (e) {
        console.error("Error loading getBeasiswa in WakilKepalaHome:", e);
        setProgramList(loadProgramsFromStorage());
      }

      try {
        const dana = await getDanaBeasiswa();
        setDanaBeasiswaList(Array.isArray(dana) ? dana : []);
      } catch (e) {
        console.error("Error loading getDanaBeasiswa in WakilKepalaHome:", e);
      }

      try {
        const operasional = await getOperasional();
        if (Array.isArray(operasional)) {
          setCurrentPengeluaranData(operasional.filter(d => d.tipe === 'pengeluaran'));
          setCurrentPemasukanData(operasional.filter(d => d.tipe === 'pemasukan'));
        }
      } catch (e) {
        console.error("Error loading getOperasional in WakilKepalaHome:", e);
      }

      try {
        const globalSummary = await getGlobalFinanceSummary();
        setGlobalFinance(globalSummary);
      } catch (e) {
        console.error("Error loading global finance:", e);
      }

      try {
        const op = await getOperasional();
        setCurrentPengeluaranData(Array.isArray(op) ? op : []);
      } catch (e) {
        console.error("Error loading getOperasional:", e);
      }
    };
    loadData();
  }, []);

  // Pemasukan difilter khusus yang tipe pemasukan dari form Operasional (biasanya untuk Dana BOS)
  const totalPemasukanTahunan = currentPemasukanData.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const totalPengeluaranTahunan = currentPengeluaranData.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);

  const formatDateIndo = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Detect real conflicts
  const currentConflicts = detectConflicts(jadwalList);
  
  // Dynamic stats
  const stats = [
    { label: "Mata Pelajaran Aktif", val: recentCurriculumList.filter(c => c.status === "Aktif").length, sub: "Kurikulum berjalan", color: "text-blue-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    { label: "Jadwal Aktif", val: jadwalList.length, sub: "Total jadwal di sistem", color: "text-green-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
    { label: "Konflik Jadwal", val: currentConflicts.length, sub: currentConflicts.length > 0 ? "Perlu diselesaikan" : "Aman", color: currentConflicts.length > 0 ? "text-amber-200" : "text-green-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fadeIn bg-[#F5F7FA] min-h-full font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1F3A5F] tracking-tight">Dashboard Wakil Kepala Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Monitoring seluruh aktivitas akademik dan operasional sekolah.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 text-[#1F3A5F] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN AKADEMIK */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#1F3A5F]">Monitoring Akademik &amp; Kurikulum</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
              <div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{s.label}</div>
                <div className="text-xl lg:text-2xl xl:text-[22px] font-black text-white">{s.val}</div>
                <div className="text-[10px] font-medium text-blue-300 mt-2">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-3 gap-5">
          {/* Konflik Jadwal - Alert */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentConflicts.length > 0 ? (
                    <>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/>
                      <h3 className="text-[15px] font-bold text-gray-800">⚠️ Konflik Jadwal Aktif</h3>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"/>
                      <h3 className="text-[15px] font-bold text-gray-800">✅ Jadwal Aman</h3>
                    </>
                  )}
                </div>
                <button onClick={() => onNavigate("Jadwal Pelajaran")} className="text-[12px] font-bold text-[#1F3A5F] hover:underline bg-transparent border-none cursor-pointer">Kelola Jadwal →</button>
              </div>
              <div className="divide-y divide-gray-50">
                {currentConflicts.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-[13px] font-semibold text-gray-400">Tidak ada konflik jadwal saat ini.</p>
                  </div>
                ) : (
                  currentConflicts.map((c, i) => (
                    <div key={i} className="px-5 py-4 flex flex-wrap items-start justify-between gap-4 hover:bg-amber-50/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">{c.guru} — {c.mapel}</p>
                          <p className="text-[12px] text-gray-500 mt-0.5">Kelas: {c.kelas}</p>
                          <p className="text-[12px] text-amber-600 font-semibold mt-0.5">{c.waktu}</p>
                        </div>
                      </div>
                      <button onClick={() => onNavigate("Jadwal Pelajaran")} className="flex-shrink-0 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border-none">
                        Perbaiki
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Kurikulum terbaru */}
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between">
                <h3 className="text-[15px] font-bold text-gray-800">📚 Kurikulum Terbaru</h3>
                <button onClick={() => onNavigate("Kelola Kurikulum")} className="text-[12px] font-bold text-[#1F3A5F] hover:underline bg-transparent border-none cursor-pointer">Kelola →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="border-b border-gray-50">
                    <tr>
                      {["KODE", "NAMA KURIKULUM", "TAHUN AJARAN", "STATUS"].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentCurriculumList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-5 py-8 text-center text-[13px] font-semibold text-gray-400">Belum ada data kurikulum.</td>
                      </tr>
                    ) : (
                      recentCurriculumList.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3 text-[13px] font-semibold text-gray-800 whitespace-nowrap">{r.kode_kurikulum}</td>
                          <td className="px-5 py-3 text-[13px] text-gray-600 whitespace-nowrap">{r.nama_kurikulum}</td>
                          <td className="px-5 py-3 text-[13px] text-gray-500 whitespace-nowrap">{r.tahun_ajaran_nama || "-"}</td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === "Aktif" ? "bg-green-50 text-green-600 border border-green-100" : r.status === "Draft" ? "bg-gray-100 text-gray-600 border border-gray-200" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions (Academic) */}
          <div className="space-y-4">
            <div className="bg-[#1A3D63] rounded-[16px] p-5 space-y-3">
              <p className="text-[12px] font-bold text-blue-300 uppercase tracking-wider">Tindakan Akademik Cepat</p>
              {[
                { label: "Tambah Jadwal Baru", menu: "Jadwal Pelajaran", icon: "+" },
                { label: "Kelola Kurikulum", menu: "Kelola Kurikulum", icon: "📚" },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(a.menu)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[13px] font-semibold transition-colors text-left border-none cursor-pointer"
                >
                  <span className="text-[16px]">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BAGIAN KEUANGAN & OPERASIONAL */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-[#1F3A5F]">Monitoring Operasional &amp; Keuangan</h2>

        {/* Ringkasan Operasional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: "Total Pemasukan Dana BOS",
              value: formatRupiah(totalPemasukanTahunan),
              subText: `Akumulasi Tahun Ajaran 2025/2026`
            },
            {
              title: "Total Operasional Tahunan",
              value: formatRupiah(totalPengeluaranTahunan),
              subText: `Akumulasi Tahun Ajaran 2025/2026`
            }
          ].map((card, i) => (
            <div key={i} className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
              <div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{card.title}</div>
                <div className="text-xl lg:text-2xl xl:text-[22px] font-black text-white">{card.value}</div>
                <div className="text-[10px] font-medium text-blue-300 mt-2">{card.subText}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Recent Expenditures */}
          <div className="space-y-6">
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 flex flex-wrap items-center justify-between">
                <h2 className="text-[16px] font-bold text-[#1F3A5F]">Pengeluaran Terbaru</h2>
                <button 
                  onClick={() => {
                    localStorage.setItem('wakil_sarpras_tab', 'pengeluaran');
                    if (onNavigate) onNavigate("Sarana & Prasarana");
                  }}
                  className="text-[12px] font-bold text-[#1F3A5F] hover:underline cursor-pointer bg-transparent border-none"
                >
                  Lihat Riwayat Pengeluaran →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama Pengeluaran</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jenis Pengeluaran</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nominal</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentPengeluaranData.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">{(tx.tanggal.includes('T') || tx.tanggal.includes('-')) ? formatDateIndo(tx.tanggal) : tx.tanggal}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-gray-800 whitespace-nowrap">{tx.nama}</td>
                        <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium text-[11px]">
                            {tx.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-bold text-[#1F3A5F] whitespace-nowrap">{formatRupiah(tx.nominal)}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button 
                            onClick={() => setSelectedDetailItem(tx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1F3A5F] rounded-lg text-[11px] font-bold transition-colors border-none cursor-pointer"
                          >
                            <EyeIcon /> Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pengumuman Sekolah Terbaru */}
      {liveAnn.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-xl font-bold text-[#1F3A5F]">Pengumuman Sekolah Terbaru</h2>
            <button
              onClick={() => onNavigate && onNavigate("Pengumuman Sekolah")}
              className="text-[12px] font-bold text-[#1F3A5F] hover:underline cursor-pointer bg-transparent border-none"
            >
              Lihat Semua →
            </button>
          </div>
          <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 divide-y divide-gray-50 overflow-hidden">
            {liveAnn.map(ann => (
              <div
                key={ann.id}
                onClick={() => onNavigate && onNavigate("Pengumuman Sekolah")}
                className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  ann.importance === "Penting" ? "bg-red-100" : "bg-blue-100"
                }`}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke={ann.importance === "Penting" ? "#dc2626" : "#2563eb"} strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] font-bold text-gray-800 truncate">{ann.title}</p>
                    {ann.importance === "Penting" && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded flex-shrink-0">PENTING</span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-500 line-clamp-1">{ann.desc}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-400">{ann.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"/>
                    <span className="text-[11px] text-blue-500 font-medium">{ann.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal Detail Pengeluaran */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Detail Pengeluaran</h2>
                <p className="text-[11px] text-gray-500 mt-1">Informasi lengkap transaksi arus kas.</p>
              </div>
              <button 
                onClick={() => setSelectedDetailItem(null)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-xl transition-colors border border-gray-200 cursor-pointer"
              >
                <IconX />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tanggal</div>
                  <div className="text-sm font-semibold text-gray-800">{selectedDetailItem.tanggal}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Kategori</div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">{selectedDetailItem.jenis || selectedDetailItem.kategori}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Pengeluaran</div>
                <div className="text-sm font-bold text-gray-800">{selectedDetailItem.nama}</div>
              </div>

              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nominal</div>
                  <div className="text-lg font-black text-emerald-600">{formatRupiah(selectedDetailItem.nominal)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sumber Dana</div>
                  <div className="text-sm font-semibold text-gray-700">{selectedDetailItem.sumberDana || "-"}</div>
                </div>
              </div>
              
              {selectedDetailItem.keterangan && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Keterangan Tambahan</div>
                  <div className="text-[13px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedDetailItem.keterangan}</div>
                </div>
              )}

              {selectedDetailItem.kategori !== 'Beasiswa' && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Bukti Transaksi</div>
                  {selectedDetailItem.bukti && selectedDetailItem.bukti.length > 0 ? (
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {selectedDetailItem.bukti.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div 
                            className="w-10 h-10 rounded-lg bg-white text-blue-600 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer border border-gray-200 hover:opacity-80 transition-opacity shadow-sm"
                            onClick={() => {
                              setSelectedPreviewFile(file);
                              setShowPreviewModal(true);
                            }}
                            title="Klik untuk melihat pratinjau penuh"
                          >
                            {file.match(/\.(jpg|jpeg|png|gif)$/i) || file.startsWith('data:image') ? (
                              <img src={file} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-gray-800 truncate">{file.startsWith('data:') ? 'Bukti Transaksi' : file}</div>
                            <div className="text-[10px] text-gray-500">Klik ikon gambar untuk melihat lampiran</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic">Tidak ada bukti transaksi yang dilampirkan.</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setSelectedDetailItem(null)}
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Bukti Pembayaran */}
      {showPreviewModal && selectedPreviewFile && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 truncate max-w-[200px] sm:max-w-[300px]">
                    {typeof selectedPreviewFile === 'string' 
                      ? (selectedPreviewFile.startsWith('data:') ? 'Bukti Transaksi' : selectedPreviewFile) 
                      : selectedPreviewFile?.name}
                  </h3>
                  <p className="text-[10px] text-gray-500">Pratinjau Dokumen</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedPreviewFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-xl transition-colors border border-gray-200 cursor-pointer shrink-0"
              >
                <IconX />
              </button>
            </div>
            
            <div className="bg-gray-100 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
              {selectedPreviewFile && typeof selectedPreviewFile !== 'string' && selectedPreviewFile.type?.includes('image') ? (
                <img src={selectedPreviewFile.preview || URL.createObjectURL(selectedPreviewFile)} alt="Preview Bukti" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
              ) : selectedPreviewFile && typeof selectedPreviewFile === 'string' && (selectedPreviewFile.match(/\.(jpg|jpeg|png|gif)$/i) || selectedPreviewFile.startsWith('data:image')) ? (
                <img src={selectedPreviewFile} alt="Preview Bukti" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
              ) : selectedPreviewFile && typeof selectedPreviewFile !== 'string' && selectedPreviewFile.type?.includes('pdf') ? (
                <object data={selectedPreviewFile.preview || URL.createObjectURL(selectedPreviewFile)} type="application/pdf" className="w-full h-[70vh] rounded-lg shadow-sm">
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-gray-500 text-sm font-medium">Browser Anda mungkin tidak mendukung pratinjau langsung PDF.</p>
                    <a href={selectedPreviewFile.preview || URL.createObjectURL(selectedPreviewFile)} target="_blank" rel="noreferrer" className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">Unduh / Buka PDF di Tab Baru</a>
                  </div>
                </object>
              ) : selectedPreviewFile && typeof selectedPreviewFile === 'string' && (selectedPreviewFile.toLowerCase().includes('.pdf') || selectedPreviewFile.startsWith('data:application/pdf')) ? (
                <object data={selectedPreviewFile} type="application/pdf" className="w-full h-[70vh] rounded-lg shadow-sm">
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-gray-500 text-sm font-medium">Browser Anda mungkin tidak mendukung pratinjau langsung PDF.</p>
                    <a href={selectedPreviewFile} target="_blank" rel="noreferrer" className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">Unduh / Buka PDF di Tab Baru</a>
                  </div>
                </object>
              ) : (
                <>
                  <div className="w-24 h-24 mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-400 text-center max-w-[80%] break-words">Menampilkan Pratinjau: {typeof selectedPreviewFile === 'string' ? selectedPreviewFile : selectedPreviewFile?.name}</p>
                  <p className="text-xs text-gray-400 mt-2 text-center">Pratinjau khusus untuk file gambar (JPG/PNG). Dokumen PDF akan dapat dilihat saat diunduh.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WakilKepalaHome;
