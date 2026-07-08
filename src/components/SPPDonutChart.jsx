import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const SPPDonutChart = ({ lunas = 0, belumLunas = 0 }) => {
  const total = lunas + belumLunas;
  const percentage = total > 0 ? Math.round((lunas / total) * 100) : 0;
  
  const sppData = total > 0 ? [
    { name: "Lunas SPP", value: lunas, fill: "#22c55e" },
    { name: "Belum Bayar", value: belumLunas, fill: "#ef4444" }
  ] : [
    { name: "Belum Ada Data", value: 1, fill: "#e5e7eb" }
  ];

  return (
    <div className="w-full flex-shrink-0">
      <div className="relative flex items-center justify-center" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={sppData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              startAngle={90}
              endAngle={-270}
              paddingAngle={1}
              dataKey="value"
              stroke="none"
            >
              {sppData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[24px] font-black text-gray-800">{percentage}%</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Lunas</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
        {sppData.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
              style={{ background: d.fill }}
            />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {d.name} ({d.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
var SPPDonutChart_default = SPPDonutChart;
export {
  SPPDonutChart_default as default
};
