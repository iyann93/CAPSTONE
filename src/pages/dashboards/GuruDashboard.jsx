import React, { useState } from "react";
import GuruRiwayatTerimaGaji from "../../components/payroll/GuruRiwayatTerimaGaji";

const GuruDashboard = ({ user, activeMenu }) => {
  // We mock the "Slip Gaji" and "Riwayat & Terima Gaji" menus.
  // The user explicitly requested to focus on "Slip Gaji" for the design shown in the image.

  if (activeMenu === "Riwayat Terima Gaji") {
    return <GuruRiwayatTerimaGaji user={user} />;
  }
  if (activeMenu === "Dashboard") {
    return (
      <div className="p-8 w-full space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A3D63]">Dashboard Guru</h1>
          <p className="text-gray-500 text-sm mt-1">Selamat datang kembali, {user?.fullName || "Budi Santoso"}!</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Gaji */}
          <div className="bg-[#2A4B6D] rounded-[20px] border border-[#37587E] p-6 shadow-sm flex flex-col relative overflow-hidden group hover:bg-[#2E5175] transition-all duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start relative z-10 mb-4">
              <div className="text-white/70 text-sm font-bold tracking-wide uppercase">Gaji Bulan Ini</div>
              <div className="p-2 bg-white/10 text-[#FACC15] rounded-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><line x1="16" y1="21" x2="22" y2="15"/><line x1="22" y1="21" x2="16" y2="15"/></svg>
              </div>
            </div>
            <div className="text-2xl font-black text-white relative z-10">Rp 4.105.500</div>
            <div className="text-xs text-white/50 mt-2 font-medium relative z-10">Telah ditransfer: 28 Mei 2026</div>
          </div>

          {/* Card 2: Jadwal */}
          <div className="bg-[#2A4B6D] rounded-[20px] border border-[#37587E] p-6 shadow-sm flex flex-col relative overflow-hidden group hover:bg-[#2E5175] transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start relative z-10 mb-4">
              <div className="text-white/70 text-sm font-bold tracking-wide uppercase">Jadwal Hari Ini</div>
              <div className="p-2 bg-white/10 text-[#FACC15] rounded-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
            <div className="text-2xl font-black text-white relative z-10">3 Kelas</div>
            <div className="text-xs text-white/50 mt-2 font-medium relative z-10">Mulai pukul 07:30 WIB</div>
          </div>

          {/* Card 3: Siswa */}
          <div className="bg-[#2A4B6D] rounded-[20px] border border-[#37587E] p-6 shadow-sm flex flex-col relative overflow-hidden group hover:bg-[#2E5175] transition-all duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start relative z-10 mb-4">
              <div className="text-white/70 text-sm font-bold tracking-wide uppercase">Siswa Diajar</div>
              <div className="p-2 bg-white/10 text-[#FACC15] rounded-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div className="text-2xl font-black text-white relative z-10">128 Siswa</div>
            <div className="text-xs text-white/50 mt-2 font-medium relative z-10">Dari 4 kelas aktif</div>
          </div>

          {/* Card 4: Tugas */}
          <div className="bg-[#2A4B6D] rounded-[20px] border border-[#37587E] p-6 shadow-sm flex flex-col relative overflow-hidden group hover:bg-[#2E5175] transition-all duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start relative z-10 mb-4">
              <div className="text-white/70 text-sm font-bold tracking-wide uppercase">Perlu Dinilai</div>
              <div className="p-2 bg-white/10 text-[#FACC15] rounded-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
            </div>
            <div className="text-2xl font-black text-white relative z-10">12 Tugas</div>
            <div className="text-xs text-white/50 mt-2 font-medium relative z-10">Batas nilai besok</div>
          </div>
        </div>

        {/* Content Bawah: Jadwal & Pengumuman */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Jadwal Mengajar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Jadwal Mengajar Hari Ini</h2>
              <button className="text-[#1A3D63] text-sm font-semibold hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {[
                { time: "07:30 - 09:00", class: "VII A", subject: "Matematika Dasar", active: true },
                { time: "09:15 - 10:45", class: "VII B", subject: "Matematika Dasar", active: false },
                { time: "11:00 - 12:30", class: "VIII A", subject: "Matematika Lanjut", active: false },
              ].map((jadwal, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${jadwal.active ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'}`}>
                  <div className={`font-bold px-3 py-2 rounded-lg text-sm ${jadwal.active ? 'bg-[#1A3D63] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                    {jadwal.time}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      Kelas {jadwal.class}
                      {jadwal.active && <span className="bg-green-100 text-green-600 text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">Sedang Berlangsung</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">{jadwal.subject}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pengumuman */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Pengumuman Sekolah</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 relative overflow-hidden group hover:bg-blue-50 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="text-[10px] font-black px-2.5 py-1 rounded-md tracking-wide uppercase bg-blue-100 text-blue-600 mb-2 inline-flex items-center gap-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  AKADEMIK
                </div>
                <div className="font-bold text-gray-800 text-[15px] mb-2 leading-snug">Rapat Evaluasi Semester</div>
                <div className="text-[13px] text-gray-600 leading-relaxed">Akan diadakan rapat evaluasi pada hari Jumat, pukul 13:00 WIB di Ruang Guru. Kehadiran sangat diharapkan.</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 relative overflow-hidden group hover:bg-emerald-50 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                <div className="text-[10px] font-black px-2.5 py-1 rounded-md tracking-wide uppercase bg-emerald-100 text-emerald-600 mb-2 inline-flex items-center gap-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  KEUANGAN
                </div>
                <div className="font-bold text-gray-800 text-[15px] mb-2 leading-snug">Pencairan Gaji Mei</div>
                <div className="text-[13px] text-gray-600 leading-relaxed">Gaji bulan Mei 2026 telah ditransfer ke rekening masing-masing. Silakan cek menu Riwayat Terima Gaji untuk rincian.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }


  // Default to "Slip Gaji"
  return (
    <div className="p-8 max-w-5xl space-y-6">
      {/* Slip Gaji Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#1A3D63] px-8 py-6 flex justify-between items-center text-white">
          <div className="text-xl font-semibold">Mei 2026</div>
          <div className="text-xl font-semibold">Rp 4.105.500</div>
        </div>

        {/* Card Body */}
        <div className="p-8">
          {/* Employee Details Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">NIP</div>
              <div className="text-sm font-semibold text-gray-800">1988007</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">NAMA</div>
              <div className="text-sm font-semibold text-gray-800">{user?.fullName || "Budi Santoso, S.Pd"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">JABATAN</div>
              <div className="text-sm font-semibold text-gray-800">Guru Matematika</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">GOLONGAN</div>
              <div className="text-sm font-semibold text-gray-800">III/b</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">UNIT KERJA</div>
              <div className="text-sm font-semibold text-gray-800">SMPN 1 Contoh</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">REKENING</div>
              <div className="text-sm font-semibold text-gray-800">BRI — 00987 6543 2100</div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Gaji Pokok */}
          <div className="flex justify-between items-center py-2">
            <div className="text-sm text-gray-600">Gaji Pokok</div>
            <div className="text-sm font-bold text-gray-800">Rp 3.500.000</div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Tunjangan */}
          <div className="mb-2">
            <div className="text-xs font-bold text-emerald-500 tracking-wider uppercase mb-4">TUNJANGAN</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Tunjangan Jabatan</span>
                <span className="text-emerald-500 font-medium">+Rp 400.000</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Tunjangan Kehadiran</span>
                <span className="text-emerald-500 font-medium">+Rp 350.000</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Tunjangan Transport</span>
                <span className="text-emerald-500 font-medium">+Rp 250.000</span>
              </div>
            </div>
            <div className="border-t border-dotted border-gray-200 my-4"></div>
            <div className="flex justify-between items-center text-sm font-bold text-gray-800">
              <span>Total Tunjangan</span>
              <span className="text-emerald-500">+Rp 1.000.000</span>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Potongan */}
          <div>
            <div className="text-xs font-bold text-red-500 tracking-wider uppercase mb-4">POTONGAN</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>BPJS Kesehatan</span>
                <span className="text-red-500 font-medium">-Rp 87.500</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>BPJS Ketenagakerjaan</span>
                <span className="text-red-500 font-medium">-Rp 52.500</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>PPh 21</span>
                <span className="text-red-500 font-medium">-Rp 154.500</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Koperasi</span>
                <span className="text-red-500 font-medium">-Rp 100.000</span>
              </div>
            </div>
            <div className="border-t border-dotted border-gray-200 my-4"></div>
            <div className="flex justify-between items-center text-sm font-bold text-gray-800">
              <span>Total Potongan</span>
              <span className="text-red-500">-Rp 394.500</span>
            </div>
          </div>

          {/* Gaji Bersih */}
          <div className="bg-emerald-50/50 -mx-8 px-8 py-6 flex justify-between items-center mt-8">
            <div>
              <div className="text-sm font-medium text-gray-500">Gaji Bersih Diterima</div>
              <div className="text-xs text-gray-400 mt-1">Gaji Pokok + Tunjangan - Potongan</div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">Rp 4.105.500</div>
          </div>

          <div className="border-t border-gray-100 -mx-8"></div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Cetak
            </button>
            <button className="flex-1 py-3 bg-[#1A3D63] text-white font-semibold rounded-lg flex justify-center items-center gap-2 hover:bg-[#1A3D63]/90 transition-colors">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Unduh PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuruDashboard;
