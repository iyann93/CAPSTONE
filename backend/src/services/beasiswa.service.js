'use strict';

const BeasiswaRepository = require('../repositories/beasiswa.repository');
const { paginate } = require('../utils/queryBuilder');

const BeasiswaService = {
  getAll: async (queryOpts) => {
    const { page, limit, offset } = paginate(queryOpts);
    const { rows, total } = await BeasiswaRepository.findAll({
      limit,
      offset,
      search: queryOpts.search,
      sort: queryOpts.sort,
      siswaId: queryOpts.siswa_id,
      status: queryOpts.status
    });

    return {
      data: rows,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  },

  getById: async (id) => {
    const data = await BeasiswaRepository.findById(id);
    if (!data) {
      const err = new Error('Beasiswa tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return data;
  },

  create: async (data) => {
    const siswaIds = data.siswaIds || (data.siswaId ? [data.siswaId] : []);
    
    if (siswaIds.length === 0) {
      throw new Error('Siswa tidak boleh kosong');
    }

    const results = [];
    for (const sId of siswaIds) {
      const result = await BeasiswaRepository.create({
        ...data,
        siswaId: sId,
        nominal: parseFloat(data.nominal),
        status: data.status ? data.status.toLowerCase() : 'aktif',
      });
      
      // Sinkronisasi tagihan belum_bayar dengan beasiswa yang baru
      await require('../repositories/spp.repository').syncBeasiswaToTagihan(result.siswa_id);
      results.push(result);
    }
    
    return results.length === 1 ? results[0] : results;
  },

  update: async (id, data) => {
    // Check exist
    await BeasiswaService.getById(id);

    // Normalize siswaIds -> siswaId (update only changes one record)
    const siswaId = data.siswaId || (data.siswaIds && data.siswaIds[0]) || undefined;
    
    const result = await BeasiswaRepository.update(id, {
      ...data,
      siswaId,
      nominal: data.nominal ? parseFloat(data.nominal) : undefined,
      status: data.status ? data.status.toLowerCase() : undefined,
    });
    
    // Sinkronisasi ulang tagihan jika ada perubahan
    await require('../repositories/spp.repository').syncBeasiswaToTagihan(result.siswa_id);
    return result;
  },

  delete: async (id) => {
    const old = await BeasiswaService.getById(id);
    const result = await BeasiswaRepository.delete(id);
    
    // Hapus potongan beasiswa dari tagihan belum_bayar untuk siswa ini
    await require('../repositories/spp.repository').syncBeasiswaToTagihan(old.siswa_id);
    return result;
  }
};

module.exports = BeasiswaService;
