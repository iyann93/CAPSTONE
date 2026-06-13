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

  // POST /payroll/generate  — Generate slip gaji + hitung komponen otomatis
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
    } catch (err) { next(err); }
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
};

module.exports = PayrollController;
