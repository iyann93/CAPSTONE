'use strict';

const SppRepository = require('../repositories/spp.repository');
const PembayaranRepository = require('../repositories/pembayaran.repository');
const { paginate } = require('../utils/queryBuilder');

const FinanceService = {
  // === SPP TAGIHAN ===
  getAllTagihan: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, siswa_id: siswaId, bulan, tahun, status } = query;
    const { rows, total } = await SppRepository.findAllTagihan({ limit, offset, search, sort, siswaId, bulan, tahun, status });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },
  
  createTagihan: async (body, userId) => {
    // Could accept array for bulk create, but let's stick to standard single first
    return SppRepository.createTagihan(body, userId);
  },

  // === PEMBAYARAN ===
  getAllPembayaran: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, tagihan_id: tagihanId, siswa_id: siswaId, metode, tanggal_awal: tanggalAwal, tanggal_akhir: tanggalAkhir } = query;
    const { rows, total } = await PembayaranRepository.findAll({ limit, offset, search, sort, tagihanId, siswaId, metode, tanggalAwal, tanggalAkhir });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getPembayaranById: async (id) => {
    const data = await PembayaranRepository.findById(id);
    if (!data) { const e = new Error('Data pembayaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  processPembayaran: async (body, userId) => {
    return PembayaranRepository.processPembayaran(body, userId);
  },

  getLaporanBulanan: async (query) => {
    const { bulan, tahun } = query;
    if (!bulan || !tahun) { const e = new Error('Parameter bulan dan tahun wajib diisi'); e.statusCode = 400; throw e; }
    return PembayaranRepository.getLaporanBulanan(bulan, tahun);
  }
};

module.exports = FinanceService;
