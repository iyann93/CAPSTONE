'use strict';

const RaporService = require('../services/rapor.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const RaporController = {
  getById: async (req, res, next) => {
    try {
      const data = await RaporService.getById(req.params.id);
      return response.success(res, 200, 'Data rapor berhasil diambil', data);
    } catch (err) { next(err); }
  },

  getBySiswa: async (req, res, next) => {
    try {
      const data = await RaporService.getBySiswa(req.params.id);
      return response.success(res, 200, 'Riwayat rapor siswa berhasil diambil', data);
    } catch (err) { next(err); }
  },

  getByKelas: async (req, res, next) => {
    try {
      const data = await RaporService.getByKelas(req.params.id, req.query.semester_id);
      return response.success(res, 200, 'Data rapor kelas berhasil diambil', data);
    } catch (err) { next(err); }
  },

  generate: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await RaporService.generate(req.body, req.user.userId);
      return response.success(res, 201, 'Proses generate rapor berhasil dijalankan', data);
    } catch (err) { next(err); }
  },

  publish: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await RaporService.publish(req.body, req.user.userId);
      return response.success(res, 200, 'Rapor berhasil di-publish', data);
    } catch (err) { next(err); }
  },

  unpublish: async (req, res, next) => {
    try {
      const { siswaId, semesterId } = req.body;
      if (!siswaId || !semesterId) return response.error(res, 400, 'siswaId dan semesterId wajib diisi');
      const data = await RaporService.unpublish(siswaId, semesterId);
      return response.success(res, 200, 'Status rapor berhasil direset', data);
    } catch (err) { next(err); }
  }
};

module.exports = RaporController;
