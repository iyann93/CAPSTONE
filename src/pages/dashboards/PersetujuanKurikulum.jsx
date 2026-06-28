import React, { useState } from "react";

const mockKurikulum = [
  { id: 1, tahunAjaran: "2024/2025", semester: "Ganjil", pengaju: "Budi Santoso (Wakil Kurikulum)", tanggal: "20 Jun 2024", status: "Menunggu", deskripsi: "Pembaruan silabus Matematika dan penambahan jam Ekstrakurikuler." },
  { id: 2, tahunAjaran: "2023/2024", semester: "Genap", pengaju: "Budi Santoso (Wakil Kurikulum)", tanggal: "15 Jan 2024", status: "Disetujui", deskripsi: "Penyesuaian jam belajar selama bulan Ramadhan." },
];

const PersetujuanKurikulum = () => {
  const [data, setData] = useState(mockKurikulum);
  const [selected, setSelected] = useState(null);

  const handleAction = (id, newStatus) => {
    setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
    setSelected(null);
    alert(`Pengajuan kurikulum berhasil ${newStatus.toLowerCase()}!`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fadeIn min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Persetujuan Kurikulum</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Persetujuan Kurikulum</h1>
        <p className="text-[14px] text-gray-500 mt-1">Kelola dan tinjau pengajuan kurikulum dari Wakil Kepala Sekolah.</p>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Tahun Ajaran</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Pengaju</th>
                <th className="px-6 py-4">Tanggal Diajukan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">{item.tahunAjaran}</td>
                  <td className="px-6 py-4 text-gray-600">{item.semester}</td>
                  <td className="px-6 py-4 text-gray-600">{item.pengaju}</td>
                  <td className="px-6 py-4 text-gray-500">{item.tanggal}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                      item.status === "Disetujui" ? "bg-green-50 text-green-600 border border-green-100" :
                      item.status === "Ditolak" ? "bg-red-50 text-red-600 border border-red-100" :
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
                      Periksa Detail
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Tidak ada pengajuan kurikulum saat ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#1e293b]">Detail Pengajuan Kurikulum</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[12px] text-gray-500 mb-1">Tahun Ajaran / Semester</p>
                  <p className="text-[14px] font-bold text-gray-800">{selected.tahunAjaran} — {selected.semester}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[12px] text-gray-500 mb-1">Tanggal Diajukan</p>
                  <p className="text-[14px] font-bold text-gray-800">{selected.tanggal}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[12px] text-gray-500 mb-1">Pengaju</p>
                <p className="text-[14px] font-bold text-gray-800">{selected.pengaju}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[12px] text-gray-500 mb-2">Deskripsi / Perubahan</p>
                <p className="text-[14px] text-gray-700 leading-relaxed">{selected.deskripsi}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <span className="text-[13px] font-bold text-blue-700 underline cursor-pointer">Lihat Dokumen Lengkap (PDF)</span>
              </div>
            </div>
            
            {selected.status === "Menunggu" ? (
              <div className="px-6 py-5 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => handleAction(selected.id, "Ditolak")}
                  className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                >
                  Tolak Revisi
                </button>
                <button
                  onClick={() => handleAction(selected.id, "Disetujui")}
                  className="flex-1 py-3 bg-[#1A3D63] text-white rounded-xl font-bold hover:bg-[#163256] transition-colors"
                >
                  Setujui Kurikulum
                </button>
              </div>
            ) : (
              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <p className="text-center text-[14px] text-gray-500 font-medium">
                  Pengajuan ini telah <strong className={selected.status === "Disetujui" ? "text-green-600" : "text-red-600"}>{selected.status}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersetujuanKurikulum;
