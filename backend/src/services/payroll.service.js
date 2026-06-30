'use strict';

const PayrollRepository = require('../repositories/payroll.repository');
const KomponenGajiRepository = require('../repositories/komponen_gaji.repository');
const TemplateGajiRepository = require('../repositories/template_gaji.repository');
const PengaturanGajiRepository = require('../repositories/pengaturan_gaji.repository');
const { paginate } = require('../utils/queryBuilder');

const PAGE_SIZE = 20;

const PayrollService = {
  // ── GET ALL (dengan filter, pagination) ─────────────────────────────────────
  getAll: async (queryParams) => {
    const { page, limit, offset } = paginate(queryParams, PAGE_SIZE);
    const {
      search, sort,
      user_id: userId,
      bulan, tahun, status,
    } = queryParams;

    const { rows, total, summary } = await PayrollRepository.findAllSlips({
      limit, offset, search, sort,
      userId, bulan, tahun, status,
    });

    return {
      data: rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), summary },
    };

  },

  // ── GET DETAIL BY ID ────────────────────────────────────────────────────────
  getById: async (id) => {
    const data = await PayrollRepository.findSlipById(id);
    if (!data) {
      const err = new Error('Data slip gaji tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return data;
  },

  // ── GENERATE SLIP GAJI ──────────────────────────────────────────────────────
  generate: async (body) => {
    const {
      userId, bulan, tahun, gajiPokok,
      hariHadir   = 0,
      jumlahAlpha = 0,
      jamLembur   = 0,
    } = body;

    return PayrollRepository.generateSlip({
      userId,
      bulan:       parseInt(bulan, 10),
      tahun:       parseInt(tahun, 10),
      gajiPokok:   parseFloat(gajiPokok),
      hariHadir:   parseInt(hariHadir, 10),
      jumlahAlpha: parseInt(jumlahAlpha, 10),
      jamLembur:   parseInt(jamLembur, 10),
    });
  },

  // ── APPROVE SLIP ────────────────────────────────────────────────────────────
  approve: async (body) => {
    const { slipGajiId } = body;
    return PayrollRepository.approveSlip(slipGajiId);
  },

  // ── REVERT SLIP ────────────────────────────────────────────────────────────
  revert: async (body) => {
    const { slipGajiId } = body;
    return PayrollRepository.revertSlip(slipGajiId);
  },

  // ── TRANSFER GAJI ───────────────────────────────────────────────────────────
  transfer: async (body) => {
    const { slipGajiId, noReferensi, rekeningId } = body;
    return PayrollRepository.transferGaji({ slipGajiId, noReferensi, rekeningId });
  },

  // ── RIWAYAT per User ─────────────────────────────────────────────────────────
  getRiwayat: async (userId) => {
    return PayrollRepository.findRiwayatByUser(userId);
  },

  // ── KOMPONEN GAJI (Pengaturan) ───────────────────────────────────────────────
  getAllKomponen: async () => {
    return KomponenGajiRepository.findAll();
  },

  createKomponen: async (data) => {
    return KomponenGajiRepository.create(data);
  },

  updateKomponen: async (id, data) => {
    const existing = await KomponenGajiRepository.findById(id);
    if (!existing) {
      const err = new Error('Komponen gaji tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return KomponenGajiRepository.update(id, data);
  },

  deleteKomponen: async (id) => {
    const existing = await KomponenGajiRepository.findById(id);
    if (!existing) {
      const err = new Error('Komponen gaji tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return KomponenGajiRepository.delete(id);
  },

  // ── TEMPLATE GAJI JABATAN ──────────────────────────────────────────────────
  getTemplatesByJabatan: async (jabatanId) => {
    return TemplateGajiRepository.findByJabatanId(jabatanId);
  },

  upsertTemplate: async (data) => {
    return TemplateGajiRepository.upsert(data);
  },

  // ── OVERRIDE GAJI PEGAWAI (USER) ───────────────────────────────────────────
  getOverridesByUser: async (userId) => {
    return PengaturanGajiRepository.findByUserId(userId);
  },

  upsertOverride: async (data) => {
    return PengaturanGajiRepository.upsert(data);
  },

  deleteSlip: async (id) => {
    const slip = await PayrollRepository.findSlipById(id);
    if (!slip) {
      const err = new Error('Data slip gaji tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    
    if (slip.status !== 'draft') {
      const err = new Error('Hanya slip gaji dengan status draft yang dapat dihapus');
      err.statusCode = 400;
      throw err;
    }

    return PayrollRepository.deleteSlip(id);
  },

  bulkDeleteSlips: async (ids) => {
    if (!ids || ids.length === 0) return 0;
    
    // Check if all slips are in draft status
    for (const id of ids) {
      const slip = await PayrollRepository.findSlipById(id);
      if (!slip) {
        const err = new Error(`Data slip gaji dengan ID ${id} tidak ditemukan`);
        err.statusCode = 404;
        throw err;
      }
      if (slip.status !== 'draft') {
        const err = new Error('Semua slip gaji yang dipilih harus berstatus draft');
        err.statusCode = 400;
        throw err;
      }
    }
    
    return PayrollRepository.bulkDeleteSlips(ids);
  },
};

module.exports = PayrollService;
