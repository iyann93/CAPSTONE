import React from "react";

const ClassDetail = ({ setView, selectedClass }) => {
  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] font-medium text-gray-500 mb-1">
        Dashboard <span className="mx-2">›</span> Data Kelas <span className="mx-2">›</span> <span className="text-[#1e293b] font-bold">Detail</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("list")}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">{selectedClass?.name || "Detail Kelas"}</h1>
              <span className="text-[13px] text-gray-400 font-bold uppercase tracking-wider">{selectedClass?.code || "-"}</span>
              <span className="bg-[#ECFDF5] text-[#059669] text-[11px] font-bold px-2.5 py-1 rounded-full">{selectedClass?.status || "Aktif"}</span>
            </div>
            <p className="text-[14px] text-gray-500 mt-1">{selectedClass?.year || "-"}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Ekspor Data
          </button>
          <button
            onClick={() => setView("edit")}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Kelas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <div className="text-[28px] font-black text-[#1e293b] leading-none mb-1">{selectedClass?.students || 0}</div>
            <div className="text-[12px] font-bold text-gray-500">Jumlah Siswa</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Kapasitas {selectedClass?.capacity || 36}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <div>
            <div className="text-[28px] font-black text-[#1e293b] leading-none mb-1">7</div>
            <div className="text-[12px] font-bold text-gray-500">Mata Pelajaran</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Per semester</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <div className="text-[28px] font-black text-[#1e293b] leading-none mb-1">12</div>
            <div className="text-[12px] font-bold text-gray-500">Jam / Minggu</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Jam pelajaran</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#FDF4FF] text-[#D946EF] flex items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <div>
            <div className="text-[28px] font-black text-[#1e293b] leading-none mb-1">85.3</div>
            <div className="text-[12px] font-bold text-gray-500">Rata-rata Nilai</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Semester ini</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3B82F6]">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <h3 className="text-[15px] font-bold text-[#1e293b]">Jadwal Pelajaran</h3>
              </div>
              <span className="text-[12px] font-medium text-gray-400">Ganjil 2023/2024</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Hari</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Mata Pelajaran</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Guru</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Jam Mulai</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Jam Selesai</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Ruangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#3B82F6]">Senin</td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#1e293b]">Matematika</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Drs. Hendra, M.Pd</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">07:00</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">08:30</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Ruang 101</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#3B82F6]">Senin</td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#1e293b]">Bahasa Indonesia</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Ibu Rini, S.Pd</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">08:30</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">10:00</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Ruang 101</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#3B82F6]">Selasa</td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#1e293b]">Fisika</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Bpk. Eko, M.Si</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">07:00</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">08:30</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Lab Fisika</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#3B82F6]">Selasa</td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#1e293b]">Kimia</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Ibu Dewi, S.Pd</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">08:30</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">10:00</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Lab Kimia</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3B82F6]">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <h3 className="text-[15px] font-bold text-[#1e293b]">Daftar Siswa</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-gray-400">{selectedClass?.students || 0} siswa</span>
                <button className="text-[12px] font-bold text-[#3B82F6] hover:underline">Lihat Semua</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">No</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">NIS</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Nama Siswa</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">L/P</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(selectedClass?.studentsList || []).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-[13px] text-gray-500 font-medium">Belum ada siswa terdaftar di kelas ini</td>
                    </tr>
                  ) : (
                    (selectedClass?.studentsList || []).map((siswa, idx) => (
                      <tr key={siswa.id || idx} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 text-[13px] text-gray-500">{idx + 1}</td>
                        <td className="px-5 py-3.5 text-[13px] text-gray-600">{siswa.nis || "-"}</td>
                        <td className="px-5 py-3.5 text-[14px] font-bold text-[#1e293b]">{siswa.nama_lengkap || siswa.name}</td>
                        <td className="px-5 py-3.5">
                          <span className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center ${siswa.jenis_kelamin === 'P' ? 'bg-[#FDF2F8] text-[#DB2777]' : 'bg-[#EFF6FF] text-[#3B82F6]'}`}>
                            {siswa.jenis_kelamin || "L"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[12px] font-bold ${siswa.status_siswa === 'aktif' ? 'text-[#059669]' : 'text-gray-500'}`}>
                            {siswa.status_siswa === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[#3B82F6]">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Wali Kelas</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#818CF8] text-white flex items-center justify-center font-bold text-lg">{(selectedClass?.teacher || "U")[0]}</div>
              <div>
                <div className="text-[14px] font-bold text-[#1e293b]">{selectedClass?.teacher || "Belum Ditentukan"}</div>
                <div className="text-[11px] text-gray-400">Guru Wali Kelas</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Kelas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-[13px] text-gray-500">Kode Kelas</span>
                <span className="text-[13px] font-bold text-[#1e293b]">{selectedClass?.code || "-"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-[13px] text-gray-500">Tingkat</span>
                <span className="text-[13px] font-bold text-[#1e293b]">{selectedClass?.level || "-"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-[13px] text-gray-500">Jurusan</span>
                <span className="bg-[#EFF6FF] text-[#3B82F6] text-[11px] font-bold px-2 py-0.5 rounded">{selectedClass?.major || "-"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-[13px] text-gray-500">Tahun Ajaran</span>
                <span className="text-[13px] font-bold text-[#1e293b]">{selectedClass?.year || "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Kapasitas Kelas</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-gray-500">Siswa terdaftar</span>
              <span className="text-[13px] font-bold text-[#1e293b]">{selectedClass?.students || 0}/{selectedClass?.capacity || 36}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${Math.round(((selectedClass?.students || 0)/(selectedClass?.capacity || 36))*100)}%` }}></div>
            </div>
            <div className="text-[11px] text-gray-400">{Math.round(((selectedClass?.students || 0)/(selectedClass?.capacity || 36))*100)}% terisi</div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#3B82F6]">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Ruangan</h3>
            </div>
            <div className="text-[16px] font-bold text-[#1e293b]">Ruang 101</div>
            <div className="text-[12px] text-gray-400">Ruangan belajar tetap</div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Dibuat</span>
                <span className="text-[13px] text-[#1e293b] font-medium">12 Jul 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Diperbarui</span>
                <span className="text-[13px] text-[#1e293b] font-medium">5 Nov 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Status</span>
                <span className="text-[#059669] text-[13px] font-bold">Aktif</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-[24px] border border-gray-200 p-5">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Aksi Terkait</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors group">
                <span className="text-[13px] font-bold text-[#3B82F6]">Lihat Jadwal Lengkap</span>
                <svg width="16" height="16" fill="none" stroke="#3B82F6" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button className="w-full flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors group">
                <span className="text-[13px] font-bold text-[#3B82F6]">Rekap Nilai Siswa</span>
                <svg width="16" height="16" fill="none" stroke="#3B82F6" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button className="w-full flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors group">
                <span className="text-[13px] font-bold text-[#3B82F6]">Rekap Absensi Kelas</span>
                <svg width="16" height="16" fill="none" stroke="#3B82F6" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button className="w-full flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors group">
                <span className="text-[13px] font-bold text-[#3B82F6]">Generate Rapor Kelas</span>
                <svg width="16" height="16" fill="none" stroke="#3B82F6" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
