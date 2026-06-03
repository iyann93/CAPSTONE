'use strict';

const AbsensiService = require('../services/absensi.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const AbsensiController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await AbsensiService.getAll(req.query);
      return response.success(res, 200, 'Data absensi berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await AbsensiService.getById(req.params.id);
      return response.success(res, 200, 'Data absensi berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      // req.user.id didapat dari verifyToken middleware
      const data = await AbsensiService.create(req.body, req.user.id);
      return response.success(res, 201, 'Data absensi berhasil disimpan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await AbsensiService.update(req.params.id, req.body, req.user.id);
      return response.success(res, 200, 'Data absensi berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await AbsensiService.delete(req.params.id);
      return response.success(res, 200, 'Data absensi berhasil dihapus');
    } catch (err) { next(err); }
  },

  getRekapBulanan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await AbsensiService.getRekapBulanan(req.query);
      return response.success(res, 200, 'Rekap absensi bulanan berhasil diambil', data);
    } catch (err) { next(err); }
  },

  getRekapSemester: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await AbsensiService.getRekapSemester(req.query);
      return response.success(res, 200, 'Rekap absensi semester berhasil diambil', data);
    } catch (err) { next(err); }
  },

  getStatistik: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await AbsensiService.getStatistik(req.query);
      return response.success(res, 200, 'Statistik absensi berhasil diambil', data);
    } catch (err) { next(err); }
  }
};

module.exports = AbsensiController;
