'use strict';

const KenaikanKelasService = require('../services/kenaikan_kelas.service');
const response = require('../utils/response');

const KenaikanKelasController = {
  getByTahunAjaran: async (req, res, next) => {
    try {
      const data = await KenaikanKelasService.getByTahunAjaran(req.query.tahun_ajaran_id);
      return response.success(res, 200, 'Data kenaikan kelas berhasil diambil', data);
    } catch (err) { next(err); }
  },

  bulkUpsert: async (req, res, next) => {
    try {
      const data = await KenaikanKelasService.bulkUpsert(req.body);
      return response.success(res, 200, 'Proses kenaikan kelas berhasil disimpan', data);
    } catch (err) { next(err); }
  }
};

module.exports = KenaikanKelasController;
