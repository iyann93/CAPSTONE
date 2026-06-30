'use strict';

const PayrollService = require('../services/payroll.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const PayrollController = {

  // GET /payroll  — Daftar slip gaji + filter + pagination
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await PayrollService.getAll(req.query);
      return response.success(res, 200, 'Daftar slip gaji berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  // GET /payroll/:id  — Detail slip gaji (dengan komponen & transfer)
  getById: async (req, res, next) => {
    try {
      const data = await PayrollService.getById(req.params.id);
      return response.success(res, 200, 'Detail slip gaji berhasil diambil', data);
    } catch (err) { next(err); }
  },

  // GET /payroll/riwayat/:userId  — Riwayat gaji per user
  getRiwayat: async (req, res, next) => {
    try {
      const data = await PayrollService.getRiwayat(req.params.userId);
      return response.success(res, 200, 'Riwayat gaji berhasil diambil', data);
    } catch (err) { next(err); }
  },

  generate: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), {
          type: 'validation', errors: errors.array(),
        }));
      }
      const data = await PayrollService.generate(req.body);
      return response.success(res, 201, 'Slip gaji berhasil di-generate', data);
    } catch (err) {
      console.error('[GENERATE SLIP ERROR]', err.message, err.stack);
      next(err);
    }
  },

  // POST /payroll/approve  — Approve slip gaji (Draft → Approved)
  approve: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), {
          type: 'validation', errors: errors.array(),
        }));
      }
      const data = await PayrollService.approve(req.body);
      return response.success(res, 200, 'Slip gaji berhasil di-approve', data);
    } catch (err) { next(err); }
  },

  // POST /payroll/revert  — Revert slip gaji (Dibayar/Disetujui → Draft)
  revert: async (req, res, next) => {
    try {
      if (!req.body.slipGajiId) {
        return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: [{ msg: 'slipGajiId is required' }] }));
      }
      const data = await PayrollService.revert(req.body);
      return response.success(res, 200, 'Slip gaji berhasil dibatalkan', data);
    } catch (err) { next(err); }
  },

  // POST /payroll/transfer  — Transfer gaji (Approved → Transferred)
  transfer: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), {
          type: 'validation', errors: errors.array(),
        }));
      }
      const data = await PayrollService.transfer(req.body);
      return response.success(res, 200, 'Gaji berhasil ditransfer', data);
    } catch (err) { next(err); }
  },

  // DELETE /payroll/:id — Hapus slip gaji
  deleteSlip: async (req, res, next) => {
    try {
      await PayrollService.deleteSlip(req.params.id);
      return response.success(res, 200, 'Slip gaji berhasil dihapus');
    } catch (err) { next(err); }
  },

  // DELETE /payroll/bulk — Hapus slip gaji massal
  bulkDeleteSlips: async (req, res, next) => {
    try {
      const { slipIds } = req.body;
      if (!slipIds || !Array.isArray(slipIds) || slipIds.length === 0) {
        return next(Object.assign(new Error('Validation failed'), {
          type: 'validation', errors: [{ msg: 'slipIds is required and must be an array' }],
        }));
      }
      const count = await PayrollService.bulkDeleteSlips(slipIds);
      return response.success(res, 200, `${count} slip gaji berhasil dihapus`);
    } catch (err) { next(err); }
  },

  // ── KOMPONEN GAJI (Pengaturan) ───────────────────────────────────────────────
  getAllKomponen: async (req, res, next) => {
    try {
      const data = await PayrollService.getAllKomponen();
      return response.success(res, 200, 'Data komponen gaji berhasil diambil', data);
    } catch (err) { next(err); }
  },

  createKomponen: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      }
      const data = await PayrollService.createKomponen(req.body);
      return response.success(res, 201, 'Komponen gaji berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  updateKomponen: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      }
      const data = await PayrollService.updateKomponen(req.params.id, req.body);
      return response.success(res, 200, 'Komponen gaji berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  deleteKomponen: async (req, res, next) => {
    try {
      await PayrollService.deleteKomponen(req.params.id);
      return response.success(res, 200, 'Komponen gaji berhasil dihapus');
    } catch (err) { next(err); }
  },

  // ── TEMPLATE & OVERRIDE ────────────────────────────────────────────────────
  getTemplates: async (req, res, next) => {
    try {
      const { jabatan_id } = req.query;
      if (!jabatan_id) return response.error(res, 400, 'jabatan_id query parameter is required');
      const data = await PayrollService.getTemplatesByJabatan(jabatan_id);
      return response.success(res, 200, 'Template gaji berhasil diambil', data);
    } catch (err) { next(err); }
  },

  upsertTemplate: async (req, res, next) => {
    try {
      // Normalize: frontend sends komponen_id, repository expects komponen_gaji_id
      const payload = {
        jabatan_id: req.body.jabatan_id,
        komponen_gaji_id: req.body.komponen_gaji_id || req.body.komponen_id,
        nominal: req.body.nominal,
      };
      if (!payload.jabatan_id || !payload.komponen_gaji_id) {
        return response.error(res, 400, 'jabatan_id dan komponen_id wajib diisi');
      }
      const data = await PayrollService.upsertTemplate(payload);
      return response.success(res, 200, 'Template gaji berhasil disimpan', data);
    } catch (err) { next(err); }
  },

  getOverrides: async (req, res, next) => {
    try {
      const { user_id } = req.query;
      if (!user_id) return response.error(res, 400, 'user_id query parameter is required');
      const data = await PayrollService.getOverridesByUser(user_id);
      return response.success(res, 200, 'Override gaji berhasil diambil', data);
    } catch (err) { next(err); }
  },

  upsertOverride: async (req, res, next) => {
    try {
      // Normalize: frontend sends komponen_id, repository expects komponen_gaji_id
      const payload = {
        user_id: req.body.user_id,
        komponen_gaji_id: req.body.komponen_gaji_id || req.body.komponen_id,
        nominal: req.body.nominal,
      };
      if (!payload.user_id || !payload.komponen_gaji_id) {
        return response.error(res, 400, 'user_id dan komponen_id wajib diisi');
      }
      const data = await PayrollService.upsertOverride(payload);
      return response.success(res, 200, 'Override gaji berhasil disimpan', data);
    } catch (err) { next(err); }
  },

  // ── PEGAWAI ────────────────────────────────────────────────────────────────
  getEmployees: async (req, res, next) => {
    try {
      const sql = `
        SELECT u.id, u.nama as name, u.email,
               STRING_AGG(r.nama_role, ', ') as role,
               j.nama as nama_jabatan
        FROM shared.users u
        LEFT JOIN shared.user_roles ur ON u.id = ur.user_id
        LEFT JOIN shared.roles r ON ur.role_id = r.id
        LEFT JOIN shared.jabatan j ON u.jabatan_id = j.id
        WHERE r.nama_role IS NULL OR r.nama_role NOT IN ('Siswa', 'Orang Tua')
        GROUP BY u.id, j.nama
        ORDER BY u.nama ASC
      `;
      const { query } = require('../config/db');
      const data = await query(sql);
      return response.success(res, 200, 'Daftar pegawai berhasil diambil', data.rows);
    } catch (err) { next(err); }
  },
};

module.exports = PayrollController;
