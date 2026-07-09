'use strict';

const WaliKelasRepository = require('../repositories/wali_kelas.repository');
const { paginate } = require('../utils/queryBuilder');

const WaliKelasService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, kelas_id: kelasId, tahun_ajaran_id: tahunAjaranId } = query;
    const { rows, total } = await WaliKelasRepository.findAll({ limit, offset, search, sort, kelasId, tahunAjaranId });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await WaliKelasRepository.findById(id);
    if (!data) { const e = new Error('Wali kelas tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ guruId, kelasId, tahunAjaranId }) => {
    // One wali kelas per kelas per tahun ajaran
    const existing = await WaliKelasRepository.findByKelasAndTahun(kelasId, tahunAjaranId);
    if (existing) { const e = new Error('Kelas ini sudah memiliki wali kelas untuk tahun ajaran tersebut'); e.statusCode = 409; throw e; }
    return WaliKelasRepository.create({ guruId, kelasId, tahunAjaranId });
  },

  update: async (id, { guruId, kelasId, tahunAjaranId }) => {
    const existing = await WaliKelasService.getById(id);
    const checkKelas = kelasId || existing.kelas_id;
    const checkTahun = tahunAjaranId || existing.tahun_ajaran_id;
    if (kelasId || tahunAjaranId) {
      const dup = await WaliKelasRepository.findByKelasAndTahun(checkKelas, checkTahun, id);
      if (dup) { const e = new Error('Kelas ini sudah memiliki wali kelas untuk tahun ajaran tersebut'); e.statusCode = 409; throw e; }
    }
    return WaliKelasRepository.update(id, { guruId, kelasId, tahunAjaranId });
  },

  delete: async (id) => {
    const deleted = await WaliKelasRepository.delete(id);
    if (!deleted) { const e = new Error('Wali kelas tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = WaliKelasService;
