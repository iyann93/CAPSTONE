import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
const FinanceIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>;
const BAR_DATA = [
  { name: "Jan", SPP: 240, Gaji: 60, Operasional: 10 },
  { name: "Feb", SPP: 230, Gaji: 65, Operasional: 15 },
  { name: "Mar", SPP: 245, Gaji: 60, Operasional: 12 },
  { name: "Apr", SPP: 251, Gaji: 68, Operasional: 10 },
  { name: "Mei", SPP: 253, Gaji: 70, Operasional: 10 }
];
const PIE_DATA = [
  { name: "SPP Siswa", value: 85, color: "#3B82F6" },
  { name: "BOS Nasional", value: 10, color: "#8B5CF6" },
  { name: "Donasi", value: 3, color: "#10B981" },
  { name: "Lainnya", value: 2, color: "#F59E0B" }
];
const FinancialReport = () => {
  return <div className="animate-fadeIn space-y-6 pb-10">
      {
    /* ── Page Header ── */
  }
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-sm">
            <FinanceIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Laporan Keuangan</h1>
            <p className="text-sm text-gray-500">Rekap keuangan sekolah bulanan dan tahunan</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
             <span className="text-sm font-bold text-gray-700">Mei 2025</span>
             <div className="w-[1px] h-4 bg-gray-200 mx-1" />
             <svg className="text-gray-400" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          <button className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export PDF
          </button>
        </div>
      </div>

      {
    /* ── Top Stats Cards ── */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
    { label: "Total Pemasukan", value: "Rp 253jt", sub: "Mei 2025", color: "bg-green-50 text-green-700 border-green-100" },
    { label: "Total Pengeluaran", value: "Rp 70jt", sub: "Mei 2025", color: "bg-amber-50 text-amber-700 border-amber-100" },
    { label: "Surplus", value: "Rp 183jt", sub: "Kondisi sehat", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Akumulasi Tabungan", value: "Rp 892jt", sub: "Total 2025", color: "bg-purple-50 text-purple-700 border-purple-100" }
  ].map((stat, i) => <div key={i} className={`${stat.color} border p-6 rounded-[24px] shadow-sm relative overflow-hidden`}>
            <div className="absolute top-4 right-4 opacity-40">
               <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            </div>
            <div className="text-xs font-bold mb-1 opacity-80">{stat.label}</div>
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-[10px] font-bold mt-1 opacity-60">{stat.sub}</div>
          </div>)}
      </div>

      {
    /* ── Charts Row ── */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Bar Chart */
  }
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-8">Pemasukan vs Pengeluaran Bulanan</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(value) => `Rp ${value}jt`} />
                <Tooltip
    cursor={{ fill: "#f9fafb" }}
    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
  />
                <Legend iconType="rect" iconSize={12} wrapperStyle={{ paddingTop: "20px", fontSize: "11px", fontWeight: "bold" }} />
                <Bar dataKey="SPP" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Gaji" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Operasional" fill="#D97706" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {
    /* Donut Chart */
  }
        <div className="lg:col-span-1 bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Sumber Pemasukan</h3>
          <p className="text-xs text-gray-400 mb-8">Komposisi pendapatan</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
    data={PIE_DATA}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
    paddingAngle={5}
    dataKey="value"
  >
                  {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {PIE_DATA.map((item) => <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-bold text-gray-600">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-gray-800">{item.value}%</span>
              </div>)}
          </div>
        </div>
      </div>

      {
    /* ── Table Row ── */
  }
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-8">Ringkasan Keuangan Perbandingan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">KATEGORI</th>
                <th className="pb-4 text-[10px] font-black text-green-600 uppercase tracking-widest text-right">MEI 2025</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">APR 2025</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">PERUBAHAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
    { cat: "Total Pemasukan", mei: "Rp 253.000.000", apr: "Rp 251.000.000", diff: "+Rp 2.000.000", positive: true },
    { cat: "SPP Terkumpul", mei: "Rp 243.500.000", apr: "Rp 241.500.000", diff: "+Rp 2.000.000", positive: true },
    { cat: "Total Pengeluaran", mei: "Rp 70.000.000", apr: "Rp 78.000.000", diff: "Rp -8.000.000", positive: false }
  ].map((row, i) => <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-sm font-medium text-gray-500">{row.cat}</td>
                  <td className="py-4 text-sm font-black text-gray-800 text-right">{row.mei}</td>
                  <td className="py-4 text-sm font-medium text-gray-400 text-right">{row.apr}</td>
                  <td className={`py-4 text-sm font-bold text-right ${row.positive ? "text-green-500" : "text-amber-500"}`}>
                    {row.diff}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
var FinancialReport_default = FinancialReport;
export {
  FinancialReport_default as default
};
