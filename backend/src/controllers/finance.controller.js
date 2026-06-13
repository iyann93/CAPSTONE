'use strict';

const FinanceService = require('../services/finance.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const FinanceController = {
  // ─── KOMPONEN SPP ──────────────────────────────────────────────────────────
  getAllKomponenSpp: async (req, res, next) => {
    try {
      const data = await FinanceService.getAllKomponenSpp();
      return response.success(res, 200, 'Komponen SPP berhasil diambil', data);
    } catch (err) { next(err); }
  },

  createKomponenSpp: async (req, res, next) => {
    try {
      const data = await FinanceService.createKomponenSpp(req.body);
      return response.success(res, 201, 'Komponen SPP berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  updateKomponenSpp: async (req, res, next) => {
    try {
      const data = await FinanceService.updateKomponenSpp(req.params.id, req.body);
      return response.success(res, 200, 'Komponen SPP berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  deleteKomponenSpp: async (req, res, next) => {
    try {
      await FinanceService.deleteKomponenSpp(req.params.id);
      return response.success(res, 200, 'Komponen SPP berhasil dihapus', null);
    } catch (err) { next(err); }
  },

  // ─── GENERATE TAGIHAN BULANAN ──────────────────────────────────────────────
  generateTagihanBulanan: async (req, res, next) => {
    try {
      const { bulan, tahun, kelas_id: kelasId } = req.body;
      if (!bulan || !tahun) {
        return response.error(res, 400, 'Parameter bulan dan tahun wajib diisi');
      }
      const data = await FinanceService.generateTagihanBulanan(parseInt(bulan), parseInt(tahun), req.user.userId, kelasId);
      return response.success(res, 201, `Berhasil men-generate ${data.generated} tagihan SPP`, data);
    } catch (err) { next(err); }
  },

  // ─── SPP TAGIHAN ───────────────────────────────────────────────────────────
  getAllTagihan: async (req, res, next) => {
    try {
      const { data, meta } = await FinanceService.getAllTagihan(req.query);
      return response.success(res, 200, 'Data tagihan SPP berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  createTagihan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await FinanceService.createTagihan(req.body, req.user.userId);
      return response.success(res, 201, 'Tagihan SPP berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  // ─── PEMBAYARAN ─────────────────────────────────────────────────────────────
  getAllPembayaran: async (req, res, next) => {
    try {
      const { data, meta } = await FinanceService.getAllPembayaran(req.query);
      return response.success(res, 200, 'Riwayat pembayaran berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getPembayaranById: async (req, res, next) => {
    try {
      const data = await FinanceService.getPembayaranById(req.params.id);
      return response.success(res, 200, 'Detail pembayaran berhasil diambil', data);
    } catch (err) { next(err); }
  },

  processPembayaran: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await FinanceService.processPembayaran(req.body, req.user.userId);
      return response.success(res, 201, 'Pembayaran berhasil diproses', data);
    } catch (err) { next(err); }
  },

  getLaporanBulanan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await FinanceService.getLaporanBulanan(req.query);
      return response.success(res, 200, 'Laporan keuangan bulanan berhasil diambil', data);
    } catch (err) { next(err); }
  }
};

module.exports = FinanceController;
