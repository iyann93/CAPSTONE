import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ChartDataItem } from '../types'

const data: ChartDataItem[] = [
  { kelas: 'Kls 10', tuntas: 82, belumTuntas: 18 },
  { kelas: 'Kls 11', tuntas: 76, belumTuntas: 24 },
  { kelas: 'Kls 12', tuntas: 91, belumTuntas: 9 },
  { kelas: 'Kls 10', tuntas: 78, belumTuntas: 22 },
  { kelas: 'Kls 11', tuntas: 85, belumTuntas: 15 },
  { kelas: 'Kls 12', tuntas: 88, belumTuntas: 12 },
]

const AcademicChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700 text-sm">
          Persentase Ketuntasan Nilai Siswa (Akademik)
        </h2>
        <a href="#" className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors">
          Lihat Detail
        </a>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} barCategoryGap="30%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="kelas"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value}%`,
              name === 'tuntas' ? 'Tuntas' : 'Belum Tuntas',
            ]}
            contentStyle={{
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,.1)',
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value: string) => (value === 'tuntas' ? 'Tuntas' : 'Belum Tuntas')}
          />
          <Bar dataKey="tuntas" fill="#1B3B5F" radius={[4, 4, 0, 0]} />
          <Bar dataKey="belumTuntas" fill="#e0effe" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AcademicChart
