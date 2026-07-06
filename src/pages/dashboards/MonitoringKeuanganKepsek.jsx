import React, { useState } from "react";
import SPPDonutChart from "../../components/SPPDonutChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const ARUS_KAS_DATA = [
  { name: "Jul '25", Pemasukan: 300, Pengeluaran: 150 },
  { name: "Aug '25", Pemasukan: 400, Pengeluaran: 200 },
  { name: "Sep '25", Pemasukan: 350, Pengeluaran: 180 },
  { name: "Oct '25", Pemasukan: 320, Pengeluaran: 250 },
  { name: "Nov '25", Pemasukan: 450, Pengeluaran: 220 },
  { name: "Dec '25", Pemasukan: 310, Pengeluaran: 290 }
];

const BEASISWA_PIE_DATA = [
  { name: "Terealisasi", value: 84, color: "#1e3a8a" },
  { name: "Sisa", value: 16, color: "#e5e7eb" }
];

const MonitoringKeuanganKepsek = ({ user, onNavigate }) => {
  const [filter, setFilter] = useState({ tahunAjaran: "2024/2025", semester: "Ganjil", bulan: "Semua Bulan" });
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterSuccess, setFilterSuccess] = useState(false);

  const [data, setData] = useState({
    pemasukan: 2450000000,
    pengeluaran: 1120000000,
    saldo: 1330000000,
    persentaseSpp: 88.5,
    tunggakan: 80000000
  });

  const formatCurrency = (amount) => {
    return "Rp " + amount.toLocaleString("id-ID");
  };

  const handleApplyFilter = () => {
    setIsFiltering(true);
    setTimeout(() => {
      const multiplier = filter.bulan === "Semua Bulan" ? 1 : 0.4 + Math.random() * 0.4;
      const newPemasukan = Math.floor(2450000000 * multiplier);
      const newPengeluaran = Math.floor(1120000000 * multiplier);
      
      setData({
        pemasukan: newPemasukan,
        pengeluaran: newPengeluaran,
        saldo: newPemasukan - newPengeluaran,
        persentaseSpp: filter.bulan === "Semua Bulan" ? 88.5 : +(70 + Math.random() * 25).toFixed(1),
        tunggakan: Math.floor(80000000 * (1.5 - multiplier))
      });
      
      setIsFiltering(false);
      setFilterSuccess(true);
      setTimeout(() => setFilterSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans p-4 md:p-8 min-h-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Monitoring Keuangan</h1>
          <p className="text-sm text-gray-500 mt-2">Pantau arus kas, pembayaran SPP, pemberian beasiswa, dan pembayaran gaji.</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Tahun Ajaran</label>
          <select 
            value={filter.tahunAjaran} 
            onChange={(e) => setFilter({...filter, tahunAjaran: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-[13px] font-semibold rounded-xl focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] block p-3 transition-all outline-none"
          >
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Semester</label>
          <select 
            value={filter.semester} 
            onChange={(e) => setFilter({...filter, semester: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-[13px] font-semibold rounded-xl focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] block p-3 transition-all outline-none"
          >
            <option>Ganjil</option>
            <option>Genap</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Bulan</label>
          <select 
            value={filter.bulan} 
            onChange={(e) => setFilter({...filter, bulan: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-[13px] font-semibold rounded-xl focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] block p-3 transition-all outline-none"
          >
            <option>Semua Bulan</option>
            <option>Juli</option>
            <option>Agustus</option>
            <option>September</option>
            <option>Oktober</option>
          </select>
        </div>
        <button 
          onClick={handleApplyFilter}
          disabled={isFiltering}
          className={`px-6 py-3 rounded-xl font-bold shadow-sm transition-colors w-full md:w-auto h-[46px] flex items-center justify-center cursor-pointer border-none text-[13px] ${
            filterSuccess 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-[#1A3D63] text-white hover:bg-[#122c4a]"
          }`}
        >
          {isFiltering ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              MEMPROSES...
            </span>
          ) : filterSuccess ? (
             <span className="flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              BERHASIL
            </span>
          ) : (
            "TERAPKAN FILTER"
          )}
        </button>
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

      {/* Bar Chart & Penagihan SPP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-gray-800">Analisis Arus Kas Bulanan</h3>
              <p className="text-[12px] text-gray-500 mt-1">Perbandingan akumulasi pemasukan dan biaya pengeluaran</p>
            </div>
            <div className="flex items-center gap-4 mt-3 sm:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1e3a8a]"></div>
                <span className="text-[11px] font-bold text-gray-600">Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#dc2626]"></div>
                <span className="text-[11px] font-bold text-gray-600">Pengeluaran</span>
              </div>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ARUS_KAS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: "bold" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={false} />
                <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="Pemasukan" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="Pengeluaran" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Penagihan SPP */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-800 mb-6">Penagihan SPP</h3>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-medium text-gray-500">Realisasi {filter.bulan === "Semua Bulan" ? "Keseluruhan" : filter.bulan}</span>
              <span className="text-[12px] font-black text-gray-800">{data.persentaseSpp}%</span>
            </div>
            <div className="w-full bg-blue-50 rounded-full h-3">
              <div className="bg-[#1e3a8a] h-3 rounded-full" style={{ width: `${data.persentaseSpp}%`, transition: 'width 0.5s ease-out' }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-auto">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Tagihan</div>
              <div className="text-[14px] font-black text-gray-800">Rp 250 Jt</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Terbayar</div>
              <div className="text-[14px] font-black text-[#1e3a8a]">Rp 1.106 Jt</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sisa Tunggakan</div>
              <div className="text-[14px] font-black text-red-600">Rp 80 Jt</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status Verifikasi</div>
              <div className="text-[14px] font-black text-gray-800">12 Siswa</div>
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
            <p className="text-[12px] text-gray-500 mt-1">Realisasi {filter.bulan === "Semua Bulan" ? filter.tahunAjaran : `Bulan ${filter.bulan}`}</p>
          </div>
          <div className="w-full max-w-[200px] mt-2">
            <SPPDonutChart />
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-gray-800">Akumulasi Tunggakan</h3>
              <p className="text-[12px] text-gray-500 mt-1">Data per {filter.bulan === "Semua Bulan" ? "akhir semester" : `akhir bulan ${filter.bulan}`}</p>
            </div>
            <div className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold uppercase tracking-wider">
              Total: {formatCurrency(data.tunggakan)}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center font-black text-[12px]">VII</div>
                <div>
                  <div className="text-[13px] font-bold text-gray-800">Kelas VII</div>
                  <div className="text-[11px] font-medium text-gray-500">38 Siswa belum lunas</div>
                </div>
              </div>
              <div className="text-[14px] font-black text-gray-800">Rp 43.500.000</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center font-black text-[12px]">VIII</div>
                <div>
                  <div className="text-[13px] font-bold text-gray-800">Kelas VIII</div>
                  <div className="text-[11px] font-medium text-gray-500">22 Siswa belum lunas</div>
                </div>
              </div>
              <div className="text-[14px] font-black text-gray-800">Rp 24.000.000</div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center font-black text-[12px]">IX</div>
                <div>
                  <div className="text-[13px] font-bold text-gray-800">Kelas IX</div>
                  <div className="text-[11px] font-medium text-gray-500">14 Siswa belum lunas</div>
                </div>
              </div>
              <div className="text-[14px] font-black text-red-600">Rp 12.500.000</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MonitoringKeuanganKepsek;


