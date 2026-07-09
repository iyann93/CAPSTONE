import React, { useState, useEffect } from "react";
import SPPDonutChart from "../../components/SPPDonutChart";
import { getBeasiswaSummary, getSppYearlySummary } from "../../utils/financeHelpers";
import { getTagihan, getPembayaran, getOperasional, getBeasiswa, getDanaBeasiswa } from "../../api/finance";
import { getAllSlips, getEmployees } from "../../api/payroll";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";


const getPayrollSummary = async () => {
  try {
    const [slipsRes, employees] = await Promise.all([
      getAllSlips({ limit: 1000 }).catch(() => ({ data: [] })),
      getEmployees().catch(() => [])
    ]);
    const slips = Array.isArray(slipsRes?.data) ? slipsRes.data : [];
    const employeeList = Array.isArray(employees) ? employees : [];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const currentMonthSlips = slips.filter((slip) => {
      const bulan = Number(slip?.bulan || slip?.periode_bulan || 0);
      const tahun = Number(slip?.tahun || slip?.periode_tahun || 0);
      return bulan === currentMonth && tahun === currentYear;
    });

    const realizedSlips = currentMonthSlips.filter((slip) => {
      const status = String(slip?.status || "").trim().toLowerCase();
      return ["dibayar", "disetujui", "approved", "transferred", "sudah ditransfer", "sudah transfer"].includes(status);
    });

    const realisasi = realizedSlips.reduce((sum, slip) => sum + (Number(slip?.gaji_bersih) || 0), 0);
    const persentase = currentMonthSlips.length > 0 ? Math.round((realizedSlips.length / currentMonthSlips.length) * 100) : 0;

    return {
      persentase,
      realisasi,
      jumlahPegawai: realizedSlips.length,
      totalPegawai: currentMonthSlips.length || 23
    };
  } catch (err) {
    console.error("Gagal load realisasi gaji:", err);
    return {
      persentase: 0,
      realisasi: 0,
      jumlahPegawai: 0,
      totalPegawai: 0
    };
  }
};

