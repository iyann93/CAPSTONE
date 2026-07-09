'use strict';

const JurusanRepository = require('../repositories/jurusan.repository');
const { paginate } = require('../utils/queryBuilder');

const JurusanService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort } = query;
    const { rows, total } = await JurusanRepository.findAll({ limit, offset, search, sort });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await JurusanRepository.findById(id);
    if (!data) { const e = new Error('Jurusan tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ kodeJurusan, namaJurusan, kepalaJurusan }) => {
    const existing = await JurusanRepository.findByKode(kodeJurusan);
    if (existing) { const e = new Error('Kode jurusan sudah digunakan'); e.statusCode = 409; throw e; }
    return JurusanRepository.create({ kodeJurusan, namaJurusan, kepalaJurusan });
  },

  update: async (id, { kodeJurusan, namaJurusan, kepalaJurusan }) => {
    await JurusanService.getById(id);
    if (kodeJurusan) {
      const dup = await JurusanRepository.findByKode(kodeJurusan, id);
      if (dup) { const e = new Error('Kode jurusan sudah digunakan'); e.statusCode = 409; throw e; }
    }
    return JurusanRepository.update(id, { kodeJurusan, namaJurusan, kepalaJurusan });
  },

  delete: async (id) => {
    const deleted = await JurusanRepository.delete(id);
    if (!deleted) { const e = new Error('Jurusan tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = JurusanService;
