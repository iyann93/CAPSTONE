'use strict';

const TahunAjaranService = require('../services/tahun_ajaran.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const TahunAjaranController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await TahunAjaranService.getAll(req.query);
      return response.success(res, 200, 'Data tahun ajaran berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getActive: async (req, res, next) => {
    try {
      const data = await TahunAjaranService.getActive();
      return response.success(res, 200, 'Data tahun ajaran aktif berhasil diambil', data);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await TahunAjaranService.getById(req.params.id);
      return response.success(res, 200, 'Data tahun ajaran berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await TahunAjaranService.create(req.body);
      return response.success(res, 201, 'Tahun ajaran berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await TahunAjaranService.update(req.params.id, req.body);
      return response.success(res, 200, 'Tahun ajaran berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  setActive: async (req, res, next) => {
    try {
      const data = await TahunAjaranService.setActive(req.params.id);
      return response.success(res, 200, 'Tahun ajaran berhasil diaktifkan', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await TahunAjaranService.delete(req.params.id);
      return response.success(res, 200, 'Tahun ajaran berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = TahunAjaranController;
