'use strict';

const { validationResult } = require('express-validator');
const SiswaService = require('../services/siswa.service');
const response = require('../utils/response');

const SiswaController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await SiswaService.getAll({ ...req.query, page, limit });
      return response.success(res, 200, 'Data siswa berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await SiswaService.getById(req.params.id);
      return response.success(res, 200, 'Data siswa berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nis, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat, status, kelas_id } = req.body;
      const data = await SiswaService.create({ nis, nama_lengkap, jenisKelamin: jenis_kelamin, tanggalLahir: tanggal_lahir, alamat, status, kelasId: kelas_id });
      return response.success(res, 201, 'Siswa berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nis, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat, status, kelas_id } = req.body;
      const data = await SiswaService.update(req.params.id, { nis, nama_lengkap, jenisKelamin: jenis_kelamin, tanggalLahir: tanggal_lahir, alamat, status, kelasId: kelas_id });
      return response.success(res, 200, 'Data siswa berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await SiswaService.delete(req.params.id);
      return response.success(res, 200, 'Siswa berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = SiswaController;
