import React, { useState, useEffect } from "react";
import { getTagihan, uploadBuktiSpp } from "../../api/finance";

const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const getBulanNama = (b) => ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][b-1];

const TagihanSPP = ({ user, onNavigate }) => {
  const [tagihan, setTagihan] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // States untuk Upload Bukti
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTagihanId, setSelectedTagihanId] = useState("");

  const loadData = async () => {
    try {
      setLoadingData(true);
      const res = await getTagihan({ limit: 5000 });
      const arr = Array.isArray(res) ? res : [];
      
      const anakId = user?.anak?.id;
      const anakNis = user?.anak?.nis;
      const anakNisn = user?.anak?.nisn;
      const anakNama = user?.anak?.nama;

      const myTagihans = arr.filter(t => 
         (anakId && t.id_siswa === anakId) ||
         (anakNis && t.nis === anakNis) ||
         (anakNama && (t.nama_siswa === anakNama || t.nama === anakNama)) ||
         (anakNisn && t.nisn === anakNisn)
      );

      setTagihan(myTagihans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validasi format file
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(selectedFile.type)) {
        triggerToast("Format file tidak didukung. Mohon unggah file JPG, PNG, atau PDF.", "error");
        e.target.value = null;
        return;
      }
      
      // Validasi ukuran file (Max 5MB)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (selectedFile.size > maxSizeBytes) {
        triggerToast("Ukuran file terlalu besar. Maksimal 5MB.", "error");
        e.target.value = null;
        return;
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTagihanId) {
      triggerToast("Silakan pilih tagihan yang ingin dibayar.", "error");
      return;
    }
    if (!file) {
      triggerToast("Silakan unggah bukti transfer terlebih dahulu.", "error");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bukti", file);
      await uploadBuktiSpp(selectedTagihanId, formData);
      triggerToast("Bukti pembayaran berhasil diunggah! Menunggu konfirmasi bendahara.");
      setFile(null);
      setPreviewUrl(null);
      setSelectedTagihanId("");
      loadData();
    } catch (err) {
      console.error(err);
      triggerToast(err?.response?.data?.message || "Gagal mengunggah bukti pembayaran", "error");
    } finally {
      setLoading(false);
    }
  };

  const getNominalTagihan = (t) => {
    const baseNominal = Number(t.nominal || 0);
    const potongan = Number(t.potongan || 0);
    const nominalAkhir = (t.nominal_akhir !== undefined && t.nominal_akhir !== null) 
       ? Number(t.nominal_akhir) 
       : (baseNominal - potongan);
    return Math.max(0, nominalAkhir);
  };

  const lunas = tagihan.filter(t => t.status === "lunas").length;
  const belumLunas = tagihan.filter(t => t.status === "belum_bayar" || t.status === "ditolak").length;
  const menunggu = tagihan.filter(t => t.status === "menunggu_konfirmasi").length;
  
  const totalLunas = tagihan.filter(t => t.status === "lunas").reduce((a, c) => a + getNominalTagihan(c), 0);
  
  // Breakdown Tagihan Aktif
  const tagihanAktif = tagihan.filter(t => t.status === "belum_bayar" || t.status === "menunggu_konfirmasi" || t.status === "ditolak");
  const totalOriginal = tagihanAktif.reduce((a, c) => a + Number(c.nominal), 0);
  const totalPotongan = tagihanAktif.reduce((a, c) => a + Number(c.potongan || 0), 0);
  const totalHarusDibayar = tagihanAktif.reduce((a, c) => a + getNominalTagihan(c), 0);

  const tagihanBelumBayar = tagihan.filter(t => t.status === "belum_bayar" || t.status === "ditolak");
  const ditolakCount = tagihan.filter(t => t.status === "ditolak").length;

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 transform transition-all animate-slideUp border ${
          toast.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {toast.type === "success" ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Tagihan SPP</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Tagihan SPP</h1>
          <p className="text-[14px] text-gray-500 mt-1">Pembayaran SPP dan Konfirmasi</p>
        </div>
      </div>

      {/* Warning Banner Ditolak */}
      {ditolakCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-red-800">Pembayaran Ditolak</h3>
            <p className="text-[13px] text-red-600 mt-1">
              Bukti pembayaran untuk {ditolakCount} tagihan Anda ditolak oleh bendahara. Silakan pilih tagihan tersebut di bawah dan unggah ulang bukti pembayaran yang benar.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Tagihan Aktif */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all md:col-span-1">
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Tagihan Aktif</p>
          </div>
          <p className="text-[26px] font-black leading-tight text-[#1e293b]">{fmt(totalHarusDibayar)}</p>
          <p className="text-[12px] mt-1 font-medium text-gray-500">{belumLunas + menunggu} bulan belum lunas</p>
        </div>

        {/* Other Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
          {[
            { label: "Total Sudah Dibayar", val: fmt(totalLunas), sub: `Total tagihan lunas` },
            { label: "Proses Verifikasi", val: menunggu + " Tagihan", sub: "Menunggu konfirmasi bendahara", highlight: menunggu > 0 },
          ].map((card, i) => (
            <div key={i} className={`rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all ${
              card.highlight ? "bg-amber-50 border border-amber-100 ring-1 ring-amber-100" : "bg-white border border-gray-100"
            }`}>
              <div className="flex items-center gap-1.5 mb-2">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${card.highlight ? "text-amber-600" : "text-gray-400"}`}>{card.label}</p>
              </div>
              <p className={`text-[26px] font-black leading-tight ${card.highlight ? "text-amber-600" : "text-[#1e293b]"}`}>{card.val}</p>
              {card.sub && <p className={`text-[12px] mt-1 font-medium ${card.highlight ? "text-amber-500" : "text-gray-500"}`}>{card.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Pembayaran Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info Rekening Bendahara */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-[16px] font-bold text-gray-800">Tujuan Pembayaran</h3>
          <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-bold text-[#1A3D63] text-lg shrink-0">
                BCA
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-gray-800">Bank Central Asia (BCA)</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">a/n MBS Prambanan</p>
                
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[22px] font-black text-[#1A3D63] tracking-wider">882145679901</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-100 text-[12px] text-gray-500">
              <strong className="text-gray-700">Instruksi:</strong> Silakan lakukan transfer ke nomor rekening di atas sejumlah tagihan, lalu unggah buktinya pada form bukti pembayaran.
            </div>
          </div>
        </div>

        {/* Upload Proof */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full space-y-4">
          <h3 className="text-[16px] font-bold text-gray-800">Konfirmasi Pembayaran</h3>
          
          <div>
            <label className="block text-[12px] font-bold text-gray-500 mb-1.5 uppercase">Pilih Tagihan <span className="text-red-500">*</span></label>
            <select
              value={selectedTagihanId}
              onChange={(e) => setSelectedTagihanId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-400"
            >
              <option value="">-- Pilih Bulan Tagihan --</option>
              {tagihanBelumBayar.map(t => (
                <option key={t.id} value={t.id}>
                  Bulan {getBulanNama(t.bulan)} {t.tahun} - {fmt(getNominalTagihan(t))}
                </option>
              ))}
            </select>
          </div>

          {previewUrl ? (
            <div className="flex-1 border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-white shadow-sm min-h-[80px]">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center relative group">
                  {file?.type?.includes("image") ? (
                    <>
                      <img src={previewUrl} alt="Preview Bukti" className="w-full h-full object-cover cursor-pointer" onClick={() => setShowPreviewModal(true)} />
                      <div onClick={() => setShowPreviewModal(true)} className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2" className="cursor-pointer" onClick={() => setShowPreviewModal(true)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <div onClick={() => setShowPreviewModal(true)} className="absolute inset-0 bg-black/5 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col min-w-0 pr-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowPreviewModal(true)}>
                  <span className="text-[13px] font-bold text-gray-800 truncate">{file?.name}</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">{(file?.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setFile(null); setPreviewUrl(null); }}
                className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
                title="Hapus File"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer transition-colors relative bg-gray-50/50 min-h-[160px]">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-[#1A3D63] rounded-full flex items-center justify-center mx-auto">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-700">Pilih File Bukti Bayar</p>
                  <p className="text-[11px] text-gray-400 mt-1">Format JPG, PNG, atau PDF (Max 5MB)</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file || !selectedTagihanId}
            className={`w-full py-3.5 text-[14px] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
              loading ? "bg-blue-100 text-blue-400 cursor-not-allowed" : (!file || !selectedTagihanId) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#1A3D63] hover:bg-[#122A44] text-white"
            }`}
          >
            {loading ? "Mengunggah Bukti..." : "Kirim Konfirmasi Pembayaran"}
          </button>
        </form>
      </div>

      {/* File Preview Modal */}
      {showPreviewModal && previewUrl && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPreviewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full flex flex-col max-h-[90vh] animate-scaleUp">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="font-bold text-gray-800 text-[15px] truncate pr-4">{file?.name || 'Preview Dokumen'}</h3>
              <button onClick={() => setShowPreviewModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4">
              {file?.type?.includes("pdf") ? (
                <object data={previewUrl} type="application/pdf" className="w-full h-[70vh] rounded-lg shadow-sm">
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <svg width="48" height="48" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24" className="mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    <p className="text-gray-500 text-sm font-medium">Browser Anda mungkin tidak mendukung pratinjau langsung PDF.</p>
                    <a href={previewUrl} target="_blank" rel="noreferrer" className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">Unduh / Buka PDF di Tab Baru</a>
                  </div>
                </object>
              ) : (
                <img src={previewUrl} alt="Preview Bukti Full" className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TagihanSPP;


