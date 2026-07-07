import { getOperasional, getPembayaran, getDanaBeasiswa, getBeasiswa, getTagihan } from "../api/finance";
import { getAllSlips } from "../api/payroll";

const isCurrentMonthAndYear = (dateStr) => {
  if (!dateStr) return false;
  const now = new Date();
  const currentMonthNum = now.getMonth();
  const currentYearNum = now.getFullYear();

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.getMonth() === currentMonthNum && d.getFullYear() === currentYearNum;
  }
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const m = monthNames.indexOf(parts[1]);
    if (m === currentMonthNum && parseInt(parts[2]) === currentYearNum) return true;
  }
  return false;
};

export const getBeasiswaSummary = async () => {
  try {
    const [beasiswaResponse, danaBeasiswaResponse] = await Promise.all([
      getBeasiswa().catch(() => []),
      getDanaBeasiswa().catch(() => [])
    ]);

    const beasiswaList = Array.isArray(beasiswaResponse?.data || beasiswaResponse)
      ? (beasiswaResponse.data || beasiswaResponse)
      : [];

    const danaBeasiswaList = Array.isArray(danaBeasiswaResponse?.data || danaBeasiswaResponse)
      ? (danaBeasiswaResponse.data || danaBeasiswaResponse)
      : [];

    const activeRecipients = beasiswaList.filter((item) => {
      const status = String(item?.status || "").trim().toLowerCase();
      return status === "aktif" || status === "active" || status === "";
    });

    const totalDanaMasuk = danaBeasiswaList.reduce((sum, item) => sum + (Number(item?.nominal) || 0), 0);
    const tersalurkan = activeRecipients.reduce((sum, item) => sum + (Number(item?.nominal) || 0), 0);
    const persentase = totalDanaMasuk > 0 ? Math.round((tersalurkan / totalDanaMasuk) * 100) : 0;

    return {
      penerimaAktif: activeRecipients.length,
      totalDanaMasuk,
      tersalurkan,
      persentase: Math.max(0, Math.min(100, persentase))
    };
  } catch (err) {
    console.error("Error aggregating beasiswa summary:", err);
    return {
      penerimaAktif: 0,
      totalDanaMasuk: 0,
      tersalurkan: 0,
      persentase: 0
    };
  }
};

export const getGlobalFinanceSummary = async () => {
  let inTotal = 0;
  let inMonth = 0;
  let outTotal = 0;
  let outMonth = 0;

  try {
    const [operasionalData, pembayaranData, danaBeasiswaData, beasiswaData, slipsData] = await Promise.all([
      getOperasional().catch(() => []),
      getPembayaran().catch(() => []),
      getDanaBeasiswa().catch(() => []),
      getBeasiswa().catch(() => []),
      getAllSlips().catch(() => [])
    ]);

    // 1. Operasional
    if (Array.isArray(operasionalData.data || operasionalData)) {
      const data = operasionalData.data || operasionalData;
      data.forEach(item => {
        const nom = Number(item.nominal) || 0;
        if (item.tipe === 'pemasukan') {
          inTotal += nom;
          if (isCurrentMonthAndYear(item.tanggal)) inMonth += nom;
        } else if (item.tipe === 'pengeluaran') {
          outTotal += nom;
          if (isCurrentMonthAndYear(item.tanggal)) outMonth += nom;
        }
      });
    }

    // 2. SPP (Pemasukan)
    if (Array.isArray(pembayaranData.data || pembayaranData)) {
      const data = pembayaranData.data || pembayaranData;
      data.forEach(item => {
        if (item.status === 'Lunas' || (item.nominal_dibayar && item.nominal_dibayar > 0) || (item.jumlah_bayar && item.jumlah_bayar > 0)) {
          const nom = Number(item.jumlah_bayar) || Number(item.nominal_dibayar) || Number(item.nominal) || 0;
          inTotal += nom;
          if (isCurrentMonthAndYear(item.tanggal_pembayaran || item.updatedAt || item.createdAt)) {
            inMonth += nom;
          }
        }
      });
    }

    // 3. Dana Beasiswa Masuk (Pemasukan)
    if (Array.isArray(danaBeasiswaData.data || danaBeasiswaData)) {
      const data = danaBeasiswaData.data || danaBeasiswaData;
      data.forEach(item => {
        const nom = Number(item.nominal) || 0;
        inTotal += nom;
        if (isCurrentMonthAndYear(item.tanggal || item.createdAt)) {
          inMonth += nom;
        }
      });
    }

    // 4. (Removed Gaji Pegawai to align with Pengeluaran Menu)

    // 5. Penyaluran Beasiswa (Pengeluaran)
    let beasiswaDataList = Array.isArray(beasiswaData?.data || beasiswaData) ? (beasiswaData.data || beasiswaData) : [];
    if (beasiswaDataList.length === 0) {
      try {
        const raw = localStorage.getItem('capstone_program_beasiswa');
        if (raw) beasiswaDataList = JSON.parse(raw);
      } catch (e) {}
    }
    
    beasiswaDataList.forEach(p => {
      if (p.status === 'Aktif') {
        const amountStr = String(p.amount || "0").replace(/[^0-9]/g, '');
        const amountNum = parseInt(amountStr, 10) || 0;
        
        const activePenerima = (p.penerima || []).filter(r => !r.status || String(r.status).toLowerCase() === 'aktif');
        const disalurkan = activePenerima.reduce((s, r) => {
          const rNominal = r.nominal ? Number(r.nominal) : amountNum;
          return s + (rNominal || 0);
        }, 0);
        
        outTotal += disalurkan;
        if (isCurrentMonthAndYear(p.tanggalPenyaluran || p.updatedAt || p.createdAt || (p.penerima && p.penerima[0]?.tanggal_mulai))) {
          outMonth += disalurkan;
        }
      }
    });
  } catch (err) {
    console.error("Error aggregating global finance data:", err);
  }

  return {
    pemasukanBulanIni: inMonth,
    pengeluaranBulanIni: outMonth,
    totalPemasukan: inTotal,
    totalPengeluaran: outTotal,
    saldoKeuangan: inTotal - outTotal
  };
};

