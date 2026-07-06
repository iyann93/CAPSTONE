import React, { useState, useEffect } from "react";
import { getTagihan, uploadBuktiSpp } from "../../api/finance";

const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const getBulanNama = (b) => ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][b-1];

const TagihanSPP = ({ onNavigate }) => {
  const [tagihan, setTagihan] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // States untuk Upload Bukti
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTagihanId, setSelectedTagihanId] = useState("");

  const loadData = async () => {
    try {
      setLoadingData(true);
      const res = await getTagihan({ limit: 100 });
      setTagihan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTagihanId) {
      alert("Silakan pilih tagihan yang ingin dibayar.");
      return;
    }
    if (!file) {
      alert("Silakan unggah bukti transfer terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bukti", file);
      await uploadBuktiSpp(selectedTagihanId, formData);
      alert("Bukti pembayaran berhasil diunggah! Menunggu konfirmasi bendahara.");
      setFile(null);
      setSelectedTagihanId("");
      loadData();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal mengunggah bukti pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const lunas = tagihan.filter(t => t.status === "lunas").length;
  const belumLunas = tagihan.filter(t => t.status === "belum_bayar").length;
  const menunggu = tagihan.filter(t => t.status === "menunggu_konfirmasi").length;
  
  const totalLunas = tagihan.filter(t => t.status === "lunas").reduce((a, c) => a + Number(c.nominal_akhir || c.nominal), 0);
  
  // Breakdown Tagihan Aktif
  const tagihanAktif = tagihan.filter(t => t.status === "belum_bayar" || t.status === "menunggu_konfirmasi");
  const totalOriginal = tagihanAktif.reduce((a, c) => a + Number(c.nominal), 0);
  const totalPotongan = tagihanAktif.reduce((a, c) => a + Number(c.potongan || 0), 0);
  const totalHarusDibayar = tagihanAktif.reduce((a, c) => a + Number(c.nominal_akhir || (c.nominal - (c.potongan || 0))), 0);

  const tagihanBelumBayar = tagihan.filter(t => t.status === "belum_bayar");

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Tagihan SPP</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Tagihan SPP</h1>
          <p className="text-[14px] text-gray-500 mt-1">Pembayaran SPP dan Konfirmasi</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Tagihan Aktif with Breakdown */}
        <div className="bg-white border border-blue-100 ring-1 ring-blue-50 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all md:col-span-1">
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Tagihan Aktif</p>
          </div>
          <p className="text-[26px] font-black leading-tight text-[#1e293b]">{fmt(totalHarusDibayar)}</p>
          <p className="text-[12px] mt-1 font-medium text-blue-500">{belumLunas + menunggu} bulan belum lunas</p>
          
          {totalPotongan > 0 && (
            <div className="mt-4 pt-3 border-t border-blue-50 space-y-1">
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Total Asli:</span>
                <span>{fmt(totalOriginal)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-green-600">
                <span>Potongan Beasiswa:</span>
                <span>- {fmt(totalPotongan)}</span>
              </div>
            </div>
          )}
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
                  Bulan {getBulanNama(t.bulan)} {t.tahun} - {fmt(t.nominal_akhir || (t.nominal - (t.potongan || 0)))}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer transition-colors relative bg-gray-50/50">
            <input
              type="file"
              accept="image/*,application/pdf"
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
                <p className="text-[13px] font-bold text-gray-700">{file ? file.name : "Pilih File Bukti Bayar"}</p>
                <p className="text-[11px] text-gray-400 mt-1">Format JPG, PNG, atau PDF (Max 5MB)</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file || !selectedTagihanId}
            className={`w-full py-3.5 text-[14px] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
              loading ? "bg-blue-100 text-blue-400 cursor-not-allowed" : (!file || !selectedTagihanId) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Mengunggah Bukti..." : "Kirim Konfirmasi Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TagihanSPP;


