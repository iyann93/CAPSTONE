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
      
      const { query } = require('../config/db');
      
      // req.user.userId adalah ID dari shared.users. Kita perlu id dari academic.guru
      let guruId = null;
      if (req.user.userId) {
        const guruRes = await query('SELECT id FROM academic.guru WHERE user_id = $1 LIMIT 1', [req.user.userId]);
        if (guruRes.rows.length > 0) {
          guruId = guruRes.rows[0].id;
        }
      }
      
      // Fallback jika tidak ditemukan (misal: user admin sedang testing)
      if (!guruId) {
         const fallbackRes = await query('SELECT id FROM academic.guru LIMIT 1');
         if (fallbackRes.rows.length > 0) {
             guruId = fallbackRes.rows[0].id;
         } else {
             const e = new Error('Data guru tidak ditemukan untuk memproses nilai');
             e.statusCode = 400;
             return next(e);
         }
      }

      // Auto resolve mata_pelajaran_id
      // req.body.siswaId -> kelas_id -> jadwal_pelajaran
      const siswaRes = await query('SELECT kelas_id FROM academic.siswa WHERE id = $1', [req.body.siswaId]);
      if (siswaRes.rows.length === 0) {
         const e = new Error('Data siswa tidak valid');
         e.statusCode = 400;
         return next(e);
      }
      
      const kelasId = siswaRes.rows[0].kelas_id;
      const jadwalRes = await query(
         'SELECT mata_pelajaran_id FROM academic.jadwal_pelajaran WHERE guru_id = $1 AND kelas_id = $2 LIMIT 1',
         [guruId, kelasId]
      );
      
      if (jadwalRes.rows.length === 0) {
         // Fallback: check if the guru is a global guru_pengampu_id for ANY mapel
         const mapelRes = await query(
           'SELECT id FROM academic.mata_pelajaran WHERE guru_pengampu_id = $1 LIMIT 1',
           [guruId]
         );
         if (mapelRes.rows.length > 0) {
           req.body.mataPelajaranId = mapelRes.rows[0].id;
         } else {
           const e = new Error('Guru ini tidak memiliki jadwal mengajar maupun mata pelajaran default');
           e.statusCode = 400;
           return next(e);
         }
      } else {
         // Override mataPelajaranId from body with the absolute SSOT value
         req.body.mataPelajaranId = jadwalRes.rows[0].mata_pelajaran_id;
      }

      const data = await NilaiService.create(req.body, guruId);
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
