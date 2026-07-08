import api from './axios';

// === AUDIT LOGS ===
/** Ambil log aktivitas sistem */
export const getAuditLogs = (params = {}) =>
  api.get('/system/audit-logs', { params }).then(r => r.data.data);

// === ROLES & RBAC ===
/** Ambil semua role dan permission-nya */
export const getRoles = () =>
  api.get('/system/roles').then(r => r.data.data);

export const getRolePermissions = () =>
  api.get('/system/role-permissions').then(r => r.data.data);

export const updateRolePermissions = (data) =>
  api.put('/system/role-permissions', data).then(r => r.data);

// === AKTIVASI AKUN ===
/** Ambil semua user nonaktif / pending */
export const getPendingUsers = () =>
  api.get('/system/users/pending').then(r => r.data.data);

/** Aktifkan satu user */
export const activateUser = (id) =>
  api.put(`/system/users/${id}/activate`).then(r => r.data);

/** Nonaktifkan satu user */
export const deactivateUser = (id) =>
  api.put(`/system/users/${id}/deactivate`).then(r => r.data);

// === MANAGE ALL USERS ===
export const getAllSystemUsers = () =>
  api.get('/system/users').then(r => r.data.data);

export const createSystemUser = (data) =>
  api.post('/system/users', data).then(r => r.data.data);

export const updateSystemUser = (id, data) =>
  api.put(`/system/users/${id}`, data).then(r => r.data.data);

export const deleteSystemUser = (id) =>
  api.delete(`/system/users/${id}`).then(r => r.data);

export const sendResetPasswordEmail = (id) =>
  api.post(`/system/users/${id}/reset-password-email`).then(r => r.data);

// === SISWA LIST (untuk dropdown pilih anak orang tua) ===
export const getSiswaDropdown = () =>
  api.get('/system/siswa').then(r => r.data.data);

// === BACKUPS ===
export const getSystemBackups = () =>
  api.get('/system/backups').then(r => r.data.data);

export const createSystemBackup = () =>
  api.post('/system/backups').then(r => r.data.data);

export const deleteSystemBackup = (filename) =>
  api.delete(`/system/backups/${filename}`).then(r => r.data);

export const getSystemStats = () =>
  api.get('/system/stats').then(r => r.data.data);
