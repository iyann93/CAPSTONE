'use strict';

const MapelRepository = require('../repositories/mapel.repository');
const { paginate } = require('../utils/queryBuilder');

const MapelService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, kelompok, tingkat } = query;
    const { rows, total } = await MapelRepository.findAll({ limit, offset, search, sort, kelompok, tingkat });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await MapelRepository.findById(id);
    if (!data) { const e = new Error('Mata pelajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ kode, nama, kelompok, kkm, jumlahJam, tingkat, guruPengampuId }) => {
    const existing = await MapelRepository.findByKode(kode);
    if (existing) { const e = new Error('Kode mata pelajaran sudah digunakan'); e.statusCode = 409; throw e; }
    return MapelRepository.create({ kode, nama, kelompok, kkm, jumlahJam, tingkat, guruPengampuId });
  },

  update: async (id, { kode, nama, kelompok, kkm, jumlahJam, tingkat, guruPengampuId }) => {
    await MapelService.getById(id);
    if (kode) {
      const dup = await MapelRepository.findByKode(kode, id);
      if (dup) { const e = new Error('Kode mata pelajaran sudah digunakan'); e.statusCode = 409; throw e; }
    }
    return MapelRepository.update(id, { kode, nama, kelompok, kkm, jumlahJam, tingkat, guruPengampuId });
  },

  delete: async (id) => {
    const deleted = await MapelRepository.delete(id);
    if (!deleted) { const e = new Error('Mata pelajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = MapelService;
