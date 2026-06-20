import React, { useState, useEffect } from 'react';
import { getAllSlips, approveSlip, transferSlip } from '../../api/payroll';

const RiwayatSlipTab = ({ triggerToast }) => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSlips();
  }, [page, bulan, tahun, status]); // Re-fetch when filters or page change

  // Wait for typing to pause before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1); // Reset to page 1 on new search
      else fetchSlips();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchSlips = async () => {
    try {
      setLoading(true);
      const res = await getAllSlips({
        page,
        limit: 10,
        bulan: bulan || undefined,
        tahun: tahun || undefined,
        status: status || undefined,
        search: search || undefined
      });
      setSlips(res.data);
      if (res.meta) {
        setTotalPages(res.meta.totalPages);
      }
    } catch (error) {
      console.error(error);
      triggerToast("Gagal memuat riwayat slip gaji", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveSlip(id);
      triggerToast("Slip gaji berhasil disetujui (Approved)");
      fetchSlips();
    } catch (error) {
      console.error(error);
      triggerToast("Gagal menyetujui slip gaji", "error");
    }
  };

  const handleTransfer = async (id) => {
    try {
      // In real app, we might prompt for noReferensi and rekeningId
      const payload = {
        slipGajiId: id,
        noReferensi: `TRX-${Date.now()}`,
        rekeningId: null
      };
      await transferSlip(payload);
      triggerToast("Gaji berhasil ditransfer");
      fetchSlips();
    } catch (error) {
      console.error(error);
      triggerToast("Gagal memproses transfer", "error");
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const renderStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'Draft':
        return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Draft</span>;
      case 'Approved':
        return <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Approved</span>;
      case 'Transferred':
        return <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Transferred</span>;
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Riwayat Slip Gaji</h2>
        <p className="text-sm text-gray-500">Lihat histori slip gaji, setujui (Approve), dan proses transfer gaji pegawai.</p>
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
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] bg-white"
        >
          {months.map(m => <option key={m.label} value={m.value}>{m.label}</option>)}
        </select>
        <select
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] bg-white"
        >
          <option value="">Semua Tahun</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] bg-white"
        >
          <option value="">Semua Status</option>
          <option value="Draft">Draft</option>
          <option value="Approved">Approved</option>
          <option value="Transferred">Transferred</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Periode</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Pegawai</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Gaji Bersih</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">Status</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D63]"></div>
                </td>
              </tr>
            ) : slips.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-sm text-gray-500">Tidak ada data riwayat gaji.</td>
              </tr>
            ) : (
              slips.map((slip) => (
                <tr key={slip.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className="font-bold">{slip.bulan}/{slip.tahun}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-bold text-gray-800">{slip.nama_pegawai || 'User ID: ' + slip.user_id}</div>
                    <div className="text-xs text-gray-400">ID: {slip.id}</div>
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-[#059669]">
                    {formatRupiah(slip.total_gaji_bersih)}
                  </td>
                  <td className="py-3 px-4">
                    {renderStatusBadge(slip.status)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      {slip.status === 'Draft' && (
                        <button
                          onClick={() => handleApprove(slip.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors border border-blue-200"
                        >
                          Approve
                        </button>
                      )}
                      {slip.status === 'Approved' && (
                        <button
                          onClick={() => handleTransfer(slip.id)}
                          className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition-colors border border-green-200"
                        >
                          Transfer
                        </button>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200" title="Detail">
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

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center text-sm">
          <span className="text-gray-500">Halaman <span className="font-bold text-gray-800">{page}</span> dari <span className="font-bold text-gray-800">{totalPages}</span></span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-600 transition-colors bg-white"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-600 transition-colors bg-white"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatSlipTab;
