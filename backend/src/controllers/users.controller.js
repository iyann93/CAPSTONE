'use strict';

const { validationResult } = require('express-validator');
const UsersService = require('../services/users.service');
const response = require('../utils/response');

const UsersController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await UsersService.getAll({ page, limit });
      return response.success(res, 200, 'Data users berhasil diambil', result.data, result.meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await UsersService.getById(req.params.id);
      return response.success(res, 200, 'Data user berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await UsersService.create(req.body);
      return response.success(res, 201, 'User berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await UsersService.update(req.params.id, req.body);
      return response.success(res, 200, 'User berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await UsersService.delete(req.params.id);
      return response.success(res, 200, 'User berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = UsersController;
