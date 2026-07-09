'use strict';

const SemesterService = require('../services/semester.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const SemesterController = {
  getAll: async (req, res, next) => {
    try {
      const { data, meta } = await SemesterService.getAll(req.query);
      return response.success(res, 200, 'Data semester berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await SemesterService.getById(req.params.id);
      return response.success(res, 200, 'Data semester berhasil diambil', data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await SemesterService.create(req.body);
      return response.success(res, 201, 'Semester berhasil ditambahkan', data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await SemesterService.update(req.params.id, req.body);
      return response.success(res, 200, 'Semester berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  setActive: async (req, res, next) => {
    try {
      const data = await SemesterService.setActive(req.params.id);
      return response.success(res, 200, 'Semester berhasil diaktifkan', data);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await SemesterService.delete(req.params.id);
      return response.success(res, 200, 'Semester berhasil dihapus');
    } catch (err) { next(err); }
  },
};

module.exports = SemesterController;
