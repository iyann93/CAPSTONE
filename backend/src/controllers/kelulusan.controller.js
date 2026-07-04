'use strict';

const KelulusanService = require('../services/kelulusan.service');
const response = require('../utils/response');

const KelulusanController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 50;
      const result = await KelulusanService.getAll({ ...req.query, page, limit });
      return response.success(res, 200, 'Data kelulusan berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await KelulusanService.getById(req.params.siswaId);
      return response.success(res, 200, 'Detail kelulusan berhasil diambil', data);
    } catch (err) { next(err); }
  },

  save: async (req, res, next) => {
    try {
      const { siswaId, status, no_ijazah, divalidasi_kepsek, tanggal_kelulusan, tahun_ajaran_id } = req.body;
      const result = await KelulusanService.saveGraduation({
        siswaId: siswaId || req.params.siswaId,
        status,
        noIjazah: no_ijazah,
        divalidasiKepsek: divalidasi_kepsek,
        divalidasiOleh: req.user?.id, // Dari middleware verifyToken
        tanggalKelulusan: tanggal_kelulusan,
        tahunAjaranId: tahun_ajaran_id
      });
      return response.success(res, 200, 'Data kelulusan berhasil disimpan', result);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await KelulusanService.delete(req.params.siswaId);
      return response.success(res, 200, 'Data kelulusan berhasil dihapus');
    } catch (err) { next(err); }
  }
};

module.exports = KelulusanController;
