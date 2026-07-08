'use strict';

const KenaikanKelasRepository = require('../repositories/kenaikan_kelas.repository');

const KenaikanKelasService = {
  getByTahunAjaran: async (tahunAjaranId) => {
    if (!tahunAjaranId) { const e = new Error('tahun_ajaran_id wajib diisi'); e.statusCode = 400; throw e; }
    return KenaikanKelasRepository.findByTahunAjaran(tahunAjaranId);
  },

  bulkUpsert: async (body) => {
    const { data, tahunAjaranId } = body;
    if (!tahunAjaranId || !data || !Array.isArray(data)) {
      const e = new Error('data (array) dan tahunAjaranId wajib diisi'); e.statusCode = 400; throw e;
    }
    return KenaikanKelasRepository.bulkUpsert(data, tahunAjaranId);
  }
};

module.exports = KenaikanKelasService;
