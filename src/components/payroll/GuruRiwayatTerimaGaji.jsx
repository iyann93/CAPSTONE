import React, { useState, useEffect } from 'react';
import { getAllSlips, getSlipDetail } from '../../api/payroll';

const GuruRiwayatTerimaGaji = ({ user }) => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [tahun, setTahun] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail modal
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchSlips();
  }, [page, tahun]);

  const fetchSlips = async () => {
    try {
      setLoading(true);
      const res = await getAllSlips({
        page,
        limit: 10,
        tahun: tahun || undefined,
        status: 'dibayar', // Enforce 'dibayar'
        user_id: user?.id
      });
      setSlips(res.data || []);
      if (res.meta) setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      setDetailLoading(true);
      setShowDetail(true);
      const data = await getSlipDetail(id);
      setDetailData(data);
    } catch (error) {
      console.error(error);
      setShowDetail(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  const renderStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'draft':
        return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Draft</span>;
      case 'disetujui':
        return <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Disetujui</span>;
      case 'dibayar':
        return <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Dibayar</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">{statusStr}</span>;
    }
  };

  const months = [
    { value: '', label: 'Semua Bulan' },
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  const monthName = (m) => months.find(x => x.value === String(m))?.label || `Bulan ${m}`;

  return (
    <div className="p-8 max-w-7xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3D63]">Riwayat Terima Gaji</h1>
          <p className="text-gray-500 text-sm mt-1">Lihat histori penerimaan gaji Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] bg-white">
            <option value="">Semua Tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Periode</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Gaji Bersih</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="py-12 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D63]"></div></td></tr>
              ) : slips.length === 0 ? (
                <tr><td colSpan="4" className="py-12 text-center text-sm text-gray-500">Tidak ada data riwayat gaji.</td></tr>
              ) : (
                slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <span className="font-bold">{monthName(slip.bulan)} {slip.tahun}</span>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-[#059669]">
                      {formatRupiah(slip.gaji_bersih)}
                    </td>
                    <td className="py-3 px-4">
                      {renderStatusBadge(slip.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        {/* Tombol Detail */}
                        <button
                          onClick={() => handleViewDetail(slip.id)}
                          title="Lihat Detail"
                          className="p-1.5 text-gray-400 hover:text-[#1A3D63] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-200 cursor-pointer"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex flex-wrap justify-between items-center text-sm">
            <span className="text-gray-500">Halaman <span className="font-bold text-gray-800">{page}</span> dari <span className="font-bold text-gray-800">{totalPages}</span></span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-600 transition-colors bg-white">Sebelumnya</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-600 transition-colors bg-white">Selanjutnya</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Slip Gaji */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="flex flex-wrap items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800">Detail Slip Gaji</h3>
                {detailData && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {monthName(detailData.bulan)} {detailData.tahun}
                  </p>
                )}
              </div>
              <button
                onClick={() => { setShowDetail(false); setDetailData(null); }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {detailLoading ? (
              <div className="py-16 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A3D63]"></div>
              </div>
            ) : detailData ? (
              <div className="p-5 space-y-5">
                {/* Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: 'Gaji Pokok', value: formatRupiah(detailData.gaji_pokok), color: 'text-gray-800' },
                    { label: 'Total Tunjangan', value: formatRupiah(detailData.total_tunjangan), color: 'text-green-600' },
                    { label: 'Total Potongan', value: formatRupiah(detailData.total_potongan), color: 'text-red-500' },
                    { label: 'Gaji Bersih', value: formatRupiah(detailData.gaji_bersih), color: 'text-[#1A3D63]' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{item.label}</div>
                      <div className={`text-sm font-black ${item.color}`}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Status & badge */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium">Status:</span>
                  {renderStatusBadge(detailData.status)}
                </div>

                {/* Tunjangan */}
                {detailData.tunjangan?.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                      Tunjangan ({detailData.tunjangan.length})
                    </div>
                    <div className="rounded-xl border border-green-100 overflow-hidden">
                      {detailData.tunjangan.map((t, i) => (
                        <div key={i} className={`flex justify-between items-center px-4 py-2.5 text-xs ${i % 2 === 0 ? 'bg-green-50/40' : 'bg-white'}`}>
                          <div>
                            <div className="font-semibold text-gray-700">{t.komponen_nama}</div>
                            {t.keterangan && <div className="text-gray-400 mt-0.5">{t.keterangan}</div>}
                          </div>
                          <div className="font-bold text-green-600">{formatRupiah(t.nominal)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Potongan */}
                {detailData.potongan?.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                      Potongan ({detailData.potongan.length})
                    </div>
                    <div className="rounded-xl border border-red-100 overflow-hidden">
                      {detailData.potongan.map((p, i) => (
                        <div key={i} className={`flex justify-between items-center px-4 py-2.5 text-xs ${i % 2 === 0 ? 'bg-red-50/40' : 'bg-white'}`}>
                          <div>
                            <div className="font-semibold text-gray-700">{p.komponen_nama}</div>
                            {p.keterangan && <div className="text-gray-400 mt-0.5">{p.keterangan}</div>}
                          </div>
                          <div className="font-bold text-red-500">- {formatRupiah(p.nominal)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tidak ada komponen */}
                {!detailData.tunjangan?.length && !detailData.potongan?.length && (
                  <div className="text-center text-gray-400 text-sm py-6">Tidak ada detail komponen.</div>
                )}

                {/* Total bersih */}
                <div className="bg-[#1A3D63] rounded-xl p-4 flex flex-wrap justify-between items-center">
                  <span className="text-white text-sm font-bold">GAJI BERSIH</span>
                  <span className="text-white text-lg font-black">{formatRupiah(detailData.gaji_bersih)}</span>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400 text-sm">Gagal memuat data.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuruRiwayatTerimaGaji;
