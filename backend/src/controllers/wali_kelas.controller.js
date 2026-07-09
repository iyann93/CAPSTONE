'use strict';

const WaliKelasService = require('../services/wali_kelas.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const WaliKelasController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await WaliKelasService.getAll(req.query);
      return response.success(res, 200, 'Data wali kelas berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await WaliKelasService.getById(req.params.id);
      return response.success(res, 200, 'Data wali kelas berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await WaliKelasService.create(req.body);
      return response.success(res, 201, 'Wali kelas berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await WaliKelasService.update(req.params.id, req.body);
      return response.success(res, 200, 'Wali kelas berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await WaliKelasService.delete(req.params.id);
      return response.success(res, 200, 'Wali kelas berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = WaliKelasController;
