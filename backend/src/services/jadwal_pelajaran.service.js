'use strict';

const JadwalPelajaranRepository = require('../repositories/jadwal_pelajaran.repository');
const { paginate } = require('../utils/queryBuilder');

const JadwalPelajaranService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const {
      search, sort,
      kelas_id: kelasId, guru_id: guruId, mapel_id: mapelId,
      semester_id: semesterId, hari,
    } = query;
    const { rows, total } = await JadwalPelajaranRepository.findAll({
      limit, offset, search, sort, kelasId, guruId, mapelId, semesterId, hari,
    });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await JadwalPelajaranRepository.findById(id);
    if (!data) { const e = new Error('Jadwal pelajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async ({ kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai }) => {
    // Check for scheduling conflict
    const conflict = await JadwalPelajaranRepository.checkConflict({ kelasId, hari, jamMulai, jamSelesai });
    if (conflict) {
      const e = new Error('Terdapat jadwal yang bentrok pada kelas, hari, dan jam yang sama');
      e.statusCode = 409;
      throw e;
    }
    return JadwalPelajaranRepository.create({ kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai });
  },

  update: async (id, { kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai }) => {
    const existing = await JadwalPelajaranService.getById(id);
    // Check conflict excluding self
    const checkKelas = kelasId || existing.kelas_id;
    const checkHari = hari || existing.hari;
    const checkMulai = jamMulai || existing.jam_mulai;
    const checkSelesai = jamSelesai || existing.jam_selesai;
    const conflict = await JadwalPelajaranRepository.checkConflict({
      kelasId: checkKelas, hari: checkHari, jamMulai: checkMulai, jamSelesai: checkSelesai, excludeId: id,
    });
    if (conflict) {
      const e = new Error('Terdapat jadwal yang bentrok pada kelas, hari, dan jam yang sama');
      e.statusCode = 409;
      throw e;
    }
    return JadwalPelajaranRepository.update(id, { kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai });
  },

  delete: async (id) => {
    const deleted = await JadwalPelajaranRepository.delete(id);
    if (!deleted) { const e = new Error('Jadwal pelajaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = JadwalPelajaranService;
