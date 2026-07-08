import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getAllSlips, approveSlip, transferSlip, getSlipDetail, revertSlip, deleteSlip, bulkDeleteSlips } from '../../api/payroll';

const RiwayatSlipTab = ({ triggerToast }) => {
  const [slips, setSlips] = useState([]);
  const [summary, setSummary] = useState({ total: 0, dibayar: 0, belum_dibayar: 0 });
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail modal
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Confirmation modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlipId, setSelectedSlipId] = useState(null); // Optional: keep for single actions if needed
  const [selectedSlips, setSelectedSlips] = useState([]); // Array of IDs for bulk delete
  const [isApproving, setIsApproving] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Only allow selecting draft slips for delete
      const draftIds = slips.filter(s => s.status === 'draft').map(s => s.id);
      setSelectedSlips(draftIds);
    } else {
      setSelectedSlips([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedSlips(prev => [...prev, id]);
    } else {
      setSelectedSlips(prev => prev.filter(item => item !== id));
    }
  };


  useEffect(() => {
    fetchSlips(false, page > 1);
  }, [page, bulan, tahun, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchSlips(false, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchSlips = async (silent = false, isLoadMore = false) => {
    try {
      if (!silent && !isLoadMore) setLoading(true);
      const res = await getAllSlips({
        page,
        limit: 15,
        bulan: bulan || undefined,
        tahun: tahun || undefined,
        status: status || undefined,
        search: search || undefined
      });
      
      if (isLoadMore) {
        setSlips(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const newSlips = res.data.filter(s => !existingIds.has(s.id));
          return [...prev, ...newSlips];
        });
      } else {
        setSlips(res.data);
        setSelectedSlips([]); // Reset selection on new fetch
      }

      if (res.meta) {
        setTotalPages(res.meta.totalPages);
        if (res.meta.summary) setSummary(res.meta.summary);
      }
    } catch (error) {
      console.error(error);
      if (!silent) triggerToast("Gagal memuat riwayat slip gaji", "error");
    } finally {
      if (!silent && !isLoadMore) setLoading(false);
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
      triggerToast("Gagal memuat detail slip gaji", "error");
      setShowDetail(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const executeApprove = async () => {
    if (!selectedSlipId) return;
    const slipId = selectedSlipId;
    
    // Optimistic UI Update
    setSlips(prev => {
      const updated = prev.map(s => s.id === slipId ? { ...s, status: 'dibayar' } : s);
      return updated.sort((a, b) => {
        if (a.tahun !== b.tahun) return b.tahun - a.tahun;
        if (a.bulan !== b.bulan) return b.bulan - a.bulan;
        const score = s => s.status === 'dibayar' ? 1 : (s.status === 'disetujui' ? 2 : 3);
        return score(a) - score(b);
      });
    });
    setShowConfirmModal(false);
    setSelectedSlipId(null);
    triggerToast("Slip gaji berhasil dibayar!");

    try {
      // 1. Approve (draft -> disetujui)
      await approveSlip(slipId);
      
      // 2. Langsung Transfer (disetujui -> dibayar)
      const payload = {
        slipGajiId: slipId,
        noReferensi: `TRX-${Date.now()}`,
        rekeningId: null
      };
      await transferSlip(payload);

      // Sync with server data
      fetchSlips(true);
    } catch (error) {
      console.error(error);
      triggerToast(`Gagal memproses gaji: ${error.response?.data?.message || error.message}`, "error");
      // Revert optimistic update on failure
      fetchSlips(true);
    }
  };

  const executeRevert = async () => {
    if (!selectedSlipId) return;
    const slipId = selectedSlipId;
    
    // Optimistic UI Update
    setSlips(prev => prev.map(s => s.id === slipId ? { ...s, status: 'draft' } : s));
    setShowRevertModal(false);
    setSelectedSlipId(null);
    triggerToast("Status berhasil dibatalkan ke Draft!");

    try {
      await revertSlip(slipId);
      fetchSlips(true);
    } catch (error) {
      console.error(error);
      triggerToast(`Gagal membatalkan: ${error.response?.data?.message || error.message}`, "error");
      fetchSlips(true);
    }
  };

  const executeDelete = async () => {
    const idsToDelete = selectedSlips.length > 0 ? selectedSlips : (selectedSlipId ? [selectedSlipId] : []);
    if (idsToDelete.length === 0) return;
    
    setIsDeleting(true);
    try {
      if (idsToDelete.length === 1) {
        await deleteSlip(idsToDelete[0]);
      } else {
        await bulkDeleteSlips(idsToDelete);
      }
      triggerToast(`Berhasil menghapus ${idsToDelete.length} slip gaji!`);
      setShowDeleteModal(false);
      setSelectedSlipId(null);
      setSelectedSlips([]);
      fetchSlips(); // Reload since total records changed
    } catch (error) {
      console.error(error);
      triggerToast(`Gagal menghapus: ${error.response?.data?.message || error.message}`, "error");
    } finally {
      setIsDeleting(false);
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Riwayat Slip Gaji</h2>
        <p className="text-sm text-gray-500">Lihat histori slip gaji, setujui (Approve), dan proses transfer gaji pegawai.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "TOTAL PEGAWAI", value: `${summary.total} Orang` },
          { label: "SUDAH DIBAYAR", value: summary.dibayar.toString() },
          { label: "BELUM DIBAYAR", value: summary.belum_dibayar.toString() }
        ].map((card, idx) => (
          <div key={idx} className="bg-[#1A3D63] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-[104px]">
            <div className="text-[10px] font-bold text-blue-200 mt-1 uppercase tracking-wider">{card.label}</div>
            <div className="text-3xl font-black text-white leading-none">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Cari nama pegawai..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 transition-all"
          />
        </div>
        <select value={bulan} onChange={(e) => { setBulan(e.target.value); setPage(1); }} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] bg-white">
          {months.map(m => <option key={m.label} value={m.value}>{m.label}</option>)}
        </select>
        <select value={tahun} onChange={(e) => { setTahun(e.target.value); setPage(1); }} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] bg-white">
          <option value="">Semua Tahun</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] bg-white">
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="disetujui">Disetujui</option>
          <option value="dibayar">Dibayar</option>
        </select>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedSlips.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex justify-between items-center animate-fadeIn">
          <span className="text-red-700 text-sm font-bold ml-2">
            {selectedSlips.length} slip gaji draft terpilih
          </span>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors border-none shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            Hapus Terpilih
          </button>
        </div>
      )}

      {/* Table */}
      <div 
        className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-xl border border-gray-100 bg-white relative"
        onScroll={(e) => {
          const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
          if (scrollHeight - scrollTop <= clientHeight + 50 && page < totalPages) {
            setPage(prev => prev + 1);
          }
        }}
      >
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50/80 border-b border-gray-100 z-10 backdrop-blur-sm">
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={slips.length > 0 && slips.filter(s => s.status === 'draft').length > 0 && selectedSlips.length === slips.filter(s => s.status === 'draft').length}
                  className="w-4 h-4 text-[#1A3D63] rounded border-gray-300 focus:ring-[#1A3D63]"
                />
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Periode</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Pegawai</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Gaji Bersih</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Status</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase text-center">Detail</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && page === 1 ? (
              <tr><td colSpan="7" className="py-12 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D63]"></div></td></tr>
            ) : slips.length === 0 ? (
              <tr><td colSpan="7" className="py-12 text-center text-sm text-gray-500">Tidak ada data riwayat gaji.</td></tr>
            ) : (
              <>
                {slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3 px-4 border-b border-gray-50">
                      {slip.status === 'draft' ? (
                        <input
                          type="checkbox"
                          checked={selectedSlips.includes(slip.id)}
                          onChange={(e) => handleSelectOne(e, slip.id)}
                          className="w-4 h-4 text-[#1A3D63] rounded border-gray-300 focus:ring-[#1A3D63]"
                        />
                      ) : (
                        <input type="checkbox" disabled className="w-4 h-4 rounded border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 border-b border-gray-50">
                      <span className="font-bold">{monthName(slip.bulan)} {slip.tahun}</span>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-50">
                      <div className="text-sm font-bold text-gray-800">{slip.user_nama || slip.user_email || slip.user_id}</div>
                      <div className="text-xs text-gray-400">{slip.user_email}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-[#059669] border-b border-gray-50">
                      {formatRupiah(slip.gaji_bersih)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-50">
                      {renderStatusBadge(slip.status)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-50">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewDetail(slip.id)}
                          title="Lihat Detail"
                          className="p-1.5 text-gray-400 hover:text-[#1A3D63] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-200 cursor-pointer"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-50">
                      <div className="flex justify-center gap-2">
                        {slip.status === 'draft' && (
                          <button
                            onClick={() => { setSelectedSlipId(slip.id); setShowConfirmModal(true); }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors border border-blue-200 cursor-pointer whitespace-nowrap"
                          >
                            Konfirmasi
                          </button>
                        )}
                        {['dibayar', 'disetujui'].includes(slip.status) && (
                          <button
                            onClick={() => { setSelectedSlipId(slip.id); setShowRevertModal(true); }}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs font-bold transition-colors border border-orange-200 cursor-pointer whitespace-nowrap"
                          >
                            Batal Konfirmasi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {page < totalPages && (
                  <tr>
                    <td colSpan="7" className="py-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-[#1A3D63]"></div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination removed - using infinite scroll */}

      {/* Modal Detail Slip Gaji */}
      {showDetail && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800">Detail Slip Gaji</h3>
                {detailData && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {monthName(detailData.bulan)} {detailData.tahun} · {detailData.user_nama}
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
                <div className="grid grid-cols-2 gap-3">
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
                <div className="bg-[#1A3D63] rounded-xl p-4 flex justify-between items-center">
                  <span className="text-white text-sm font-bold">GAJI BERSIH</span>
                  <span className="text-white text-lg font-black">{formatRupiah(detailData.gaji_bersih)}</span>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400 text-sm">Gagal memuat data.</div>
            )}
          </div>
        </div>, document.body
      )}

      {/* Modal Konfirmasi Pembayaran */}
      {showConfirmModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-scaleIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-500">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Pembayaran Gaji</h3>
              <p className="text-sm text-gray-500 mb-6">Apakah Anda mengonfirmasi bahwa gaji ini telah dibayarkan kepada pegawai? Status slip gaji akan diubah menjadi Dibayar.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConfirmModal(false); setSelectedSlipId(null); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer border-none"
                  disabled={isApproving}
                >
                  Batal
                </button>
                <button
                  onClick={executeApprove}
                  className="flex-1 px-4 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white font-bold rounded-xl transition-colors cursor-pointer border-none shadow-sm"
                  disabled={isApproving}
                >
                  {isApproving ? "Memproses..." : "Ya, Sudah Dibayar"}
                </button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      {/* Modal Batal Konfirmasi */}
      {showRevertModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-scaleIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Batalkan Konfirmasi?</h3>
              <p className="text-sm text-gray-500 mb-6">Tindakan ini akan mengembalikan status slip gaji menjadi Draft dan menghapus riwayat transfer gaji ini.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowRevertModal(false); setSelectedSlipId(null); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer border-none"
                  disabled={isReverting}
                >
                  Batal
                </button>
                <button
                  onClick={executeRevert}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer border-none shadow-sm"
                  disabled={isReverting}
                >
                  {isReverting ? "Loading..." : "Ya, Batalkan"}
                </button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}
      {/* Modal Hapus Slip */}
      {showDeleteModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-scaleIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Slip Gaji?</h3>
              <p className="text-sm text-gray-500 mb-6">Tindakan ini akan menghapus {selectedSlips.length > 1 ? selectedSlips.length : ''} slip gaji secara permanen dan tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedSlipId(null); setSelectedSlips([]); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer border-none"
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer border-none shadow-sm"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
};

export default RiwayatSlipTab;
