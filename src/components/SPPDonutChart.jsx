import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
const sppData = [
  { name: "Lunas", value: 973, fill: "#22c55e" },
  { name: "Menunggak", value: 275, fill: "#f59e0b" }
];
const SPPDonutChart = () => {
  return <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 w-full flex-shrink-0">
      <h2 className="font-semibold text-gray-700 text-sm mb-3">
        Status Pembayaran SPP (Bulan Ini)
      </h2>
      <div className="relative flex items-center justify-center" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
    data={sppData}
    cx="50%"
    cy="50%"
    innerRadius={62}
    outerRadius={86}
    startAngle={90}
    endAngle={-270}
    paddingAngle={3}
    dataKey="value"
  >
              {sppData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {
    /* Center label */
  }
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-800">78%</span>
          <span className="text-xs text-gray-400">Lunas</span>
        </div>
      </div>
      {
    /* Legend */
  }
      <div className="flex justify-center gap-6 mt-1">
        {sppData.map((d) => <div key={d.name} className="flex items-center gap-1.5">
            <span
    className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
    style={{ background: d.fill }}
  />
            <span className="text-xs text-gray-500">
              {d.name} ({d.value})
            </span>
          </div>)}
      </div>
    </div>;
};
var SPPDonutChart_default = SPPDonutChart;
export {
  SPPDonutChart_default as default
};
