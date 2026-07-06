import { getOperasional, getPembayaran, getDanaBeasiswa, getBeasiswa } from "../api/finance";
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

    // 4. Gaji Pegawai (Pengeluaran)
    if (Array.isArray(slipsData.data || slipsData)) {
      const data = slipsData.data || slipsData;
      data.forEach(item => {
        if (['Sudah Ditransfer', 'Disetujui', 'Approved'].includes(item.status)) {
          const nom = Number(item.gaji_bersih) || 0;
          outTotal += nom;
          if (isCurrentMonthAndYear(item.tanggal_dibuat || item.createdAt)) {
            outMonth += nom;
          }
        }
      });
    }

    // 5. Penyaluran Beasiswa (Pengeluaran)
    if (Array.isArray(beasiswaData.data || beasiswaData)) {
      const data = beasiswaData.data || beasiswaData;
      data.forEach(p => {
        if (p.status === 'Aktif') {
          const amountStr = String(p.amount || "0").replace(/[^0-9]/g, '');
          const amountNum = parseInt(amountStr, 10) || 0;
          
          (p.penerima || []).forEach(r => {
            const nom = r.nominal ? Number(r.nominal) : amountNum;
            outTotal += nom;
            if (isCurrentMonthAndYear(r.tanggal_diberikan || p.updatedAt || p.createdAt)) {
              outMonth += nom;
            }
          });
        }
      });
    }
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
