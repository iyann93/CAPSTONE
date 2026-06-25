import React, { useState } from "react";

const mockRapor = [
  { id: 1, semester: "Genap 2024/2025", tanggal: "15 Jun 2025", status: "Tersedia", rataRata: 84.5, peringkat: 5 },
  { id: 2, semester: "Ganjil 2024/2025", tanggal: "10 Jan 2025", status: "Tersedia", rataRata: 81.2, peringkat: 7 },
  { id: 3, semester: "Genap 2023/2024", tanggal: "14 Jun 2024", status: "Tersedia", rataRata: 79.8, peringkat: 9 },
  { id: 4, semester: "Ganjil 2025/2026", tanggal: "—", status: "Belum Tersedia", rataRata: null, peringkat: null },
];

const RaporSiswa = ({ user }) => {
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded] = useState([]);
  const [preview, setPreview] = useState(null);

  const studentName = user?.anak?.nama || "Ahmad Fauzi";
  const studentClass = user?.anak?.kelas || "VIII A";

  const handleDownload = (rapor) => {
    if (rapor.status !== "Tersedia") return;
    setDownloading(rapor.id);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(prev => [...prev, rapor.id]);
      alert(`✅ Rapor ${rapor.semester} berhasil diunduh!`);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Unduh Rapor</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Unduh Rapor Siswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">{studentName} · Kelas {studentClass} · Daftar rapor yang tersedia untuk diunduh</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
        <div>
          <p className="text-[13px] font-bold text-blue-800">Informasi Rapor</p>
          <p className="text-[13px] text-blue-600 mt-0.5">Rapor tersedia dalam format PDF. Unduh dan simpan sebagai arsip perkembangan belajar putra/putri Anda.</p>
        </div>
      </div>

      {/* Rapor List */}
      <div className="space-y-4">
        {mockRapor.map((rapor) => {
          const isAvailable = rapor.status === "Tersedia";
          const isDownloading = downloading === rapor.id;
          const isDownloaded = downloaded.includes(rapor.id);

          return (
            <div key={rapor.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isAvailable ? "border-gray-100 hover:shadow-md" : "border-gray-100 opacity-70"}`}>
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isAvailable ? "bg-[#1A3D63]" : "bg-gray-200"}`}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-[16px] font-bold text-gray-800">Rapor {rapor.semester}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isAvailable ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-500"}`}>
                      {rapor.status}
                    </span>
                    {isDownloaded && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        ✓ Sudah Diunduh
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[13px] text-gray-400 flex items-center gap-1">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      Tanggal Rilis: {rapor.tanggal}
                    </span>
                    {rapor.rataRata && (
                      <span className="text-[13px] text-gray-400 flex items-center gap-1">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        Rata-rata: <strong className="text-gray-700">{rapor.rataRata}</strong>
                      </span>
                    )}
                    {rapor.peringkat && (
                      <span className="text-[13px] text-gray-400 flex items-center gap-1">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                        Peringkat: <strong className="text-gray-700">#{rapor.peringkat}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAvailable && (
                    <button
                      onClick={() => setPreview(rapor)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Pratinjau
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(rapor)}
                    disabled={!isAvailable || isDownloading}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-colors ${
                      !isAvailable
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isDownloading
                        ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                        : isDownloaded
                        ? "bg-green-50 text-green-700 border border-green-100 hover:bg-green-100"
                        : "bg-[#1A3D63] text-white hover:bg-[#163256]"
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        Mengunduh...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        {isDownloaded ? "Unduh Ulang" : "Unduh PDF"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Pratinjau */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[560px] shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#1e293b]">Pratinjau Rapor — {preview.semester}</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
                <div className="w-16 h-16 bg-[#1A3D63] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h4 className="text-[16px] font-bold text-gray-800">RAPOR AKADEMIK</h4>
                <p className="text-[13px] text-gray-500 mt-1">Semester {preview.semester}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Nama Siswa</p>
                    <p className="text-[13px] font-bold text-gray-800">{studentName}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Kelas</p>
                    <p className="text-[13px] font-bold text-gray-800">{studentClass}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Rata-rata Nilai</p>
                    <p className="text-[13px] font-bold text-green-600">{preview.rataRata}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-[11px] text-gray-400">Peringkat Kelas</p>
                    <p className="text-[13px] font-bold text-blue-600">#{preview.peringkat}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setPreview(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">
                Tutup
              </button>
              <button
                onClick={() => { handleDownload(preview); setPreview(null); }}
                className="flex-1 py-3 bg-[#1A3D63] hover:bg-[#163256] text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaporSiswa;
