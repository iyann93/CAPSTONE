import React, { useState } from "react";

const mockSiswa = [
  { id: 1, nisn: "0012345678", nama: "Ahmad Fauzi", kelas: "XII IPA 1", nilaiRata: 88.5, kehadiran: "98%", status: "Menunggu Validasi" },
  { id: 2, nisn: "0012345679", nama: "Siti Aminah", kelas: "XII IPA 1", nilaiRata: 82.0, kehadiran: "95%", status: "Valid (Lulus)" },
  { id: 3, nisn: "0012345680", nama: "Budi Santoso", kelas: "XII IPS 2", nilaiRata: 74.5, kehadiran: "80%", status: "Belum Valid" },
];

const ValidasiKelulusan = () => {
  const [data, setData] = useState(mockSiswa);
  const [selected, setSelected] = useState(null);

  const handleValidation = (id, newStatus) => {
    setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
    setSelected(null);
    if(newStatus === "Valid (Lulus)") {
      alert("✅ Data berhasil divalidasi. Siswa dinyatakan Lulus!");
    } else {
      alert("⚠️ Data dikembalikan ke Wali Kelas untuk diperbaiki.");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fadeIn min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Validasi Kelulusan</span>
      </div>
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Validasi Data Kelulusan</h1>
        <p className="text-[14px] text-gray-500 mt-1">Periksa kelengkapan nilai dan absensi calon lulusan sebelum menetapkan kelulusan akhir.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">NISN</th>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Rata-rata Nilai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-600">{item.nisn}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{item.nama}</td>
                  <td className="px-6 py-4 text-gray-600">{item.kelas}</td>
                  <td className="px-6 py-4 text-gray-600">{item.nilaiRata}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                      item.status === "Valid (Lulus)" ? "bg-green-50 text-green-600 border border-green-100" :
                      item.status === "Belum Valid" ? "bg-red-50 text-red-600 border border-red-100" :
                      "bg-yellow-50 text-yellow-600 border border-yellow-100"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelected(item)}
                      className="px-4 py-2 bg-[#F4F6FA] text-[#1A3D63] rounded-xl text-[13px] font-bold hover:bg-[#EBF3FA] transition-colors"
                    >
                      Periksa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-[18px] font-bold text-[#1e293b]">Pemeriksaan Data Siswa</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-[#1A3D63] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
                  {selected.nama.charAt(0)}
                </div>
                <div>
                  <p className="text-[18px] font-bold text-gray-800">{selected.nama}</p>
                  <p className="text-[13px] text-gray-500">NISN: {selected.nisn} | {selected.kelas}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 p-4 rounded-xl bg-white shadow-sm">
                  <p className="text-[12px] text-gray-500 mb-1">Rata-rata Nilai (Semester 1-6)</p>
                  <p className="text-[18px] font-bold text-[#1A3D63]">{selected.nilaiRata}</p>
                  {selected.nilaiRata >= 75 ? (
                    <p className="text-[11px] text-green-600 font-bold mt-1">✓ Memenuhi KKM</p>
                  ) : (
                    <p className="text-[11px] text-red-600 font-bold mt-1">⚠ Di bawah KKM</p>
                  )}
                </div>
                <div className="border border-gray-100 p-4 rounded-xl bg-white shadow-sm">
                  <p className="text-[12px] text-gray-500 mb-1">Tingkat Kehadiran</p>
                  <p className="text-[18px] font-bold text-[#1A3D63]">{selected.kehadiran}</p>
                  {parseInt(selected.kehadiran) >= 90 ? (
                    <p className="text-[11px] text-green-600 font-bold mt-1">✓ Kehadiran Baik</p>
                  ) : (
                    <p className="text-[11px] text-red-600 font-bold mt-1">⚠ Kehadiran Kurang</p>
                  )}
                </div>
              </div>
            </div>
            
            {selected.status === "Menunggu Validasi" ? (
              <div className="px-6 py-5 border-t border-gray-100 flex gap-3 bg-gray-50">
                <button
                  onClick={() => handleValidation(selected.id, "Belum Valid")}
                  className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                >
                  Tandai Belum Valid
                </button>
                <button
                  onClick={() => handleValidation(selected.id, "Valid (Lulus)")}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
                >
                  Validasi &amp; Luluskan
                </button>
              </div>
            ) : (
              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
                <p className="text-center text-[14px] text-gray-500 font-medium">
                  Status data kelulusan ini adalah <strong className={selected.status === "Valid (Lulus)" ? "text-green-600" : "text-red-600"}>{selected.status}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidasiKelulusan;
