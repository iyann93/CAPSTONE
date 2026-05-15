import React from 'react'
import type { SalaryItem } from '../types'

const salaryItems: SalaryItem[] = [
  {
    label: 'Gaji Pokok Guru',
    count: 85,
    amount: 'Rp 320.000.000',
    percentage: 70,
    color: '#1B3B5F',
  },
  {
    label: 'Gaji Staf',
    count: 27,
    amount: 'Rp 115.000.000',
    percentage: 25,
    color: '#4B7DA3',
  },
]

const ArrowUpIcon = () => (
  <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const SalaryEstimation: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
      <h2 className="font-semibold text-gray-700 text-sm mb-3">
        Estimasi Gaji & Tunjangan (Bulan Ini)
      </h2>
      <div className="text-3xl font-bold text-gray-800 mb-1 leading-tight">
        Rp 485.500.000
      </div>
      <div className="flex items-center gap-1 mb-5">
        <ArrowUpIcon />
        <span className="text-xs font-medium text-green-500">+2.4% dari bulan lalu</span>
      </div>
      <div className="flex flex-col gap-4">
        {salaryItems.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-500">
                {item.label}{' '}
                <span className="text-gray-400">({item.count})</span>
              </span>
              <span className="text-xs font-semibold text-gray-700">{item.amount}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${item.percentage}%`, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalaryEstimation
