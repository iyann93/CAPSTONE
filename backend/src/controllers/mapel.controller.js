'use strict';

const MapelService = require('../services/mapel.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const MapelController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await MapelService.getAll(req.query);
      return response.success(res, 200, 'Data mata pelajaran berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await MapelService.getById(req.params.id);
      return response.success(res, 200, 'Data mata pelajaran berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await MapelService.create(req.body);
      return response.success(res, 201, 'Mata pelajaran berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await MapelService.update(req.params.id, req.body);
      return response.success(res, 200, 'Mata pelajaran berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await MapelService.delete(req.params.id);
      return response.success(res, 200, 'Mata pelajaran berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = MapelController;
