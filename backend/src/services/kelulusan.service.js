'use strict';

const KelulusanRepository = require('../repositories/kelulusan.repository');
const { query } = require('../config/db');
const { paginate } = require('../utils/queryBuilder');

const KelulusanService = {
  getAll: async (queryParams) => {
    const { page, limit, offset } = paginate(queryParams);
    const { search, sort, kelas_id: kelasId, status } = queryParams;
    const { rows, total } = await KelulusanRepository.findAll({ limit, offset, search, sort, kelasId, status });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (siswaId) => {
    const data = await KelulusanRepository.findById(siswaId);
    if (!data) {
      const e = new Error('Data kelulusan siswa tidak ditemukan');
      e.statusCode = 404;
      throw e;
    }
    return data;
  },

  saveGraduation: async ({ siswaId, status, noIjazah, divalidasiKepsek, divalidasiOleh, tanggalKelulusan, tahunAjaranId }) => {
    // 1. Resolve active tahun_ajaran_id if not provided
    let taId = tahunAjaranId;
    if (!taId) {
      const taRes = await query("SELECT id FROM academic.tahun_ajaran WHERE is_aktif = true LIMIT 1");
      taId = taRes.rows[0]?.id;
      if (!taId) {
        const e = new Error('Tahun ajaran aktif tidak ditemukan');
        e.statusCode = 400;
        throw e;
      }
    }

    // 2. Validate status value
    if (status && !['lulus', 'tidak lulus', 'pending'].includes(status)) {
      const e = new Error('Status kelulusan tidak valid (harus "lulus", "tidak lulus", atau "pending")');
      e.statusCode = 400;
      throw e;
    }

    // 3. Save to repository
    const result = await KelulusanRepository.save({
      siswaId,
      status,
      noIjazah,
      divalidasiKepsek: divalidasiKepsek ?? true,
      divalidasiOleh,
      tanggalKelulusan: tanggalKelulusan || new Date(),
      tahunAjaranId: taId
    });

    return result;
  },

  delete: async (siswaId) => {
    const deleted = await KelulusanRepository.delete(siswaId);
    if (!deleted) {
      const e = new Error('Data kelulusan tidak ditemukan');
      e.statusCode = 404;
      throw e;
    }
    return deleted;
  }
};

module.exports = KelulusanService;
