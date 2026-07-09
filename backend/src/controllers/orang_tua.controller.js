'use strict';

const OrangTuaService = require('../services/orang_tua.service');
const response = require('../utils/response');

const OrangTuaController = {
  getAll: async (req, res, next) => {
    try {
      const data = await OrangTuaService.getAll();
      return response.success(res, 200, 'Data orang tua berhasil diambil', data);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await OrangTuaService.getById(req.params.id);
      return response.success(res, 200, 'Data orang tua berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const data = await OrangTuaService.create(req.body);
      return response.success(res, 201, 'Data orang tua berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const data = await OrangTuaService.update(req.params.id, req.body);
      return response.success(res, 200, 'Data orang tua berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await OrangTuaService.delete(req.params.id);
      return response.success(res, 200, 'Data orang tua berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = OrangTuaController;
