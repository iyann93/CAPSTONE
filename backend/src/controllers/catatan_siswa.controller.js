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
      const { query } = require('../config/db');
      
      let guruId = null;
      if (req.user.userId) {
        const guruRes = await query('SELECT id FROM academic.guru WHERE user_id = $1 LIMIT 1', [req.user.userId]);
        if (guruRes.rows.length > 0) {
          guruId = guruRes.rows[0].id;
        }
      }
      
      if (!guruId) {
         const fallbackRes = await query('SELECT id FROM academic.guru LIMIT 1');
         if (fallbackRes.rows.length > 0) {
             guruId = fallbackRes.rows[0].id;
         } else {
             const e = new Error('Data guru tidak ditemukan untuk memproses catatan');
             e.statusCode = 400;
             return next(e);
         }
      }

      const data = await CatatanSiswaService.upsert(req.body, guruId);
      return response.success(res, 201, 'Catatan berhasil disimpan', data);
    } catch (err) { next(err); }
  }
};

module.exports = CatatanSiswaController;
