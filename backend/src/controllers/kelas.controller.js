'use strict';

const { validationResult } = require('express-validator');
const KelasService = require('../services/kelas.service');
const response = require('../utils/response');

const KelasController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await KelasService.getAll({ page, limit });
      return response.success(res, 200, 'Data kelas berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await KelasService.getById(req.params.id);
      return response.success(res, 200, 'Data kelas berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nama_kelas, tingkat, tahun_ajaran, jurusan_id, wali_kelas_id, kapasitas } = req.body;
      const data = await KelasService.create({ namaKelas: nama_kelas, tingkat, tahunAjaran: tahun_ajaran, jurusanId: jurusan_id, waliKelasId: wali_kelas_id, kapasitas });
      return response.success(res, 201, 'Kelas berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nama_kelas, tingkat, tahun_ajaran, jurusan_id, wali_kelas_id, kapasitas } = req.body;
      const data = await KelasService.update(req.params.id, { namaKelas: nama_kelas, tingkat, tahunAjaran: tahun_ajaran, jurusanId: jurusan_id, waliKelasId: wali_kelas_id, kapasitas });
      return response.success(res, 200, 'Kelas berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await KelasService.delete(req.params.id);
      return response.success(res, 200, 'Kelas berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = KelasController;
