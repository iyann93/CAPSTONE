'use strict';

const OrangTuaRepository = require('../repositories/orang_tua.repository');

const OrangTuaService = {
  getAll: async () => {
    return await OrangTuaRepository.getAll();
  },

  getById: async (id) => {
    const data = await OrangTuaRepository.getById(id);
    if (!data) {
      const e = new Error('Data orang tua tidak ditemukan');
      e.statusCode = 404;
      throw e;
    }
    return data;
  },

  create: async (body) => {
    const { siswa_id, nama_ayah, nama_ibu, no_telepon, pekerjaan_wali, hubungan, user_id } = body;
    if (!siswa_id) {
      const e = new Error('siswa_id wajib diisi');
      e.statusCode = 400;
      throw e;
    }
    return await OrangTuaRepository.create({ user_id, siswa_id, nama_ayah, nama_ibu, no_telepon, pekerjaan_wali, hubungan });
  },

  update: async (id, body) => {
    const existing = await OrangTuaRepository.getById(id);
    if (!existing) {
      const e = new Error('Data orang tua tidak ditemukan');
      e.statusCode = 404;
      throw e;
    }
    return await OrangTuaRepository.update(id, body);
  },

  delete: async (id) => {
    const deleted = await OrangTuaRepository.delete(id);
    if (!deleted) {
      const e = new Error('Data orang tua tidak ditemukan');
      e.statusCode = 404;
      throw e;
    }
    return deleted;
  },
};

module.exports = OrangTuaService;
