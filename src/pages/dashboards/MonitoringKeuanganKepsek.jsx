import React, { useState, useEffect } from "react";
import SPPDonutChart from "../../components/SPPDonutChart";
import { getGlobalFinanceSummary, getSppYearlySummary } from "../../utils/financeHelpers";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";


const BEASISWA_PIE_DATA = [
  { name: "Terealisasi", value: 84, color: "#1e3a8a" },
  { name: "Sisa", value: 16, color: "#e5e7eb" }
];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summary, sppSummary] = await Promise.all([
          getGlobalFinanceSummary(),
          getSppYearlySummary(selectedYear)
        ]);
        setData(prev => ({
          ...prev,
          pemasukan: summary.totalPemasukan,
          pengeluaran: summary.totalPengeluaran,
          saldo: summary.saldoKeuangan
        }));
        setSppData(sppSummary);
      } catch (err) {
        console.error("Gagal load operasional:", err);
      }
    };
    fetchData();
  }, [selectedYear]);

  const formatCurrency = (amount) => {
    return "Rp " + (Number(amount) || 0).toLocaleString("id-ID");
  };

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
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pemasukan</div>
          <div className="text-[24px] font-black text-gray-800">{formatCurrency(data.pemasukan)}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pengeluaran</div>
          <div className="text-[24px] font-black text-gray-800">{formatCurrency(data.pengeluaran)}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Saldo Keuangan</div>
          <div className="text-[24px] font-black text-gray-800">{formatCurrency(data.saldo)}</div>
        </div>
      </div>

      {/* Penagihan SPP */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-800 mb-6">Penagihan SPP</h3>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-medium text-gray-500">Realisasi {selectedYear}</span>
              <span className="text-[12px] font-black text-gray-800">{sppData.persentase}%</span>
            </div>
            <div className="w-full bg-blue-50 rounded-full h-3">
              <div className="bg-[#1e3a8a] h-3 rounded-full" style={{ width: `${sppData.persentase}%`, transition: 'width 0.5s ease-out' }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-auto">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Tagihan</div>
              <div className="text-[14px] font-black text-gray-800">{formatCurrency(sppData.totalTagihan)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Terbayar</div>
              <div className="text-[14px] font-black text-[#1e3a8a]">{formatCurrency(sppData.terbayar)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sisa Tunggakan</div>
              <div className="text-[14px] font-black text-red-600">{formatCurrency(sppData.tunggakan)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status Verifikasi</div>
              <div className="text-[14px] font-black text-gray-800">{sppData.countVerifikasi} Siswa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Penyaluran Beasiswa & Status Penggajian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Penyaluran Beasiswa */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-800">Pemberian Beasiswa</h3>
          <p className="text-[12px] text-gray-500 mt-1 mb-6">Program bantuan bagi santri berprestasi & yatim</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex-1 space-y-4 pr-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-[12px] text-gray-500">Penerima Aktif</span>
                <span className="text-[13px] font-black text-gray-800">142 Siswa</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-[12px] text-gray-500">Alokasi Dana Masuk</span>
                <span className="text-[13px] font-black text-gray-800">Rp 450 Jt</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-[12px] text-gray-500">Tersalurkan</span>
                <span className="text-[13px] font-black text-gray-800">Rp 360 Jt</span>
              </div>
            </div>
            <div className="w-[100px] h-[100px] relative flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={BEASISWA_PIE_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={45} stroke="none" dataKey="value">
                    {BEASISWA_PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[14px] font-black text-gray-800">84%</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Terealisasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Penggajian */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-800">Status Realisasi Anggaran Gaji</h3>
          <p className="text-[12px] text-gray-500 mt-1 mb-8">Monitoring realisasi pembayaran gaji guru dan tenaga kependidikan.</p>
          
          <div className="mt-auto space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[12px] font-medium text-gray-500">Persentase Realisasi</span>
                <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-green-100">
                  95,6% Terealisasi
                </span>
              </div>
              <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden border border-gray-100">
                <div className="bg-[#1A3D63] h-full rounded-full" style={{ width: '95.6%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Anggaran Gaji</div>
                <div className="text-[16px] font-black text-gray-800">Rp 640 Jt</div>
              </div>
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50">
                <div className="text-[10px] font-bold text-[#1A3D63] uppercase tracking-wider mb-1">Realisasi Gaji</div>
                <div className="text-[16px] font-black text-[#1A3D63]">Rp 612 Jt</div>
              </div>
              <div className="col-span-2 flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sisa Anggaran</span>
                <span className="text-[15px] font-black text-amber-500">Rp 28 Jt</span>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-gray-800">Akumulasi Tunggakan</h3>
              <p className="text-[12px] text-gray-500 mt-1">Data akumulasi {selectedYear}</p>
            </div>
            <div className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold uppercase tracking-wider">
              Total: {formatCurrency(sppData.tunggakan)}
            </div>
          </div>
          
          <div className="space-y-4">
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
        </div>
      </div>

    </div>
  );
};

export default MonitoringKeuanganKepsek;


