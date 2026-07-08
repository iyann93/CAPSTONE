'use strict';

const SemesterRepository = require('../repositories/semester.repository');
const { paginate } = require('../utils/queryBuilder');

const SemesterService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, tahun_ajaran_id: tahunAjaranId, is_aktif } = query;
    const { rows, total } = await SemesterRepository.findAll({ limit, offset, search, sort, tahunAjaranId, is_aktif });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await SemesterRepository.findById(id);
    if (!data) { const e = new Error('Semester tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ nama, tahunAjaranId, tanggalMulai, tanggalSelesai }) => {
    const existing = await SemesterRepository.findByNamaAndTahun(nama, tahunAjaranId);
    if (existing) { const e = new Error('Semester sudah ada untuk tahun ajaran ini'); e.statusCode = 409; throw e; }
    return SemesterRepository.create({ nama, tahunAjaranId, tanggalMulai, tanggalSelesai });
  },

  update: async (id, { nama, tahunAjaranId, tanggalMulai, tanggalSelesai }) => {
    const existing = await SemesterService.getById(id);
    if (nama || tahunAjaranId) {
      const checkNama = nama || existing.nama;
      const checkTahun = tahunAjaranId || existing.tahun_ajaran_id;
      const dup = await SemesterRepository.findByNamaAndTahun(checkNama, checkTahun, id);
      if (dup) { const e = new Error('Semester sudah ada untuk tahun ajaran ini'); e.statusCode = 409; throw e; }
    }
    return SemesterRepository.update(id, { nama, tahunAjaranId, tanggalMulai, tanggalSelesai });
  },

  setActive: async (id) => {
    await SemesterService.getById(id);
    return SemesterRepository.setActive(id);
  },

  delete: async (id) => {
    const existing = await SemesterRepository.findById(id);
    if (!existing) { const e = new Error('Semester tidak ditemukan'); e.statusCode = 404; throw e; }
    if (existing.is_aktif) { const e = new Error('Tidak dapat menghapus semester yang sedang aktif'); e.statusCode = 400; throw e; }
    const deleted = await SemesterRepository.delete(id);
    if (!deleted) { const e = new Error('Semester tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = SemesterService;
