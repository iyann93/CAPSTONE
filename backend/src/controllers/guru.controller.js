'use strict';

const { validationResult } = require('express-validator');
const GuruService = require('../services/guru.service');
const response = require('../utils/response');

const GuruController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await GuruService.getAll({ ...req.query, page, limit });
      return response.success(res, 200, 'Data guru berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await GuruService.getById(req.params.id);
      return response.success(res, 200, 'Data guru berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nip, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, mata_pelajaran } = req.body;
      const data = await GuruService.create({ nip, nama, jenisKelamin: jenis_kelamin, tanggalLahir: tanggal_lahir, alamat, noTelepon: no_telepon, email, mataPelajaran: mata_pelajaran });
      return response.success(res, 201, 'Guru berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nip, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, mata_pelajaran, is_active } = req.body;
      const data = await GuruService.update(req.params.id, { nip, nama, jenisKelamin: jenis_kelamin, tanggalLahir: tanggal_lahir, alamat, noTelepon: no_telepon, email, mataPelajaran: mata_pelajaran, isActive: is_active });
      return response.success(res, 200, 'Data guru berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await GuruService.delete(req.params.id);
      return response.success(res, 200, 'Guru berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = GuruController;