const MonitoringKeuanganKepsek = ({ user, onNavigate }) => {
  const [selectedYear, setSelectedYear] = useState("2025/2026");

  const [data, setData] = useState({
    pemasukan: 0,
    saldo: 0
  });

  const [sppData, setSppData] = useState({
    totalTagihan: 0, terbayar: 0, tunggakan: 0, countVerifikasi: 0, persentase: 0, countLunas: 0, countBelum: 0,
    tunggakanPerKelas: []
  });
  const [sppLoaded, setSppLoaded] = useState(false);

  const [beasiswaSummary, setBeasiswaSummary] = useState({
    penerimaAktif: 0,
    totalDanaMasuk: 0,
    tersalurkan: 0,
    persentase: 0
  });

  const [gajiSummary, setGajiSummary] = useState({
    persentase: 0,
    realisasi: 0,
    jumlahPegawai: 0,
    totalPegawai: 0
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sppSummary, beasiswaSummaryData, payrollSummaryData] = await Promise.all([
          getSppYearlySummary(selectedYear),
          getBeasiswaSummary(),
          getPayrollSummary()
        ]);

        // Show yearly summary immediately for faster display, then override with per-month data
        let finalSpp = sppSummary || {};
        setSppData(finalSpp);
        setSppLoaded(true);
        setBeasiswaSummary(beasiswaSummaryData);
        setGajiSummary(payrollSummaryData);

        // Also compute Total Pengeluaran the same way Bendahara does: operasional pengeluaran + penyaluran beasiswa
        try {
          const [operasionalRes, beasiswaRes, pembayaranRes, danaBeasiswaRes] = await Promise.all([
            getOperasional().catch(() => ({ data: [] })),
            getBeasiswa().catch(() => ({ data: [] })),
            getPembayaran({ limit: 10000 }).catch(() => ({ data: [] })),
            getDanaBeasiswa().catch(() => ({ data: [] }))
          ]);
          const operasional = Array.isArray(operasionalRes.data || operasionalRes) ? (operasionalRes.data || operasionalRes) : [];
          const beasiswaListRaw = Array.isArray(beasiswaRes.data || beasiswaRes) ? (beasiswaRes.data || beasiswaRes) : [];
          const pembayaran = Array.isArray(pembayaranRes.data || pembayaranRes) ? (pembayaranRes.data || pembayaranRes) : [];
          const danaBeasiswaList = Array.isArray(danaBeasiswaRes.data || danaBeasiswaRes) ? (danaBeasiswaRes.data || danaBeasiswaRes) : [];

          const totalOperasionalSaja = operasional.filter(d => d.tipe === 'pengeluaran').reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
          const totalOperasionalMasuk = operasional.filter(d => d.tipe === 'pemasukan').reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
          const totalBeasiswa = danaBeasiswaList.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
          const totalSppTahunan = pembayaran.reduce((acc, curr) => {
            const amount = Number(curr.jumlah_bayar || 0);
            return acc + amount;
          }, 0);

          // Merge backend beasiswa data with any saved programs in localStorage similar to BendaharaDashboard
          let backendList = beasiswaListRaw || [];
          let savedPrograms = [];
          try {
            const raw = localStorage.getItem('capstone_program_beasiswa');
            if (raw) savedPrograms = JSON.parse(raw);
          } catch (e) { savedPrograms = []; }

          // Group backend penerima by nama_beasiswa
          const grouped = {};
          backendList.forEach(b => {
            if (!grouped[b.nama_beasiswa]) grouped[b.nama_beasiswa] = { penerima: [] };
            grouped[b.nama_beasiswa].penerima.push({
              id: b.id,
              siswa_id: b.siswa_id,
              siswa_nama: b.siswa_nama || b.nama_siswa,
              nis: b.nis,
              nama_kelas: b.nama_kelas || b.kelas || "-",
              nama_beasiswa: b.nama_beasiswa,
              nominal: b.nominal,
              periode: b.periode,
              status: b.status,
              tanggal_mulai: b.tanggal_mulai,
              tanggal_selesai: b.tanggal_selesai
            });
          });

          // Start from saved programs metadata and merge penerima from backend
          const dedupMap = new Map();
          (savedPrograms || []).forEach(p => {
            const key = (p.title || "").trim().toLowerCase();
            if (!dedupMap.has(key)) dedupMap.set(key, { ...p, penerima: [] });
          });

          const mergedPrograms = Array.from(dedupMap.values()).map(prog => {
            const key = (prog.title || "").trim().toLowerCase();
            const matchedGroupKey = Object.keys(grouped).find(k => k.trim().toLowerCase() === key);
            return {
              ...prog,
              title: matchedGroupKey || prog.title,
              penerima: matchedGroupKey ? grouped[matchedGroupKey].penerima : (prog.penerima || [])
            };
          });

          // Also include any backend programs that weren't in savedPrograms
          Object.keys(grouped).forEach(k => {
            const key = k.trim().toLowerCase();
            if (!dedupMap.has(key)) {
              mergedPrograms.push({ title: k, penerima: grouped[k].penerima, status: 'Aktif', amount: '0' });
            }
          });

          let totalPenyaluranBeasiswa = 0;
          mergedPrograms.forEach(p => {
            if (p.status === 'Aktif') {
              const amountStr = String(p.amount || p.nominal || "0").replace(/[^0-9]/g, '');
              const amountNum = parseInt(amountStr, 10) || 0;
              const activePenerima = (p.penerima || []).filter(r => !r.status || String(r.status).toLowerCase() === 'aktif');
              const disalurkan = activePenerima.reduce((s, r) => {
                const rNominal = r.nominal ? Number(r.nominal) : amountNum;
                return s + (rNominal || 0);
              }, 0);
              totalPenyaluranBeasiswa += disalurkan;
            }
          });

          const totalPengeluaranTahunan = totalOperasionalSaja + totalPenyaluranBeasiswa;
          const totalPemasukanTahunan = totalSppTahunan + totalOperasionalMasuk + totalBeasiswa;

          setData(prev => ({
            ...prev,
            pemasukan: totalPemasukanTahunan,
            pengeluaran: totalPengeluaranTahunan,
            saldo: totalPemasukanTahunan - totalPengeluaranTahunan
          }));
        } catch (e) {
          // ignore - keep existing summary if this fails
          console.error('Gagal sinkronisasi total pengeluaran:', e);
        }

        // Additional: compute current-month tagihan using same logic as Bendahara dashboard
        try {
          const [tagihanRes, pembayaranRes] = await Promise.all([
            getTagihan({ limit: 5000 }).catch(() => ({ data: [] })),
            getPembayaran().catch(() => ({ data: [] }))
          ]);
          const tagihan = Array.isArray(tagihanRes.data || tagihanRes) ? (tagihanRes.data || tagihanRes) : [];
          const pembayaran = Array.isArray(pembayaranRes.data || pembayaranRes) ? (pembayaranRes.data || pembayaranRes) : [];

          const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
          const currentMonthName = months[new Date().getMonth()];

          const monthBills = tagihan.filter(t => {
            const bulanNum = Number(t.bulan);
            const bulanNama = (!isNaN(bulanNum) && bulanNum >= 1 && bulanNum <= 12) ? months[bulanNum - 1] : (t.bulan || '');
            return bulanNama === currentMonthName || (t.period && String(t.period).startsWith(currentMonthName));
          });

          const totalSiswaBulanIni = monthBills.length;

          const normalizeMonthName = (val) => {
            if (!val && val !== 0) return '';
            const num = Number(val);
            if (!isNaN(num) && num >= 1 && num <= 12) return months[num - 1];
            const s = String(val || '').trim();
            // if it's already a month name, try to match by partial
            for (let m of months) {
              if (m.toLowerCase() === s.toLowerCase() || s.toLowerCase().startsWith(m.toLowerCase())) return m;
            }
            return s;
          };

          const lunasPayments = pembayaran.filter(p => {
            const pMonthName = normalizeMonthName(p.bulan || p.month || p.period);
            const periodStr = String(p.period || '').trim();
            const status = String(p.status || '').toLowerCase();
            const paidAmt = Number(p.jumlah_bayar || p.nominal_dibayar || p.nominal || 0);
            const monthMatch = (pMonthName && pMonthName.toLowerCase() === currentMonthName.toLowerCase()) || (periodStr && periodStr.startsWith(currentMonthName));
            return monthMatch && (status === 'lunas' || paidAmt > 0 || String(p.status || '').toLowerCase() === 'paid');
          });

          const countLunas = lunasPayments.length;
          const countBelum = Math.max(0, totalSiswaBulanIni - countLunas);

          const nominalTerkumpul = lunasPayments.reduce((acc, curr) => {
            return acc + (Number(curr.jumlah_bayar) || Number(curr.nominal_dibayar) || 0);
          }, 0);

          const nominalTunggakan = monthBills.reduce((acc, curr) => {
            const nominalAkhir = curr.nominal_akhir !== undefined && curr.nominal_akhir !== null
              ? Number(curr.nominal_akhir)
              : Math.max(0, (Number(curr.nominal) || 0) - (Number(curr.potongan) || 0));
            if (String(curr.status).toLowerCase() !== 'lunas') return acc + nominalAkhir;
            return acc;
          }, 0);

          // Determine unique verifications across tagihan and pembayaran for the month
          const verifSet = new Set();
          monthBills.forEach(b => {
            const s = String(b.status || '').toLowerCase().trim();
            if (s === 'menunggu_konfirmasi' || s === 'menunggu konfirmasi' || s === 'waiting_confirmation') {
              const id = b.nis || b.siswa_id || b.id || b.nama_siswa || JSON.stringify(b);
              verifSet.add(id);
            }
          });
          pembayaran.forEach(p => {
            const statusP = String(p.status || '').toLowerCase().trim();
            const pMonthName = normalizeMonthName(p.bulan || p.month || p.period);
            const periodStr = String(p.period || '').trim();
            const monthMatch = (pMonthName && pMonthName.toLowerCase() === currentMonthName.toLowerCase()) || (periodStr && periodStr.startsWith(currentMonthName));
            if (monthMatch && (statusP === 'menunggu_konfirmasi' || statusP === 'menunggu konfirmasi' || statusP === 'waiting_confirmation')) {
              const id = p.nis || p.siswa_id || p.id || p.nama_siswa || JSON.stringify(p);
              verifSet.add(id);
            }
          });

          const verifikasiCount = verifSet.size;

          // Build final per-month SPP summary (will update the view)
          finalSpp = {
            ...finalSpp,
            totalTagihan: nominalTunggakan,
            terbayar: nominalTerkumpul,
            tunggakan: nominalTunggakan,
            countVerifikasi: verifikasiCount,
            persentase: (nominalTerkumpul + nominalTunggakan) > 0 ? Math.round((nominalTerkumpul / (nominalTerkumpul + nominalTunggakan)) * 100) : (finalSpp.persentase || 0),
            countLunas,
            countBelum,
          };
          setSppData(finalSpp);
        } catch (innerErr) {
          console.error('Gagal menghitung tagihan bulan berjalan untuk Kepsek:', innerErr);
          // Fallback to yearly summary if monthly calc fails
          setSppData(finalSpp);
          setSppLoaded(true);
        }
        // Ensure we set sppData if monthly logic didn't run
        if (!sppLoaded) {
          setSppData(finalSpp);
          setSppLoaded(true);
        }
      } catch (err) {
        console.error("Gagal load operasional:", err);
      }
    };
    fetchData();
  }, [selectedYear]);

  const formatCurrency = (amount) => {
    return "Rp " + (Number(amount) || 0).toLocaleString("id-ID");
  };

  const beasiswaPieData = [
    { name: "Terealisasi", value: beasiswaSummary.persentase, color: "#1e3a8a" },
    { name: "Sisa", value: Math.max(0, 100 - beasiswaSummary.persentase), color: "#e5e7eb" }
  ];

  const sppProgressPercent = sppLoaded
    ? (Number(sppData.countLunas || 0) + Number(sppData.countBelum || 0) > 0
        ? Math.round((Number(sppData.countLunas || 0) / (Number(sppData.countLunas || 0) + Number(sppData.countBelum || 0))) * 100)
        : 0)
    : 0;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans p-4 md:p-8 min-h-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Monitoring Keuangan</h1>
          <p className="text-sm text-gray-500 mt-2">Pantau arus kas, pembayaran SPP, pemberian beasiswa, dan pembayaran gaji.</p>
        </div>
        
        {/* Year filter — top right */}
        <div className="relative group w-full sm:w-auto flex-shrink-0">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-[13px] font-bold text-gray-700 appearance-none focus:outline-none shadow-sm hover:border-blue-400 hover:ring-1 hover:ring-blue-100 cursor-pointer transition-all"
          >
            <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
            <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
            <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Ringkasan Keuangan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pemasukan Tahunan</div>
          <div className="text-[24px] font-black text-gray-800">{formatCurrency(data.pemasukan)}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pengeluaran Tahunan</div>
          <div className="text-[24px] font-black text-gray-800">{formatCurrency(data.pengeluaran)}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Saldo Keuangan</div>
          <div className="text-[24px] font-black text-gray-800">{formatCurrency(data.saldo)}</div>
        </div>
      </div>

      {/* Penyaluran Beasiswa & Status Penggajian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Penyaluran Beasiswa */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-[16px] font-bold text-gray-800">Pemberian Beasiswa</h3>
              <p className="text-[12px] text-gray-500 mt-1">Ringkasan realisasi program beasiswa</p>
            </div>
            <div className="w-[88px] h-[88px] relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={beasiswaPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={42} stroke="none" dataKey="value">
                    {beasiswaPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[14px] font-black text-gray-800">{beasiswaSummary.persentase}%</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Terealisasi</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-3 mt-1">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-[12px] font-medium text-gray-500">Penerima Aktif</span>
              <span className="text-[13px] font-black text-gray-800">{beasiswaSummary.penerimaAktif} Siswa</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-[12px] font-medium text-gray-500">Alokasi Dana Masuk</span>
              <span className="text-[13px] font-black text-gray-800">{formatCurrency(beasiswaSummary.totalDanaMasuk)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[12px] font-medium text-gray-600">Tersalurkan</span>
              <span className="text-[13px] font-black text-[#1e3a8a]">{formatCurrency(beasiswaSummary.tersalurkan)}</span>
            </div>
          </div>
        </div>

        {/* Status Penggajian */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-800">Status Realisasi Gaji</h3>
          <p className="text-[12px] text-gray-500 mt-1 mb-8">Data mengikuti slip gaji yang sudah diproses di dashboard bendahara.</p>
          
          <div className="mt-auto space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[12px] font-medium text-gray-500">Persentase Realisasi</span>
                <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-green-100">
                  {gajiSummary.persentase}% Terealisasi
                </span>
              </div>
              <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden border border-gray-100">
                <div className="bg-[#1A3D63] h-full rounded-full" style={{ width: `${gajiSummary.persentase}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50">
                <div className="text-[10px] font-bold text-[#1A3D63] uppercase tracking-wider mb-1">Realisasi Gaji</div>
                <div className="text-[16px] font-black text-[#1A3D63]">{formatCurrency(gajiSummary.realisasi)}</div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pegawai Yang Diterima</span>
                <span className="text-[15px] font-black text-gray-800">{gajiSummary.jumlahPegawai} dari {gajiSummary.totalPegawai || 0} Orang</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tunggakan & Pembayaran SPP (Executive Summary) */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-full lg:w-1/3 flex flex-col items-center">
          <div className="w-full text-center mb-2">
            <h3 className="text-[16px] font-bold text-gray-800">Distribusi Status SPP</h3>
            <p className="text-[12px] text-gray-500 mt-1">Realisasi {selectedYear}</p>
          </div>
          <div className="w-full max-w-[200px] mt-2">
            <SPPDonutChart lunas={sppData.countLunas} belumLunas={sppData.countBelum} />
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-gray-800">Ringkasan Penagihan SPP</h3>
            <p className="text-[12px] text-gray-500 mt-1">Data ringkasan {selectedYear} (bulan berjalan)</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Tagihan</div>
                <div className="text-[14px] font-black text-gray-800">{sppLoaded ? formatCurrency(sppData.totalTagihan) : '…'}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Terbayar</div>
                  <div className="text-[14px] font-black text-[#1e3a8a]">{sppLoaded ? formatCurrency(sppData.terbayar) : '…'}</div>
              </div>
            </div>

            {sppData.tunggakanPerKelas && sppData.tunggakanPerKelas.length > 0 && (
              <div>
                {sppData.tunggakanPerKelas.map((kelas, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center font-black text-[12px]">{kelas.tingkat}</div>
                      <div>
                        <div className="text-[13px] font-bold text-gray-800">{kelas.label}</div>
                        <div className="text-[11px] font-medium text-gray-500">{kelas.count} Siswa belum lunas</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-black text-gray-800">{formatCurrency(kelas.nominal)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MonitoringKeuanganKepsek;


