'use strict';

const { validationResult } = require('express-validator');
const MapelService = require('../services/mapel.service');
const response = require('../utils/response');

const MapelController = {
  getAll: async (req, res, next) => {
    try {
      const page   = parseInt(req.query.page,  10) || 1;
      const limit  = parseInt(req.query.limit, 10) || 50;
      const result = await MapelService.getAll({ ...req.query, page, limit });
      return response.success(res, 200, 'Data mata pelajaran berhasil diambil', result.data, result.meta);
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
      const { kode, nama, kelompok, kkm, jumlah_jam, tingkat, guru_pengampu_id, kurikulum_id } = req.body;
      const data = await MapelService.create({
        kode, nama, kelompok,
        kkm: parseInt(kkm) || 75,
        jumlahJam: parseInt(jumlah_jam) || 2,
        tingkat,
        guruPengampuId: guru_pengampu_id || null,
        kurikulum_id
      });
      return response.success(res, 201, 'Mata pelajaran berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const { kode, nama, kelompok, kkm, jumlah_jam, tingkat, guru_pengampu_id, kurikulum_id } = req.body;
      const data = await MapelService.update(req.params.id, {
        kode, nama, kelompok,
        kkm: parseInt(kkm) || undefined,
        jumlahJam: parseInt(jumlah_jam) || undefined,
        tingkat,
        guruPengampuId: guru_pengampu_id || null,
        kurikulum_id
      });
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
