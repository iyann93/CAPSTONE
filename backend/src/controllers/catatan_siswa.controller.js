'use strict';

const CatatanSiswaService = require('../services/catatan_siswa.service');
const response = require('../utils/response');

const CatatanSiswaController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await CatatanSiswaService.getAll(req.query);
      return response.success(res, 200, 'Data catatan siswa berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  upsert: async (req, res, next) => {
    try {
      // req.user.userId didapat dari verifyToken
      const data = await CatatanSiswaService.upsert(req.body, req.user.userId);
      return response.success(res, 201, 'Catatan berhasil disimpan', data);
    } catch (err) { next(err); }
  }
};

module.exports = CatatanSiswaController;
