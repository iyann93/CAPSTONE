import React, { useState } from "react";

const mockBeasiswa = [
  { 
    id: 1, 
    nama: "Beasiswa Prestasi Akademik", 
    jenis: "Prestasi Akademik", 
    nominal: "Rp 500.000", 
    periode: "2025/2026", 
    status: "Aktif",
    keterangan: "Beasiswa yang diberikan kepada siswa dengan peringkat 1 paralel. Potongan ini akan mengurangi tagihan bulanan siswa secara otomatis.",
    tanggalDitetapkan: "15 Juli 2025",
    sumberDana: "Yayasan Muhammadiyah",
    persyaratan: "Mempertahankan nilai rata-rata minimal 85 di setiap semester dan tidak memiliki catatan pelanggaran tata tertib berat."
  }
];

const BeasiswaSiswa = () => {
  const [selectedProgram, setSelectedProgram] = useState(mockBeasiswa[0]);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Beasiswa</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Program Beasiswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">Ahmad Fauzi · Kelas VIII A · Rincian program beasiswa yang sedang berjalan</p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Program List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-[15px] font-bold text-gray-800 mb-2">Daftar Program</h3>
          {mockBeasiswa.map((item) => {
            const isSelected = selectedProgram?.id === item.id;
            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedProgram(item)}
                className={`bg-white border rounded-2xl p-4 shadow-sm cursor-pointer transition-all ${
                  isSelected ? "border-[#1A3D63] ring-1 ring-[#1A3D63]" : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-[15px] font-bold ${isSelected ? "text-[#1A3D63]" : "text-gray-800"} truncate pr-2`}>{item.nama}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                      item.status === "Aktif" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500">{item.jenis}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Program Detail Panel */}
        <div className="lg:col-span-2">
          {selectedProgram ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 animate-fadeIn h-full">
              {/* Header Title */}
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-[26px] font-bold text-gray-800 capitalize leading-tight">{selectedProgram.nama}</h2>
                <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${
                  selectedProgram.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {selectedProgram.status}
                </span>
              </div>
              <p className="text-[14px] text-gray-500 mb-8">Periode {selectedProgram.periode}</p>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nominal Bantuan</p>
                  <p className="text-[16px] font-bold text-gray-800">{selectedProgram.nominal}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kategori</p>
                  <p className="text-[14px] font-bold text-gray-800">{selectedProgram.jenis}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sumber Dana</p>
                  <p className="text-[14px] font-bold text-gray-800">{selectedProgram.sumberDana}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Ditetapkan</p>
                  <p className="text-[14px] font-bold text-gray-800">{selectedProgram.tanggalDitetapkan}</p>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 pt-6 mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Deskripsi Program</p>
                <p className="text-[14px] text-gray-600 leading-relaxed">{selectedProgram.keterangan || "Belum ada deskripsi spesifik untuk program beasiswa ini."}</p>
              </div>

              {/* Persyaratan */}
              <div className="border-t border-gray-100 pt-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Persyaratan</p>
                <p className={`text-[14px] leading-relaxed ${selectedProgram.persyaratan ? "text-gray-600" : "text-gray-400 italic"}`}>
                  {selectedProgram.persyaratan || "Belum ada persyaratan khusus."}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[14px]">Pilih program beasiswa di samping<br/>untuk melihat detailnya.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeasiswaSiswa;
