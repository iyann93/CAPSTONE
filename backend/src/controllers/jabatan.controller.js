'use strict';

const JabatanRepository = require('../repositories/jabatan.repository');

const JabatanController = {
  getAll: async (req, res, next) => {
    try {
      const data = await JabatanRepository.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const data = await JabatanRepository.findById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Jabatan tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const data = await JabatanRepository.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const data = await JabatanRepository.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Jabatan tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const data = await JabatanRepository.delete(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Jabatan tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = JabatanController;
