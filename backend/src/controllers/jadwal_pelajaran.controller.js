'use strict';

const JadwalPelajaranService = require('../services/jadwal_pelajaran.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const JadwalPelajaranController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await JadwalPelajaranService.getAll(req.query);
      return response.success(res, 200, 'Data jadwal pelajaran berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await JadwalPelajaranService.getById(req.params.id);
      return response.success(res, 200, 'Data jadwal pelajaran berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await JadwalPelajaranService.create(req.body);
      return response.success(res, 201, 'Jadwal pelajaran berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await JadwalPelajaranService.update(req.params.id, req.body);
      return response.success(res, 200, 'Jadwal pelajaran berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await JadwalPelajaranService.delete(req.params.id);
      return response.success(res, 200, 'Jadwal pelajaran berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = JadwalPelajaranController;
