import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockStudents = [
  { id: "2023001", nisn: "0011223344", name: "Andi Pratama", gender: "Laki-laki", avgGrade: 85, status: "Aktif", avatarBg: "bg-blue-500", performance: [{ name: "T1", val: 80 }, { name: "UTS", val: 82 }, { name: "T2", val: 86 }, { name: "UAS", val: 88 }] },
  { id: "2023002", nisn: "0011223345", name: "Dewi Sartika", gender: "Perempuan", avgGrade: 92, status: "Aktif", avatarBg: "bg-pink-500", performance: [{ name: "T1", val: 88 }, { name: "UTS", val: 90 }, { name: "T2", val: 93 }, { name: "UAS", val: 94 }] },
  { id: "2023003", nisn: "0011223346", name: "Ricky Firmansyah", gender: "Laki-laki", avgGrade: 78, status: "Aktif", avatarBg: "bg-amber-600", performance: [{ name: "T1", val: 75 }, { name: "UTS", val: 76 }, { name: "T2", val: 79 }, { name: "UAS", val: 80 }] },
  { id: "2023004", nisn: "0011223347", name: "Nurul Hidayah", gender: "Perempuan", avgGrade: 88, status: "Aktif", avatarBg: "bg-red-500", performance: [{ name: "T1", val: 85 }, { name: "UTS", val: 86 }, { name: "T2", val: 88 }, { name: "UAS", val: 90 }] },
];

const DataSiswaKelasWali = ({ user }) => {
  const [selectedClass, setSelectedClass] = useState("VII A");
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Data Siswa Kelas</h1>
          <p className="text-[14px] text-gray-500 mt-1">Pantau performa akademik dan data detail siswa di kelas perwalian Anda.</p>
        </div>
        <div>
          <select 
            value={selectedClass} 
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(null); }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-bold text-[#1A3D63] focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
          >
            <option value="VII A">Kelas VII A</option>
            <option value="VII B">Kelas VII B</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-gray-800">Daftar Siswa {selectedClass}</h2>
            <span className="text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{mockStudents.length} Siswa</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {mockStudents.map(s => (
              <button 
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`w-full text-left p-4 rounded-xl transition-colors border ${selectedStudent?.id === s.id ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${s.avatarBg} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold text-gray-800 truncate">{s.name}</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">NIS: {s.id} | NISN: {s.nisn}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-gray-400 font-semibold mb-0.5">Rata-rata</p>
                    <p className={`text-[16px] font-black ${s.avgGrade >= 80 ? 'text-green-600' : 'text-amber-500'}`}>{s.avgGrade}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Detail */}
        <div className="lg:col-span-5 flex flex-col h-[600px]">
          {selectedStudent ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden animate-fadeIn">
              <div className="bg-[#1A3D63] p-6 text-center text-white relative">
                <div className={`w-20 h-20 mx-auto rounded-2xl ${selectedStudent.avatarBg} flex items-center justify-center text-[32px] font-black border-4 border-[#1A3D63] shadow-xl absolute -bottom-10 left-1/2 -translate-x-1/2`}>
                  {selectedStudent.name[0]}
                </div>
                <h3 className="text-[18px] font-bold mt-2 opacity-0">Placeholder</h3>
              </div>
              <div className="pt-14 px-6 pb-6 text-center border-b border-gray-100">
                <h2 className="text-[20px] font-black text-gray-800">{selectedStudent.name}</h2>
                <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[11px] font-bold">Status: {selectedStudent.status}</span>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Detail</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">Nomor Induk Siswa (NIS)</span>
                      <span className="text-[13px] font-bold text-gray-800">{selectedStudent.id}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">NISN</span>
                      <span className="text-[13px] font-bold text-gray-800">{selectedStudent.nisn}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">Jenis Kelamin</span>
                      <span className="text-[13px] font-bold text-gray-800">{selectedStudent.gender}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">Kelas Saat Ini</span>
                      <span className="text-[13px] font-bold text-[#1A3D63]">{selectedClass}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">Grafik Akademik</h4>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedStudent.performance}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p className="text-[14px] font-bold text-gray-400">Pilih siswa di daftar untuk melihat detail</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSiswaKelasWali;
