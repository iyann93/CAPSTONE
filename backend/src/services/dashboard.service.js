'use strict';

const DashboardRepository = require('../repositories/dashboard.repository');
const { query } = require('../config/db');

/**
 * Cari guru_id dari user_id (karena JWT menyimpan user_id shared.users)
 */
async function getGuruIdByUserId(userId) {
  const res = await query(
    `SELECT id FROM academic.guru WHERE user_id = $1`,
    [userId]
  );
  if (!res.rows[0]) {
    const err = new Error('Profil guru tidak ditemukan untuk user ini');
    err.statusCode = 404;
    throw err;
  }
  return res.rows[0].id;
}

/**
 * Cari siswa_id dari user_id
 */
async function getSiswaIdByUserId(userId) {
  const res = await query(
    `SELECT id FROM academic.siswa WHERE user_id = $1`,
    [userId]
  );
  if (!res.rows[0]) {
    const err = new Error('Profil siswa tidak ditemukan untuk user ini');
    err.statusCode = 404;
    throw err;
  }
  return res.rows[0].id;
}

const DashboardService = {

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  getAdminDashboard: async () => {
    const [stats, trenPembayaran, trenPayroll] = await Promise.all([
      DashboardRepository.getAdminStats(),
      DashboardRepository.getTrenPembayaran(),
      DashboardRepository.getTrenPayroll(),
    ]);
    return { stats, tren_pembayaran: trenPembayaran, tren_payroll: trenPayroll };
  },

  // ── GURU ──────────────────────────────────────────────────────────────────
  getGuruDashboard: async (userId) => {
    const guruId = await getGuruIdByUserId(userId);
    const [jadwal, absensi, nilaiKurang] = await Promise.all([
      DashboardRepository.getJadwalHariIniGuru(guruId),
      DashboardRepository.getAbsensiHariIniGuru(guruId),
      DashboardRepository.getNilaiBelumDiinputGuru(guruId),
    ]);
    return {
      jadwal_hari_ini:         jadwal,
      absensi_hari_ini:        absensi,
      nilai_belum_diinput:     nilaiKurang,
      total_nilai_belum_input: nilaiKurang.reduce((s, r) => s + parseInt(r.belum_dinilai, 10), 0),
    };
  },

  // ── SISWA ─────────────────────────────────────────────────────────────────
  getSiswaDashboard: async (userId) => {
    const siswaId = await getSiswaIdByUserId(userId);
    return DashboardRepository.getSiswaDashboard(siswaId);
  },

  // ── DETAIL ENDPOINTS (untuk akses langsung by ID) ─────────────────────────
  getJadwalGuru: async (guruId) => DashboardRepository.getJadwalHariIniGuru(guruId),
  getJadwalSiswa: async (siswaId) => DashboardRepository.getJadwalSiswa(siswaId),
  getNilaiSiswa: async (siswaId) => DashboardRepository.getNilaiSiswa(siswaId),
  getAbsensiSiswa: async (siswaId) => DashboardRepository.getAbsensiSiswa(siswaId),
  getTagihanSiswa: async (siswaId) => DashboardRepository.getTagihanSppSiswa(siswaId),

  // ── KEPSEK ────────────────────────────────────────────────────────────────
  getKepsekStats: async () => DashboardRepository.getKepsekStats(),
};

module.exports = DashboardService;
