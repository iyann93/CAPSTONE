'use strict';

const BeasiswaService = require('../services/beasiswa.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const BeasiswaController = {
  getAll: async (req, res, next) => {
    try {
      const result = await BeasiswaService.getAll(req.query);
      return response.success(res, 200, 'Data beasiswa berhasil diambil', result);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return response.error(res, 400, 'Validasi gagal', errors.array());
      
      const data = await BeasiswaService.getById(req.params.id);
      return response.success(res, 200, 'Data beasiswa berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return response.error(res, 400, 'Validasi gagal', errors.array());

      const data = await BeasiswaService.create(req.body);
      return response.success(res, 201, 'Beasiswa berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return response.error(res, 400, 'Validasi gagal', errors.array());

      const data = await BeasiswaService.update(req.params.id, req.body);
      return response.success(res, 200, 'Beasiswa berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return response.error(res, 400, 'Validasi gagal', errors.array());

      await BeasiswaService.delete(req.params.id);
      return response.success(res, 200, 'Beasiswa berhasil dihapus', null);
    } catch (err) { next(err); }
  }
};

module.exports = BeasiswaController;
