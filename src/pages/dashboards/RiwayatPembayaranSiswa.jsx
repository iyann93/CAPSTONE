import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getTagihan } from "../../api/finance";

const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID");

const getBulanNama = (b) => ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][b-1];

const mapStatus = (status) => {
  if (status === "lunas") return "Lunas";
  if (status === "menunggu_konfirmasi") return "Menunggu";
  return "Belum Lunas";
};

const RiwayatPembayaranSiswa = ({ user, onNavigate }) => {
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [detail, setDetail] = useState(null);

  const studentData = {
    nama: user?.anak?.nama || "Siswa",
    kelas: user?.anak?.kelas || "-",
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getTagihan({ limit: 100 });
        const mapped = res.map(t => {
          const d = t.created_at ? new Date(t.created_at) : new Date();
          return {
            id: t.id,
            bulan: `${getBulanNama(t.bulan)} ${t.tahun}`,
            nominal: t.nominal_akhir, // <-- changed from t.nominal to t.nominal_akhir
            jatuhTempo: t.jatuh_tempo ? new Date(t.jatuh_tempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "10 " + getBulanNama(t.bulan).substring(0,3) + " " + t.tahun,
            status: mapStatus(t.status),
            tglBayar: t.status === 'lunas' && t.updated_at ? new Date(t.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
            denda: 0,
            bukti: t.bukti_url
          };
        });
        setTagihan(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const baseTagihan = tagihan.filter(t => t.status !== "Belum Lunas");
  const filtered = filter === "Semua" ? baseTagihan : baseTagihan.filter(t => t.status === filter);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Riwayat Pembayaran</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Riwayat Pembayaran</h1>
          <p className="text-[14px] text-gray-500 mt-1">{studentData.nama} · Kelas {studentData.kelas} · Tahun Ajaran 2025/2026</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          {["Semua", "Menunggu", "Lunas"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${filter === f ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f === "Menunggu" ? "Proses Verifikasi" : f}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {["BULAN", "NOMINAL", "JATUH TEMPO", "TGL BAYAR", "STATUS", "DETAIL"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 text-[13px] font-semibold text-gray-800">{t.bulan}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-gray-700">{fmt(t.nominal)}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-500">{t.jatuhTempo}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-500">{t.tglBayar || "—"}</td>
                  <td className="px-5 py-4">
                    {t.status === "Lunas" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Lunas
                      </span>
                    ) : t.status === "Menunggu" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>Proses Verifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Belum Lunas
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDetail(t)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors" title="Lihat Detail">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal — rendered via Portal to escape overflow-y-auto scroll container */}
      {detail && ReactDOM.createPortal(
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: "1rem" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDetail(null); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[17px] font-bold text-[#1e293b]">Detail Tagihan</h3>
            </div>

            {/* Body */}
            <div className="px-6 pt-4 pb-2">
              {[
                ["Bulan", detail.bulan],
                ["Nominal SPP", fmt(detail.nominal)],
                ["Jatuh Tempo", detail.jatuhTempo],
                ["Tanggal Bayar", detail.tglBayar || "Belum dibayar"],
                ["Status", detail.status],
              ].map(([k, v], idx, arr) => (
                <div
                  key={k}
                  className={`flex justify-between items-center py-3 ${idx < arr.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <span className="text-[13px] text-gray-500">{k}</span>
                  <span className={`text-[13px] font-bold ${
                    k === "Status" && detail.status === "Lunas"
                      ? "text-green-600"
                      : k === "Status" && detail.status === "Menunggu"
                      ? "text-blue-600"
                      : k === "Status"
                      ? "text-amber-600"
                      : "text-gray-800"
                  }`}>
                    {v === "Menunggu" ? "Proses Verifikasi" : v}
                  </span>
                </div>
              ))}

              {detail.bukti && (
                <div className="pt-3 pb-2">
                  <p className="text-[13px] text-gray-500 mb-2 font-bold">Bukti Pembayaran</p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <img src={detail.bukti} alt="Bukti Pembayaran" className="w-full h-auto object-cover max-h-52" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex gap-3">
              <button
                onClick={() => setDetail(null)}
                className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              {detail.status === "Belum Lunas" && (
                <button
                  onClick={() => { setDetail(null); onNavigate("Tagihan SPP"); }}
                  className="flex-1 py-3 bg-[#1A3D63] text-white rounded-xl text-[13px] font-bold hover:bg-[#163256] transition-colors"
                >
                  Bayar Sekarang
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default RiwayatPembayaranSiswa;


