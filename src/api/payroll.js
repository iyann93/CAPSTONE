import api from './axios';

// ─── MASTER KOMPONEN ──────────────────────────────────────────────────────────
export const getKomponenGaji = async () => {
  const response = await api.get('/payroll/komponen');
  return response.data?.data || [];
};

export const createKomponenGaji = async (data) => {
  const response = await api.post('/payroll/komponen', data);
  return response.data?.data;
};

export const updateKomponenGaji = async (id, data) => {
  const response = await api.put(`/payroll/komponen/${id}`, data);
  return response.data?.data;
};

export const deleteKomponenGaji = async (id) => {
  const response = await api.delete(`/payroll/komponen/${id}`);
  return response.data;
};

// ─── JABATAN ────────────────────────────────────────────────────────────────
export const getJabatan = async () => {
  const response = await api.get('/jabatan');
  return response.data?.data || [];
};

// ─── TEMPLATE GAJI JABATAN ──────────────────────────────────────────────────
export const getTemplates = async (jabatan_id) => {
  const response = await api.get(`/payroll/templates?jabatan_id=${jabatan_id}`);
  return response.data?.data || [];
};

export const upsertTemplate = async (data) => {
  const response = await api.post('/payroll/templates', data);
  return response.data?.data;
};

// ─── PEGAWAI ──────────────────────────────────────────────────────────────────
export const getEmployees = async () => {
  const response = await api.get('/payroll/employees');
  return response.data?.data || [];
};

// ─── OVERRIDE GAJI PEGAWAI ──────────────────────────────────────────────────
export const getOverrides = async (user_id) => {
  const response = await api.get(`/payroll/overrides?user_id=${user_id}`);
  return response.data?.data || [];
};

export const upsertOverride = async (data) => {
  const response = await api.post('/payroll/overrides', data);
  return response.data?.data;
};

// ─── ACTION GAJI ────────────────────────────────────────────────────────────
export const generateSlip = async (data) => {
  const response = await api.post('/payroll/generate', data);
  return response.data?.data;
};

export const approveSlip = async (slipGajiId) => {
  const response = await api.post('/payroll/approve', { slipGajiId });
  return response.data?.data;
};

export const revertSlip = async (slipGajiId) => {
  const response = await api.post('/payroll/revert', { slipGajiId });
  return response.data?.data;
};

export const transferSlip = async (data) => {
  const response = await api.post('/payroll/transfer', data);
  return response.data?.data;
};

// ─── RIWAYAT SLIP ───────────────────────────────────────────────────────────
export const getRiwayat = async (user_id) => {
  const response = await api.get(`/payroll/riwayat/${user_id}`);
  return response.data?.data || [];
};

export const getAllSlips = async (params = {}) => {
  const response = await api.get('/payroll', { params });
  return response.data; // Mengembalikan { data, meta }
};

export const getSlipDetail = async (id) => {
  const response = await api.get(`/payroll/${id}`);
  return response.data?.data;
};
