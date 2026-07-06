import React, { useState } from "react";
import ReactDOM from "react-dom";

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

      {/* Modal Detail - rendered via Portal to escape overflow:hidden */}
      {selected && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-[18px] font-bold text-[#1e293b]">Detail Pengajuan Kurikulum</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Tinjau usulan perubahan kurikulum sekolah</p>
              </div>
              <button 
                onClick={() => setSelected(null)} 
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Tutup Modal"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Tahun Ajaran / Semester</p>
                    <p className="text-[14px] font-bold text-gray-800 mt-0.5">{selected.tahunAjaran} — {selected.semester}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Tanggal Diajukan</p>
                    <p className="text-[14px] font-bold text-gray-800 mt-0.5">{selected.tanggal}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Pengaju</p>
                  <p className="text-[14px] font-bold text-gray-800 mt-0.5">{selected.pengaju}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Deskripsi / Perubahan</p>
                  <p className="text-[14px] text-gray-700 leading-relaxed mt-1 font-medium">{selected.deskripsi}</p>
                </div>
              </div>

              <div className="bg-blue-50/50 hover:bg-blue-50 p-4 rounded-xl border border-blue-100 hover:border-blue-200 transition-all flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-105 transition-transform shrink-0">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-blue-800">Dokumen Lampiran Kurikulum</p>
                    <p className="text-[11px] text-blue-500">Klik untuk melihat berkas PDF lengkap</p>
                  </div>
                </div>
                <div className="text-blue-600 group-hover:translate-VII-1 transition-transform">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            {selected.status === "Menunggu" ? (
              <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors order-last sm:order-first"
                >
                  Kembali
                </button>
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
              <div className="px-6 py-5 border-t border-gray-100 flex flex-col gap-4 bg-gray-50 rounded-b-2xl">
                <p className="text-center text-[14px] text-gray-500 font-medium">
                  Pengajuan ini telah <strong className={selected.status === "Disetujui" ? "text-green-600" : "text-red-600"}>{selected.status}</strong>.
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PersetujuanKurikulum;



