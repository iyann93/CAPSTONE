import React, { useState } from "react";

const paymentMethods = [
  { id: "bca", type: "bank", name: "BCA Virtual Account", code: "880120012345678", instructions: "Masukkan kode VA 880120012345678 pada menu m-Transfer / Virtual Account." },
  { id: "mandiri", type: "bank", name: "Mandiri Virtual Account", code: "896120012345678", instructions: "Masukkan kode VA 896120012345678 pada menu Bayar > Multi Payment > Siakad." },
  { id: "gopay", type: "ewallet", name: "GoPay / QRIS", code: "QRIS_IMAGE", instructions: "Pindai kode QRIS menggunakan aplikasi GoPay, OVO, Dana, atau LinkAja." },
];

const BayarSPP = ({ onNavigate }) => {
  const [selectedMethod, setSelectedMethod] = useState("bca");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nominal, setNominal] = useState(500000);
  const [bulan, setBulan] = useState("Juli 2024");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Silakan unggah bukti transfer terlebih dahulu.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Update local storage status
      const saved = localStorage.getItem("orangtua_tagihan");
      let tagihans = [];
      if (saved) {
        tagihans = JSON.parse(saved);
      } else {
        // Fallback default
        tagihans = [
          { id: 1, bulan: "Juli 2024", nominal: 500000, jatuhTempo: "10 Jul 2024", status: "Belum Lunas", denda: 0 },
          { id: 2, bulan: "Juni 2024", nominal: 500000, jatuhTempo: "10 Jun 2024", status: "Lunas", tglBayar: "8 Jun 2024", denda: 0 },
        ];
      }
      
      // Update Juli tagihan to Lunas
      const updated = tagihans.map(t => {
        if (t.bulan === bulan) {
          return { ...t, status: "Lunas", tglBayar: new Date().toLocaleDateString("id-ID") };
        }
        return t;
      });
      localStorage.setItem("orangtua_tagihan", JSON.stringify(updated));

      // Trigger update on home dashboard notifications as well if necessary
    }, 2000);
  };

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);

  if (success) {
    return (
      <div className="p-6 md:p-8 max-w-[600px] mx-auto text-center space-y-6 animate-fadeIn bg-white rounded-3xl border border-gray-100 shadow-xl my-10">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-[22px] font-bold text-gray-800">Pembayaran Berhasil Dikirim!</h2>
          <p className="text-[14px] text-gray-500 px-4 leading-relaxed">
            Bukti pembayaran Anda untuk <strong>SPP {bulan} ({nominal.toLocaleString("id-ID", { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })})</strong> sedang diverifikasi oleh Bendahara.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl text-[13px] text-gray-600 space-y-1 max-w-[360px] mx-auto text-left">
          <div className="flex justify-between"><span>Metode:</span><span className="font-bold">{currentMethod.name}</span></div>
          <div className="flex justify-between"><span>Status:</span><span className="font-bold text-blue-600">Verifikasi Proses</span></div>
          <div className="flex justify-between"><span>Tanggal Kirim:</span><span>{new Date().toLocaleDateString("id-ID")}</span></div>
        </div>
        <div className="flex gap-4 pt-2">
          <button
            onClick={() => onNavigate("Dashboard")}
            className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-[14px] transition-colors"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => onNavigate("Tagihan SPP")}
            className="flex-1 py-3.5 bg-[#1A3D63] hover:bg-[#163256] text-white font-bold rounded-xl text-[14px] transition-colors"
          >
            Lihat Riwayat Tagihan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; Tagihan SPP &gt; <span className="text-[#2A4365] font-semibold">Bayar SPP</span>
      </div>

      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Bayar SPP</h1>
        <p className="text-[14px] text-gray-500 mt-1">Konfirmasi Pembayaran SPP Bulanan Siswa</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Tagihan */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-[16px] font-bold text-gray-800">1. Informasi Tagihan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-2">Bulan Tagihan</label>
                <select
                  value={bulan}
                  onChange={e => setBulan(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Juli 2024">Juli 2024 (Belum Lunas)</option>
                  <option value="Agustus 2024">Agustus 2024</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-2">Nominal Pembayaran</label>
                <input
                  type="text"
                  disabled
                  value="Rp 500.000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-500 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-[16px] font-bold text-gray-800">2. Pilih Metode Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedMethod === method.id
                      ? "border-[#1A3D63] bg-blue-50/20"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                  }`}
                >
                  <p className="text-[13px] font-bold text-gray-700">{method.name}</p>
                  <span className="text-[10.5px] text-gray-400 mt-1 block">VA / Rekening</span>
                </button>
              ))}
            </div>

            {/* Instruction Box */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">Rekening Tujuan / VA</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentMethod.code);
                    alert("Kode berhasil disalin!");
                  }}
                  className="text-[11px] font-bold text-[#1A3D63] hover:underline"
                >
                  Salin Kode
                </button>
              </div>
              {currentMethod.code === "QRIS_IMAGE" ? (
                <div className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-xl w-44 mx-auto shadow-sm">
                  {/* QR Simulator */}
                  <div className="w-36 h-36 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 font-black text-gray-400 text-xs select-none">
                    [ QRIS CODE SIMULATOR ]
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2">Pindai QR ini</span>
                </div>
              ) : (
                <p className="text-[20px] font-black text-[#1A3D63] tracking-wide">{currentMethod.code}</p>
              )}
              <p className="text-[12.5px] text-gray-500 leading-relaxed">{currentMethod.instructions}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Upload Proof */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="text-[16px] font-bold text-gray-800">3. Unggah Bukti Pembayaran</h3>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-gray-50/50">
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
                  <p className="text-[11px] text-gray-400 mt-1">Format JPG, PNG, atau PDF (Max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Terms and conditions info */}
            <div className="text-[11px] text-gray-400 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-50 flex gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              <span>Pastikan foto bukti transfer terlihat jelas, termasuk nominal, tanggal, dan nama bank pengirim.</span>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-4 text-[14px] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                  : !file
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengunggah Bukti...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
                  </svg>
                  Kirim Konfirmasi Pembayaran
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BayarSPP;
