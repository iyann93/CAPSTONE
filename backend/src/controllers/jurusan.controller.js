'use strict';

const { validationResult } = require('express-validator');
const JurusanService = require('../services/jurusan.service');
const response = require('../utils/response');

const JurusanController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await JurusanService.getAll({ page, limit });
      return response.success(res, 200, 'Data jurusan berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await JurusanService.getById(req.params.id);
      return response.success(res, 200, 'Data jurusan berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { kode_jurusan, nama_jurusan, kepala_jurusan } = req.body;
      const data = await JurusanService.create({ kodeJurusan: kode_jurusan, namaJurusan: nama_jurusan, kepalaJurusan: kepala_jurusan });
      return response.success(res, 201, 'Jurusan berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { kode_jurusan, nama_jurusan, kepala_jurusan } = req.body;
      const data = await JurusanService.update(req.params.id, { kodeJurusan: kode_jurusan, namaJurusan: nama_jurusan, kepalaJurusan: kepala_jurusan });
      return response.success(res, 200, 'Jurusan berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await JurusanService.delete(req.params.id);
      return response.success(res, 200, 'Jurusan berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = JurusanController;
