import React from "react";

const mockRiwayatGaji = [
  { id: 1, periode: "Juli 2026", tglBayar: "01 Jul 2026", nominal: 4105000, status: "Terbayar" },
];

const RiwayatGajiGuruMapel = ({ user, onNavigate }) => {
  const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Riwayat Terima Gaji</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Riwayat Terima Gaji</h1>
        <p className="text-[14px] text-gray-500 mt-1">Daftar riwayat penerimaan honorarium dan gaji bulanan Anda</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1A3D63" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-[13px] font-bold text-[#1A3D63]">Catatan Penggajian</p>
          <p className="text-[13px] text-blue-800 mt-0.5">Klik tombol <b>Detail</b> pada tabel untuk melihat rincian dan mengunduh ulang slip gaji di bulan sebelumnya.</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[80px]">No</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Periode Gaji</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tanggal Pembayaran</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gaji Bersih Diterima</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockRiwayatGaji.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-5 text-[13px] text-gray-500 font-medium">{index + 1}</td>
                  <td className="py-4 px-5 text-[13px] font-bold text-gray-800">{item.periode}</td>
                  <td className="py-4 px-5 text-[13px] text-gray-600 font-medium">{item.tglBayar}</td>
                  <td className="py-4 px-5 text-[14px] font-black text-[#2A4365]">{fmt(item.nominal)}</td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-green-50 text-green-600 border border-green-100">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onNavigate && onNavigate("Detail Slip Gaji", item)}
                        className="text-[#1A3D63] hover:text-[#0A1931] font-bold text-[13px] flex items-center gap-1.5 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 mx-auto"
                        title="Lihat Detail"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiwayatGajiGuruMapel;


