/**
 * Finance API Service
 * Handles all API calls for the Bendahara (Finance) module.
 */
import api from './axios';

// ── KOMPONEN SPP (Pengaturan) ───────────────────────────────────────────────

export const getKomponenSpp = () =>
  api.get('/finance/komponen-spp').then((r) => r.data.data);

export const createKomponenSpp = (payload) =>
  api.post('/finance/komponen-spp', payload).then((r) => r.data.data);

export const updateKomponenSpp = (id, payload) =>
  api.put(`/finance/komponen-spp/${id}`, payload).then((r) => r.data.data);

export const deleteKomponenSpp = (id) =>
  api.delete(`/finance/komponen-spp/${id}`).then((r) => r.data);

// ── TAGIHAN SPP ─────────────────────────────────────────────────────────────

/** Generate tagihan SPP bulanan untuk semua siswa */
export const generateTagihanBulanan = (payload) =>
  // payload: { bulan, tahun, jatuh_tempo }
  api.post('/finance/spp/generate-bulanan', payload).then((r) => r.data);

/** Batalkan tagihan SPP bulanan untuk bulan dan tahun tertentu (hanya yang belum lunas) */
export const batalTagihanBulanan = (payload) =>
  // payload: { bulan, tahun }
  api.delete('/finance/spp/batal-bulanan', { data: payload }).then((r) => r.data);

/** Upload Bukti Pembayaran SPP (Multipart/form-data) */
export const uploadBuktiSpp = (id, formData) =>
  api.post(`/finance/spp/upload-bukti/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((r) => r.data);

/** Konfirmasi Bukti Pembayaran SPP (action: 'terima' atau 'tolak') */
export const konfirmasiBuktiSpp = (id, payload) =>
  // payload: { action: 'terima' | 'tolak' }
  api.post(`/finance/spp/konfirmasi-bukti/${id}`, payload).then((r) => r.data);

/** Ambil daftar tagihan (opsional: search, kelasId, bulan, tahun, status) */
export const getTagihan = (params = {}) =>
  api.get('/finance/spp', { params }).then((r) => r.data.data);

// ── PEMBAYARAN ──────────────────────────────────────────────────────────────

/** Catat pembayaran SPP */
export const processPembayaran = (payload) =>
  // payload: { tagihanId, jumlahBayar, metode, noReferensi?, keterangan? }
  api.post('/finance/pembayaran', payload).then((r) => r.data.data);

/** Ambil daftar transaksi pembayaran */
export const getPembayaran = (params = {}) =>
  api.get('/finance/pembayaran', { params }).then((r) => r.data.data);

/** Detail satu transaksi */
export const getPembayaranById = (id) =>
  api.get(`/finance/pembayaran/${id}`).then((r) => r.data.data);

/** Laporan bulanan */
export const getLaporanBulanan = (bulan, tahun) =>
  api.get('/finance/pembayaran/laporan', { params: { bulan, tahun } }).then((r) => r.data.data);

// ── BEASISWA ────────────────────────────────────────────────────────────────

export const getBeasiswa = (params = {}) =>
  api.get('/beasiswa', { params: { limit: 1000, ...params } }).then((r) => {
    // Backend returns { data: { data: [...], meta: {...} } } for paginated endpoints
    const payload = r.data.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
  });

export const createBeasiswa = (payload) =>
  api.post('/beasiswa', payload).then((r) => r.data.data);

export const updateBeasiswa = (id, payload) =>
  api.put(`/beasiswa/${id}`, payload).then((r) => r.data.data);

export const deleteBeasiswa = (id) =>
  api.delete(`/beasiswa/${id}`).then((r) => r.data);

// ── PAYROLL ─────────────────────────────────────────────────────────────────

// --- Komponen Gaji ---
export const getKomponenGaji = () =>
  api.get('/payroll/komponen').then((r) => r.data.data);

export const createKomponenGaji = (payload) =>
  api.post('/payroll/komponen', payload).then((r) => r.data.data);

export const updateKomponenGaji = (id, payload) =>
  api.put(`/payroll/komponen/${id}`, payload).then((r) => r.data.data);

export const deleteKomponenGaji = (id) =>
  api.delete(`/payroll/komponen/${id}`).then((r) => r.data);

// --- Slip Gaji ---
/** Ambil daftar slip gaji */
export const getPayroll = (params = {}) =>
  api.get('/payroll', { params }).then((r) => r.data.data);

/** Generate slip gaji */
export const generatePayroll = (payload) =>
  // payload: { user_id, bulan, tahun }
  api.post('/payroll/generate', payload).then((r) => r.data.data);

/** Approve slip gaji */
export const approvePayroll = (payload) =>
  // payload: { slip_ids: [...] }
  api.post('/payroll/approve', payload).then((r) => r.data.data);

/** Transfer gaji */
export const transferPayroll = (payload) =>
  // payload: { slip_ids: [...] }
  api.post('/payroll/transfer', payload).then((r) => r.data.data);

// ── DASHBOARD STATS ─────────────────────────────────────────────────────────

export const getBendaharaDashboard = () =>
  api.get('/dashboard/bendahara').then((r) => r.data.data);

// ── DANA BEASISWA ──────────────────────────────────────────────────────────

export const getDanaBeasiswa = () =>
  api.get('/finance/dana-beasiswa').then((r) => r.data.data);

export const createDanaBeasiswa = (payload) =>
  api.post('/finance/dana-beasiswa', payload).then((r) => r.data.data);

export const deleteDanaBeasiswa = (id) =>
  api.delete(`/finance/dana-beasiswa/${id}`).then((r) => r.data.data);

// ── OPERASIONAL TRANSACTIONS ───────────────────────────────────────────────

export const getOperasional = () =>
  api.get('/finance/operasional').then((r) => r.data.data);

export const createOperasional = (payload) =>
  api.post('/finance/operasional', payload).then((r) => r.data.data);

export const deleteMultipleOperasional = (ids) =>
  api.delete('/finance/operasional', { data: { ids } }).then((r) => r.data.data);
