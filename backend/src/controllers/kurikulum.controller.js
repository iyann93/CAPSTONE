'use strict';

const KurikulumService = require('../services/kurikulum.service');
const MapelService = require('../services/mapel.service');
const response = require('../utils/response');

const KurikulumController = {
  getAll: async (req, res, next) => {
    try {
      const result = await KurikulumService.getAll(req.query);
      return response.success(res, 200, 'Data kurikulum berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await KurikulumService.getById(req.params.id);
      return response.success(res, 200, 'Data kurikulum berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const data = await KurikulumService.create(req.body);
      return response.success(res, 201, 'Kurikulum berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const data = await KurikulumService.update(req.params.id, req.body);
      return response.success(res, 200, 'Kurikulum berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const data = await KurikulumService.delete(req.params.id);
      return response.success(res, 200, 'Kurikulum berhasil dihapus', data);
    } catch (err) { next(err); }
  },

  getMapel: async (req, res, next) => {
    try {
      // Fetch mapel that belong to this kurikulum_id
      const query = { ...req.query, kurikulum_id: req.params.id };
      const result = await MapelService.getAll(query);
      return response.success(res, 200, 'Data mata pelajaran kurikulum berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  }
};

module.exports = KurikulumController;
