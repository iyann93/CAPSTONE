'use strict';

const NilaiService = require('../services/nilai.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const NilaiController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await NilaiService.getAll(req.query);
      return response.success(res, 200, 'Data nilai berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await NilaiService.getById(req.params.id);
      return response.success(res, 200, 'Data nilai berhasil diambil', data);
    } catch (err) { next(err); }
  },

  getBySiswa: async (req, res, next) => {
    try {
      const { data, meta } = await NilaiService.getBySiswa(req.params.id, req.query);
      return response.success(res, 200, 'Data nilai siswa berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getByKelas: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await NilaiService.getByKelas(req.params.id, req.query);
      return response.success(res, 200, 'Rekap nilai kelas berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.type = 'validation';
        error.errors = errors.array();
        return next(error);
      }
      // req.user.id diambil dari token user login (guru)
      const data = await NilaiService.create(req.body, req.user.id);
      return response.success(res, 201, 'Nilai berhasil disimpan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await NilaiService.update(req.params.id, req.body);
      return response.success(res, 200, 'Nilai berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await NilaiService.delete(req.params.id);
      return response.success(res, 200, 'Nilai berhasil dihapus');
    } catch (err) { next(err); }
  }
};

module.exports = NilaiController;
