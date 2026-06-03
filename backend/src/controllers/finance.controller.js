'use strict';

const FinanceService = require('../services/finance.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const FinanceController = {
  // SPP Tagihan
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
      const data = await FinanceService.createTagihan(req.body, req.user.id);
      return response.success(res, 201, 'Tagihan SPP berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  // Pembayaran
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
      const data = await FinanceService.processPembayaran(req.body, req.user.id);
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
