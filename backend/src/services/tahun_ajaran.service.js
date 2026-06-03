'use strict';

const TahunAjaranRepository = require('../repositories/tahun_ajaran.repository');
const { paginate } = require('../utils/queryBuilder');

const TahunAjaranService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, is_active: isActive } = query;
    const { rows, total } = await TahunAjaranRepository.findAll({ limit, offset, search, sort, isActive });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getActive: async () => {
    const data = await TahunAjaranRepository.findActive();
    if (!data) { const e = new Error('Tidak ada tahun ajaran yang aktif'); e.statusCode = 404; throw e; }
    return data;
  },

  getById: async (id) => {
    const data = await TahunAjaranRepository.findById(id);
    if (!data) { const e = new Error('Tahun ajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ nama, tanggalMulai, tanggalSelesai }) => {
    const existing = await TahunAjaranRepository.findByNama(nama);
    if (existing) { const e = new Error('Tahun ajaran sudah ada'); e.statusCode = 409; throw e; }
    return TahunAjaranRepository.create({ nama, tanggalMulai, tanggalSelesai });
  },

  update: async (id, { nama, tanggalMulai, tanggalSelesai }) => {
    await TahunAjaranService.getById(id);
    if (nama) {
      const dup = await TahunAjaranRepository.findByNama(nama, id);
      if (dup) { const e = new Error('Nama tahun ajaran sudah digunakan'); e.statusCode = 409; throw e; }
    }
    return TahunAjaranRepository.update(id, { nama, tanggalMulai, tanggalSelesai });
  },

  setActive: async (id) => {
    await TahunAjaranService.getById(id);
    return TahunAjaranRepository.setActive(id);
  },

  delete: async (id) => {
    const existing = await TahunAjaranRepository.findById(id);
    if (!existing) { const e = new Error('Tahun ajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    if (existing.is_active) { const e = new Error('Tidak dapat menghapus tahun ajaran yang sedang aktif'); e.statusCode = 400; throw e; }
    const deleted = await TahunAjaranRepository.delete(id);
    if (!deleted) { const e = new Error('Tahun ajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = TahunAjaranService;
