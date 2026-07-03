import React, { useState } from "react";

const mockSiswaList = [
  { id: 1, nama: "Ahmad Fauzi", nisn: "0012345678", kelas: "IX IPA 1", rataRata: 88.5, kehadiran: "98%", status: "Sangat Baik" },
  { id: 2, nama: "Siti Aminah", nisn: "0012345679", kelas: "IX IPA 1", rataRata: 82.0, kehadiran: "95%", status: "Baik" },
  { id: 3, nama: "Budi Santoso", nisn: "0012345680", kelas: "IX IPS 2", rataRata: 65.5, kehadiran: "75%", status: "Perlu Perhatian" },
  { id: 4, nama: "Dina Mariana", nisn: "0012345681", kelas: "VIII IPA 3", rataRata: 92.0, kehadiran: "100%", status: "Sangat Baik" },
];

const MonitoringSiswaKepsek = () => {
  const [filter, setFilter] = useState({ tahunAjaran: "2024/2025", semester: "Ganjil", kelas: "Semua", search: "" });
  const [selectedSiswa, setSelectedSiswa] = useState(null);

  const filteredData = mockSiswaList.filter(s => 
    (filter.kelas === "Semua" || s.kelas === filter.kelas) &&
    s.nama.toLowerCase().includes(filter.search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fadeIn min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Monitoring Siswa</span>
      </div>
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Monitoring Perkembangan Siswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">Pantau perkembangan nilai, kehadiran, dan aktivitas siswa secara individu berdasarkan filter.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Cari Nama Siswa</label>
          <input 
            type="text" 
            placeholder="Ketik nama siswa..."
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Tahun Ajaran</label>
          <select 
            value={filter.tahunAjaran} 
            onChange={(e) => setFilter({...filter, tahunAjaran: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          >
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Semester</label>
          <select 
            value={filter.semester} 
            onChange={(e) => setFilter({...filter, semester: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          >
            <option>Ganjil</option>
            <option>Genap</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-1">Kelas</label>
          <select 
            value={filter.kelas} 
            onChange={(e) => setFilter({...filter, kelas: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2.5"
          >
            <option>Semua</option>
            <option>VIII IPA 3</option>
            <option>IX IPA 1</option>
            <option>IX IPS 2</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Siswa */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Siswa</th>
                  <th className="px-6 py-4">Rata-Rata</th>
                  <th className="px-6 py-4">Kehadiran</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EBF3FA] text-[#1A3D63] flex items-center justify-center font-bold">
                          {item.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{item.nama}</p>
                          <p className="text-[12px] text-gray-500">{item.nisn} • {item.kelas}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{item.rataRata}</td>
                    <td className="px-6 py-4 text-gray-600">{item.kehadiran}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        item.status === "Sangat Baik" ? "bg-green-50 text-green-600 border border-green-100" :
                        item.status === "Perlu Perhatian" ? "bg-red-50 text-red-600 border border-red-100" :
                        "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSiswa(item)}
                        className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-colors ${
                          selectedSiswa?.id === item.id 
                            ? "bg-[#1A3D63] text-white" 
                            : "bg-[#F4F6FA] text-[#1A3D63] hover:bg-[#EBF3FA]"
                        }`}
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Tidak ada siswa yang sesuai pencarian.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-1">
          {selectedSiswa ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-fadeIn sticky top-24">
              <div className="bg-[#1A3D63] p-6 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-3 border-2 border-white/50">
                  {selectedSiswa.nama.charAt(0)}
                </div>
                <h3 className="text-[20px] font-bold">{selectedSiswa.nama}</h3>
                <p className="text-[14px] text-blue-200 mt-1">{selectedSiswa.nisn} | {selectedSiswa.kelas}</p>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Ringkasan Akademik</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                      <p className="text-[11px] text-gray-500 mb-1">Rata-rata Nilai</p>
                      <p className="text-[20px] font-bold text-[#1A3D63]">{selectedSiswa.rataRata}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                      <p className="text-[11px] text-gray-500 mb-1">Kehadiran</p>
                      <p className="text-[20px] font-bold text-[#1A3D63]">{selectedSiswa.kehadiran}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Aktivitas Terakhir</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">Ujian Matematika</p>
                        <p className="text-[12px] text-gray-500">Nilai: 95 (Lulus KKM)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">Tugas Sejarah</p>
                        <p className="text-[12px] text-gray-500">Dikumpulkan tepat waktu</p>
                      </div>
                    </div>
                    {selectedSiswa.rataRata < 70 && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">Konseling BK</p>
                          <p className="text-[12px] text-gray-500">Dijadwalkan untuk penanganan nilai lambat</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button className="w-full py-3 bg-[#EBF3FA] text-[#1A3D63] rounded-xl font-bold hover:bg-blue-100 transition-colors mt-2">
                  Lihat Detail Lengkap
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <p className="text-[15px] font-bold text-gray-400">Pilih Siswa</p>
              <p className="text-[13px] text-gray-400 mt-1">Klik tombol "Lihat" pada tabel untuk memantau detail perkembangan akademik siswa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringSiswaKepsek;


