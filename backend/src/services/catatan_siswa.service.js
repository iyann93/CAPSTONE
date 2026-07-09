'use strict';

const CatatanSiswaRepository = require('../repositories/catatan_siswa.repository');
const { paginate } = require('../utils/queryBuilder');

const CatatanSiswaService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { siswa_id: siswaId, guru_id: guruId } = query;
    const { rows, total } = await CatatanSiswaRepository.findAll({ limit, offset, siswaId, guruId });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  upsert: async (body, guruId) => {
    const { siswa_id, isi_catatan } = body;
    if (!siswa_id || isi_catatan === undefined) {
      const e = new Error('siswa_id dan isi_catatan wajib diisi');
      e.statusCode = 400;
      throw e;
    }
    return CatatanSiswaRepository.upsertByGuruSiswa(siswa_id, guruId, isi_catatan);
  }
};

module.exports = CatatanSiswaService;
