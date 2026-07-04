'use strict';

const KelasRepository = require('../repositories/kelas.repository');
const { paginate } = require('../utils/queryBuilder');

const KelasService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, jurusan_id: jurusanId, tingkat } = query;
    const { rows, total } = await KelasRepository.findAll({ limit, offset, search, sort, jurusanId, tingkat });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await KelasRepository.findById(id);
    if (!data) { const e = new Error('Kelas tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ namaKelas, tingkat, tahunAjaran, jurusanId, waliKelasId, kapasitas }) => {
    return KelasRepository.create({ namaKelas, tingkat, tahunAjaran, jurusanId, waliKelasId, kapasitas });
  },

  update: async (id, { namaKelas, tingkat, tahunAjaran, jurusanId, waliKelasId, kapasitas }) => {
    await KelasService.getById(id);
    return KelasRepository.update(id, { namaKelas, tingkat, tahunAjaran, jurusanId, waliKelasId, kapasitas });
  },

  delete: async (id) => {
    const deleted = await KelasRepository.delete(id);
    if (!deleted) { const e = new Error('Kelas tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = KelasService;
