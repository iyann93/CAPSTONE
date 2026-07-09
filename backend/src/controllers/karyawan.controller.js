'use strict';

const { validationResult } = require('express-validator');
const KaryawanService = require('../services/karyawan.service');
const response = require('../utils/response');

const KaryawanController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await KaryawanService.getAll({ page, limit });
      return response.success(res, 200, 'Data karyawan berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await KaryawanService.getById(req.params.id);
      return response.success(res, 200, 'Data karyawan berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nip, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, jabatan, departemen } = req.body;
      const data = await KaryawanService.create({ nip, nama, jenisKelamin: jenis_kelamin, tanggalLahir: tanggal_lahir, alamat, noTelepon: no_telepon, email, jabatan, departemen });
      return response.success(res, 201, 'Karyawan berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const { nip, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, jabatan, departemen, is_active } = req.body;
      const data = await KaryawanService.update(req.params.id, { nip, nama, jenisKelamin: jenis_kelamin, tanggalLahir: tanggal_lahir, alamat, noTelepon: no_telepon, email, jabatan, departemen, isActive: is_active });
      return response.success(res, 200, 'Data karyawan berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await KaryawanService.delete(req.params.id);
      return response.success(res, 200, 'Karyawan berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = KaryawanController;
