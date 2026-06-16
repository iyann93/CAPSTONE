import React from "react";

const SubjectDetail = ({ data, onBack, onEdit, onDelete }) => {
  if (!data) return null;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[13px] font-medium text-gray-400 mb-2">
            Dashboard <span className="mx-1">&gt;</span> Kelola Akademik <span className="mx-1">&gt;</span> Mata Pelajaran <span className="mx-1">&gt;</span> <span className="text-gray-600 font-bold">Detail</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[28px] font-bold text-[#1e293b]">{data.nama}</h1>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[11px] font-bold tracking-wider">{data.kode}</span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[11px] font-bold tracking-wider">{data.kelompok}</span>
            <span className={`px-2.5 py-1 ${data.aktif ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'} rounded-md text-[11px] font-bold tracking-wider flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 ${data.aktif ? 'bg-emerald-500' : 'bg-gray-400'} rounded-full`}></span>
              {data.aktif ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          <p className="text-gray-500 text-[14px]">
            {data.deskripsi || "Tidak ada deskripsi."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Ekspor Data
          </button>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 bg-[#1e293b] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:bg-[#0f172a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Mata Pelajaran
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Kelas Mengampu</div>
            <div className="text-[24px] font-bold text-[#1e293b] leading-tight mt-0.5">32</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Total Siswa</div>
            <div className="text-[24px] font-bold text-[#1e293b] leading-tight mt-0.5">1,248</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Jam / Minggu</div>
            <div className="text-[24px] font-bold text-[#1e293b] leading-tight mt-0.5">4 <span className="text-[14px] text-gray-500 font-medium">jam</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Rata-rata Nilai</div>
            <div className="text-[24px] font-bold text-[#1e293b] leading-tight mt-0.5">78.4</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          
          {/* Card 1: Rata-rata Nilai per Tingkat */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Rata-rata Nilai per Tingkat</h2>
              </div>
              <span className="text-[12px] font-bold text-gray-400">Semester Ganjil 2023/2024</span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[13px] font-bold text-gray-700">Kelas X</div>
                  <div className="text-[12px] text-gray-500 flex gap-3">
                    <span>Rata-rata: <span className="font-bold text-gray-800">80.2</span></span>
                    <span>KKM: 75</span>
                    <span className="font-bold text-emerald-600">94% lulus</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#1e293b] rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[13px] font-bold text-gray-700">Kelas XI</div>
                  <div className="text-[12px] text-gray-500 flex gap-3">
                    <span>Rata-rata: <span className="font-bold text-gray-800">77.8</span></span>
                    <span>KKM: 75</span>
                    <span className="font-bold text-emerald-600">89% lulus</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: '77%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[13px] font-bold text-gray-700">Kelas XII</div>
                  <div className="text-[12px] text-gray-500 flex gap-3">
                    <span>Rata-rata: <span className="font-bold text-gray-800">76.4</span></span>
                    <span>KKM: 75</span>
                    <span className="font-bold text-emerald-600">86% lulus</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                  <div className="h-full bg-[#10b981] rounded-full" style={{ width: '76%' }}></div>
                  <div className="absolute top-0 bottom-0 left-[75%] border-l-2 border-red-400 z-10" title="Garis KKM"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-red-400 rounded-full"></span>
              <span className="text-[11px] font-medium text-gray-500">Garis KKM (75)</span>
            </div>
          </div>

          {/* Card 2: Jadwal Mengajar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Jadwal Mengajar</h2>
              </div>
              <span className="text-[12px] font-medium text-gray-500">Semester aktif — 32 kelas</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hari</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jam</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Siswa</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rata Nilai</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Absensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-800">X-IPA 1</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">Senin, Rabu</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-500 font-mono tracking-tighter">07.30 - 09.30</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">36</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">82.1</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700">96%</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-800">X-IPA 2</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">Selasa, Kamis</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-500 font-mono tracking-tighter">08.00 - 10.00</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">35</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">79.4</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700">94%</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-800">XI-IPA 1</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">Senin, Jumat</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-500 font-mono tracking-tighter">10.00 - 12.00</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">38</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">77.2</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700">95%</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-800">XI-IPA 2</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">Rabu, Jumat</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-500 font-mono tracking-tighter">07.30 - 09.30</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">37</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">75.8</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700">91%</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-800">XII-IPA 1</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">Selasa, Kamis</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-500 font-mono tracking-tighter">10.00 - 12.00</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-600">39</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">78.3</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700">93%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[12px] font-medium text-gray-500">Menampilkan 5 dari 32 kelas</span>
              <button className="text-[12px] font-bold text-[#1e293b] flex items-center gap-1 hover:text-blue-600 transition-colors">
                Lihat semua kelas <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Card 3: Distribusi Rentang Nilai */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <h2 className="text-[15px] font-bold text-[#1e293b]">Distribusi Rentang Nilai — Semua Kelas</h2>
              </div>
              <span className="text-[12px] font-medium text-gray-500"><span className="font-bold text-gray-700">1,248</span> siswa</span>
            </div>

            {/* Simple Bar Chart Visualization */}
            <div className="flex items-end justify-between h-40 border-b border-gray-200 pb-2 mb-6 px-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-gray-700">62</span>
                <div className="w-16 bg-[#ef4444] rounded-t-md" style={{ height: '20px' }}></div>
                <span className="text-[11px] text-gray-400 font-medium absolute -bottom-6">&lt; 60</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-gray-700">148</span>
                <div className="w-16 bg-[#f97316] rounded-t-md" style={{ height: '45px' }}></div>
                <span className="text-[11px] text-gray-400 font-medium absolute -bottom-6">60-69</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-gray-700">186</span>
                <div className="w-16 bg-[#f59e0b] rounded-t-md" style={{ height: '60px' }}></div>
                <span className="text-[11px] text-gray-400 font-medium absolute -bottom-6">70-74</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-gray-700">312</span>
                <div className="w-16 bg-[#64748b] rounded-t-md" style={{ height: '90px' }}></div>
                <span className="text-[11px] text-gray-400 font-medium absolute -bottom-6">75-79</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-gray-700">368</span>
                <div className="w-16 bg-[#1e293b] rounded-t-md" style={{ height: '110px' }}></div>
                <span className="text-[11px] text-gray-400 font-medium absolute -bottom-6">80-89</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-gray-700">172</span>
                <div className="w-16 bg-[#10b981] rounded-t-md" style={{ height: '50px' }}></div>
                <span className="text-[11px] text-gray-400 font-medium absolute -bottom-6">90-100</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[11px] font-medium text-gray-500 mt-8 pl-4">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> Di atas KKM</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> Di bawah KKM</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span> Sangat rendah</div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:w-[340px] space-y-6">
                  {/* Card 1: Informasi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Informasi</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
                <span className="text-[13px] text-gray-500 font-medium">Kode</span>
                <span className="text-[13px] font-bold text-gray-800">{data.kode}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
                <span className="text-[13px] text-gray-500 font-medium">Kelompok</span>
                <span className="text-[13px] font-bold text-gray-800">{data.kelompok}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
                <span className="text-[13px] text-gray-500 font-medium">Kurikulum</span>
                <span className="text-[13px] font-bold text-gray-800">{data.kurikulum || "Kurikulum Merdeka"}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
                <span className="text-[13px] text-gray-500 font-medium">Jenjang</span>
                <span className="text-[13px] font-bold text-gray-800">
                  {data.jenjang ? data.jenjang.map(l => l.replace("Kelas ", "")).join(", ") : (data.levels || "")}
                </span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
                <span className="text-[13px] text-gray-500 font-medium">Jam / Minggu</span>
                <span className="text-[13px] font-bold text-gray-800">{data.jam || data.hours} jam</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
                <span className="text-[13px] text-gray-500 font-medium">Durasi Sesi</span>
                <span className="text-[13px] font-bold text-gray-800">{data.durasi || "45"} menit</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
                <span className="text-[13px] text-gray-500 font-medium">KKM</span>
                <span className="text-[13px] font-bold text-gray-800">{data.kkm || "75"}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[13px] text-gray-500 font-medium">Masuk Rapor</span>
                <span className="text-[13px] font-bold text-gray-800">{data.masukRapor ? "Ya" : "Tidak"}</span>
              </div>
            </div>
          </div>
 
          {/* Card 2: Guru Pengampu */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Guru Pengampu</h2>
            </div>
            
            {data.guru && data.guru.name && data.guru.name !== "-" ? (
              <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#1e293b] flex items-center justify-center text-white text-[14px] font-bold shadow-sm flex-shrink-0">
                  {data.guru.id || data.guru.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <div className="text-[14px] font-bold text-gray-800 truncate">{data.guru.name}</div>
                  <div className="text-[12px] text-gray-500 font-medium mb-1">{data.guru.role || "Guru Pengampu"}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 ${data.guru.status === 'Aktif' || data.aktif ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'} rounded text-[9px] font-bold tracking-widest uppercase`}>
                      {data.guru.status || "Aktif"}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400">NIP: 197804122005011003</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 text-xs font-medium">
                Belum ada guru pengampu
              </div>
            )}
          </div>
 
          {/* Card 3: Aksi Terkait */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <h2 className="text-[15px] font-bold text-[#1e293b]">Aksi Terkait</h2>
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <span className="text-[13px] font-bold text-gray-700">Lihat Jadwal Lengkap</span>
              </button>
              <button className="w-full flex items-center gap-3 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <span className="text-[13px] font-bold text-gray-700">Rekap Nilai Semua Kelas</span>
              </button>
              <button className="w-full flex items-center gap-3 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                </div>
                <span className="text-[13px] font-bold text-gray-700">Rekap Absensi</span>
              </button>
              <button 
                onClick={() => onDelete(data.kode)}
                className="w-full flex items-center gap-3 border border-red-100 bg-red-50/10 p-3 rounded-xl hover:bg-red-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
                <span className="text-[13px] font-bold text-red-600">Hapus Mata Pelajaran</span>
              </button>
            </div>
          </div>

          {/* Card 4: Informasi Data */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Informasi Data</div>
            <div className="space-y-3">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Dibuat</span>
                <span className="font-bold text-gray-800">17 Jul 2023</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Terakhir diperbarui</span>
                <span className="font-bold text-gray-800">12 Okt 2023</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Diperbarui oleh</span>
                <span className="font-bold text-gray-800">Siti Rahayu</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
