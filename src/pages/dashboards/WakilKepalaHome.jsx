import React, { useState, useEffect } from "react";
import { getBeasiswa, getDanaBeasiswa, getOperasional } from "../../api/finance";



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

<<<<<<< HEAD
// --- Dummy Data (Akademik) ---
const stats = [
  { label: "Mata Pelajaran Aktif", val: 12, sub: "Kurikulum berjalan" },
  { label: "Jadwal Aktif", val: 38, sub: "Minggu ini" },
  { label: "Konflik Jadwal", val: 2, sub: "Perlu diselesaikan" },
=======
const initJadwal = [
  { id: 1, mapel: "Matematika", guru: "Bpk. Hendra", kelas: "VIII IPA 1", hari: "Senin", jam: "07:00", ruang: "R. 01", semester: "Genap 2023/2024" },
  { id: 2, mapel: "Fisika", guru: "Bpk. Hendra", kelas: "VIII IPA 2", hari: "Senin", jam: "08:00", ruang: "Lab Fisika", semester: "Genap 2023/2024" },
  { id: 3, mapel: "Kimia", guru: "Ibu Rina", kelas: "VIII IPA 1", hari: "Selasa", jam: "07:00", ruang: "Lab Kimia", semester: "Genap 2023/2024" },
  { id: 4, mapel: "B. Indonesia", guru: "Ibu Sari", kelas: "VII IPS 1", hari: "Rabu", jam: "10:00", ruang: "R. 12", semester: "Genap 2023/2024" },
  { id: 5, mapel: "B. Inggris", guru: "Ibu Lena", kelas: "VII IPA 1", hari: "Kamis", jam: "09:00", ruang: "R. 03", semester: "Genap 2023/2024" },
>>>>>>> 90d46930a3627f280f940e78ecffe693c345205a
];

const detectConflicts = (jadwal) => {
  const conflicts = [];
  for (let i = 0; i < jadwal.length; i++) {
    for (let j = i + 1; j < jadwal.length; j++) {
      const a = jadwal[i], b = jadwal[j];
      if (a.hari === b.hari && a.jam === b.jam) {
        if (a.guru === b.guru) conflicts.push({ guru: a.guru, mapel: a.mapel, kelas: `${a.kelas} & ${b.kelas}`, waktu: `${a.hari}, ${a.jam}`, ruang: a.ruang });
        else if (a.ruang === b.ruang) conflicts.push({ guru: `${a.guru} & ${b.guru}`, mapel: a.mapel, kelas: `${a.kelas} & ${b.kelas}`, waktu: `${a.hari}, ${a.jam}`, ruang: a.ruang });
        else if (a.kelas === b.kelas) conflicts.push({ guru: `${a.guru} & ${b.guru}`, mapel: a.mapel, kelas: a.kelas, waktu: `${a.hari}, ${a.jam}`, ruang: `${a.ruang} & ${b.ruang}` });
      }
    }
  }
  return conflicts;
};

// --- Dummy Data (Akademik) ---
const recentCurriculum = [
  { mapel: "Matematika", kelas: "IX-A", tingkat: "SMP", status: "Aktif" },
  { mapel: "IPA Terpadu", kelas: "VIII-A", tingkat: "SMP", status: "Aktif" },
  { mapel: "IPS Terpadu", kelas: "VII-B", tingkat: "SMP", status: "Revisi" },
  { mapel: "Bahasa Inggris", kelas: "VII-A", tingkat: "SMP", status: "Aktif" },
];

<<<<<<< HEAD
const conflicts = [
  { guru: "Bpk. Hendra", mapel: "IPA", kelas: "VIII-A & VIII-B", waktu: "Senin, 08:00", ruang: "Lab IPA" },
  { guru: "Ibu Sari", mapel: "B. Indonesia", kelas: "VII-A & VII-B", waktu: "Rabu, 10:00", ruang: "R. 12" },
];

=======
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
  { name: 'Juni', nominal: initialPengeluaranData.reduce((acc, curr) => acc + curr.nominal, 0) + 12000000 }
];
>>>>>>> 90d46930a3627f280f940e78ecffe693c345205a


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
  const [currentPemasukanData, setCurrentPemasukanData] = useState([]);
  const [currentPengeluaranData, setCurrentPengeluaranData] = useState([]);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

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
        const ops = await getOperasional();
        if (Array.isArray(ops)) {
          setCurrentPemasukanData(ops.filter(d => d.tipe === 'pemasukan'));
          setCurrentPengeluaranData(ops.filter(d => d.tipe === 'pengeluaran'));
        }
      } catch (e) {
        console.error("Error loading getOperasional in WakilKepalaHome:", e);
      }
    };
    loadData();
  }, []);

  const penyaluranBeasiswaList = [];
  programList.forEach(p => {
    if (p.status === 'Aktif') {
      const amountStr = String(p.amount || "0").replace(/[^0-9]/g, '');
      const amountNum = parseInt(amountStr, 10) || 0;
      const disalurkan = (p.penerima || []).reduce((s, r) => {
        const rNominal = r.nominal ? Number(r.nominal) : amountNum;
        return s + (rNominal || 0);
      }, 0);
      penyaluranBeasiswaList.push({ nominal: disalurkan });
    }
  });
  const totalPenyaluranBeasiswa = penyaluranBeasiswaList.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const totalPengeluaranTahunan = currentPengeluaranData.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0) + totalPenyaluranBeasiswa;
  const totalBeasiswa = danaBeasiswaList.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const totalPemasukanTahunan = currentPemasukanData.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0) + totalBeasiswa;

  // Load jadwal from localStorage or use initial
  const storedJadwal = localStorage.getItem("wakil_jadwal");
  const jadwal = storedJadwal ? JSON.parse(storedJadwal) : initJadwal;
  
  // Detect real conflicts
  const currentConflicts = detectConflicts(jadwal);
  
  // Dynamic stats
  const stats = [
    { label: "Mata Pelajaran Aktif", val: 12, sub: "Kurikulum berjalan", color: "text-blue-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    { label: "Jadwal Aktif", val: jadwal.length, sub: "Total jadwal di sistem", color: "text-green-200", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Konflik Jadwal - Alert */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
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
                    <div key={i} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-amber-50/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">{c.guru} — {c.mapel}</p>
                          <p className="text-[12px] text-gray-500 mt-0.5">Kelas: {c.kelas} | Ruang: {c.ruang}</p>
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
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-gray-800">📚 Kurikulum Terbaru</h3>
                <button onClick={() => onNavigate("Kelola Kurikulum")} className="text-[12px] font-bold text-[#1F3A5F] hover:underline bg-transparent border-none cursor-pointer">Kelola →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-50">
                    <tr>
                      {["MATA PELAJARAN", "KELAS", "TINGKAT", "STATUS"].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentCurriculum.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-[13px] font-semibold text-gray-800 whitespace-nowrap">{r.mapel}</td>
                        <td className="px-5 py-3 text-[13px] text-gray-600 whitespace-nowrap">{r.kelas}</td>
                        <td className="px-5 py-3 text-[13px] text-gray-500 whitespace-nowrap">{r.tingkat}</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === "Aktif" ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: "Total Pemasukan Tahunan",
              value: formatRupiah(totalPemasukanTahunan),
              subText: `Akumulasi Tahun Ajaran ${tahunAjaran}`
            },
            {
              title: "Total Pengeluaran Tahunan",
              value: formatRupiah(totalPengeluaranTahunan),
              subText: `Akumulasi Tahun Ajaran ${tahunAjaran}`
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
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-[#1F3A5F]">Pengeluaran Terbaru</h2>
                <button 
                  onClick={() => onNavigate && onNavigate("Riwayat Pengeluaran")}
                  className="text-[12px] font-bold text-[#1F3A5F] hover:underline cursor-pointer bg-transparent border-none"
                >
                  Lihat Semua →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
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
                        <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">{tx.tanggal}</td>
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

      {/* Modal Detail Pengeluaran */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
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
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
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

              <div className="flex justify-between items-start">
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
    </div>
  );
};

export default WakilKepalaHome;
