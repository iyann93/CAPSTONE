'use strict';

const MapelRepository = require('../repositories/mapel.repository');
const { paginate } = require('../utils/queryBuilder');

const MapelService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, jurusan_id: jurusanId, tingkat } = query;
    const { rows, total } = await MapelRepository.findAll({ limit, offset, search, sort, jurusanId, tingkat });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await MapelRepository.findById(id);
    if (!data) { const e = new Error('Mata pelajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ kodeMapel, namaMapel, tingkat, deskripsi, jurusanId }) => {
    const existing = await MapelRepository.findByKode(kodeMapel);
    if (existing) { const e = new Error('Kode mapel sudah digunakan'); e.statusCode = 409; throw e; }
    return MapelRepository.create({ kodeMapel, namaMapel, tingkat, deskripsi, jurusanId });
  },

  update: async (id, { kodeMapel, namaMapel, tingkat, deskripsi, jurusanId }) => {
    await MapelService.getById(id);
    if (kodeMapel) {
      const dup = await MapelRepository.findByKode(kodeMapel, id);
      if (dup) { const e = new Error('Kode mapel sudah digunakan'); e.statusCode = 409; throw e; }
    }
    return MapelRepository.update(id, { kodeMapel, namaMapel, tingkat, deskripsi, jurusanId });
  },

  delete: async (id) => {
    const deleted = await MapelRepository.delete(id);
    if (!deleted) { const e = new Error('Mata pelajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = MapelService;