export const getMonthlyFinanceData = async () => {
  // Setup 7 months of data for the chart (June to December as requested)
  const monthNames = ["Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const monthlyData = monthNames.map(m => ({ name: m, Pemasukan: 0, Pengeluaran: 0 }));

  try {
    const [operasionalData, pembayaranData, danaBeasiswaData, beasiswaData, slipsData] = await Promise.all([
      getOperasional().catch(() => []),
      getPembayaran().catch(() => []),
      getDanaBeasiswa().catch(() => []),
      getBeasiswa().catch(() => []),
      getAllSlips().catch(() => [])
    ]);

    const getMonthIndex = (dateStr) => {
      if (!dateStr) return -1;
      const str = String(dateStr);
      
      const ddmmyyyy = str.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
      if (ddmmyyyy) return parseInt(ddmmyyyy[2], 10) - 1;
      
      const yyyymmdd = str.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
      if (yyyymmdd) return parseInt(yyyymmdd[2], 10) - 1;

      const d = new Date(str);
      if (!isNaN(d.getTime())) return d.getMonth();
      
      const monthNamesIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const parts = str.split(' ');
      if (parts.length >= 3) {
        const m = monthNamesIndo.findIndex(m => m.toLowerCase().startsWith(parts[1].toLowerCase()));
        if (m !== -1) return m;
      }
      return -1;
    };

    const mapToChart = (dateStr, amount, type) => {
      const mIdx = getMonthIndex(dateStr);
      if (mIdx >= 5 && mIdx <= 11) {
        const chartIdx = mIdx - 5;
        if (type === 'in') monthlyData[chartIdx].Pemasukan += amount;
        else monthlyData[chartIdx].Pengeluaran += amount;
      }
    };

    if (Array.isArray(operasionalData.data || operasionalData)) {
      (operasionalData.data || operasionalData).forEach(item => {
        const nom = Number(item.nominal) || 0;
        mapToChart(item.tanggal, nom, item.tipe === 'pemasukan' ? 'in' : 'out');
      });
    }

    if (Array.isArray(pembayaranData.data || pembayaranData)) {
      (pembayaranData.data || pembayaranData).forEach(item => {
        if (item.status === 'Lunas' || (item.nominal_dibayar && item.nominal_dibayar > 0) || (item.jumlah_bayar && item.jumlah_bayar > 0)) {
          const nom = Number(item.jumlah_bayar) || Number(item.nominal_dibayar) || Number(item.nominal) || 0;
          mapToChart(item.tanggal_pembayaran || item.updatedAt || item.createdAt, nom, 'in');
        }
      });
    }

    if (Array.isArray(danaBeasiswaData.data || danaBeasiswaData)) {
      (danaBeasiswaData.data || danaBeasiswaData).forEach(item => {
        mapToChart(item.tanggal || item.createdAt, Number(item.nominal) || 0, 'in');
      });
    }

    if (Array.isArray(slipsData.data || slipsData)) {
      (slipsData.data || slipsData).forEach(item => {
        if (['Sudah Ditransfer', 'Disetujui', 'Approved'].includes(item.status)) {
          mapToChart(item.tanggal_dibuat || item.createdAt, Number(item.gaji_bersih) || 0, 'out');
        }
      });
    }

    if (Array.isArray(beasiswaData.data || beasiswaData)) {
      (beasiswaData.data || beasiswaData).forEach(p => {
        if (p.status === 'Aktif') {
          const amountNum = parseInt(String(p.amount || "0").replace(/[^0-9]/g, ''), 10) || 0;
          (p.penerima || []).forEach(r => {
            mapToChart(r.tanggal_diberikan || p.updatedAt || p.createdAt, r.nominal ? Number(r.nominal) : amountNum, 'out');
          });
        }
      });
    }
  } catch (err) {
    console.error("Error aggregating monthly finance data:", err);
  }

  return monthlyData;
};

export const getSppYearlySummary = async (tahunAjaran = "2025/2026") => {
  try {
    const [tagihanData, pembayaranData] = await Promise.all([
      getTagihan({ limit: 5000 }).catch(() => []),
      getPembayaran().catch(() => [])
    ]);

    const tagihan = Array.isArray(tagihanData.data || tagihanData) ? (tagihanData.data || tagihanData) : [];
    const pembayaran = Array.isArray(pembayaranData.data || pembayaranData) ? (pembayaranData.data || pembayaranData) : [];

    let totalTagihan = 0;
    let terbayar = 0;
    let tunggakan = 0;
    let countVerifikasi = 0;
    let countLunas = 0;
    let countBelum = 0;

    const tunggakanPerKelas = {
      VII: { count: 0, nominal: 0 },
      VIII: { count: 0, nominal: 0 },
      IX: { count: 0, nominal: 0 },
    };

    const siswaMap = {};

    tagihan.forEach(t => {
      // (Opsional) filter berdasarkan tahun ajaran jika backend support `tahun_ajaran` di payload tagihan.
      if (t.tahun_ajaran && t.tahun_ajaran !== tahunAjaran && t.periode && !t.periode.includes(tahunAjaran.split('/')[0])) {
         // Biarkan lewat dulu atau filter
      }

      const nom = Number(t.nominal_akhir || t.nominal || 0);
      totalTagihan += nom;

      const kls = String(t.nama_kelas || t.kelas || "").toUpperCase();
      let tingkat = "Lainnya";
      if (kls.includes("VII") && !kls.includes("VIII")) tingkat = "VII";
      else if (kls.includes("VIII")) tingkat = "VIII";
      else if (kls.includes("IX")) tingkat = "IX";

      const siswaId = t.nis || t.nama_siswa || t.id_siswa || 'unknown-' + Math.random();
      if (!siswaMap[siswaId]) {
         siswaMap[siswaId] = { lunas: true, tingkat, nominalBulan: nom };
      }

      if (t.status === 'menunggu_konfirmasi') {
        countVerifikasi++;
        siswaMap[siswaId].lunas = false;
      } else if (t.status === 'lunas' || t.status === 'Lunas') {
        terbayar += nom;
      } else {
        siswaMap[siswaId].lunas = false;
      }
    });

    tunggakan = 0; // reset and calculate based on unique students (1 month basis) to sync with Bendahara
    Object.values(siswaMap).forEach(s => {
       if (s.lunas) {
         countLunas++;
       } else {
         countBelum++;
         tunggakan += s.nominalBulan;
         if (tunggakanPerKelas[s.tingkat]) {
           tunggakanPerKelas[s.tingkat].count++;
           tunggakanPerKelas[s.tingkat].nominal += s.nominalBulan;
         }
       }
    });

    const persentase = totalTagihan > 0 ? Math.round((terbayar / totalTagihan) * 100) : 0;

    return {
      totalTagihan,
      terbayar,
      tunggakan,
      countVerifikasi,
      persentase,
      countLunas,
      countBelum,
      tunggakanPerKelas: [
        { tingkat: "VII", label: "Kelas VII", count: tunggakanPerKelas["VII"].count, nominal: tunggakanPerKelas["VII"].nominal },
        { tingkat: "VIII", label: "Kelas VIII", count: tunggakanPerKelas["VIII"].count, nominal: tunggakanPerKelas["VIII"].nominal },
        { tingkat: "IX", label: "Kelas IX", count: tunggakanPerKelas["IX"].count, nominal: tunggakanPerKelas["IX"].nominal }
      ]
    };
  } catch (err) {
    console.error("Error in getSppYearlySummary:", err);
    return {
      totalTagihan: 0, terbayar: 0, tunggakan: 0, countVerifikasi: 0, persentase: 0, countLunas: 0, countBelum: 0,
      tunggakanPerKelas: []
    };
  }
};
