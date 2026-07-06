'use strict';

const { query } = require('../config/db');

// ─── Mapping: JS getDay() (0=Minggu…6=Sabtu) → nama hari Indonesia ─────────
const HARI_MAP = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const DashboardRepository = {

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Semua statistik utama admin dalam satu batch query paralel (optimal)
   */
  getAdminStats: async () => {
    const now   = new Date();
    const bulan = now.getMonth() + 1;
    const tahun = now.getFullYear();

    const [
      siswaRes,
      guruRes,
      karyawanRes,
      kelasRes,
      pembayaranRes,
      payrollRes,
      tagSppRes,
    ] = await Promise.all([
      // Total siswa aktif
      query(`SELECT COUNT(*) AS total FROM academic.siswa WHERE status = 'aktif' AND deleted_at IS NULL`),

      // Total guru aktif
      query(`SELECT COUNT(*) AS total FROM academic.guru WHERE status_kepegawaian = 'aktif' AND deleted_at IS NULL`),

      // Total karyawan aktif (dari shared.users yang punya role karyawan)
      query(`
        SELECT COUNT(DISTINCT u.id) AS total
        FROM shared.users u
        INNER JOIN shared.user_roles ur ON ur.user_id = u.id
        INNER JOIN shared.roles r ON r.id = ur.role_id
        WHERE r.nama ILIKE '%karyawan%'
          AND u.is_active = true
      `),

      // Total kelas aktif (di tahun ajaran aktif)
      query(`
        SELECT COUNT(*) AS total
        FROM academic.kelas k
        INNER JOIN academic.tahun_ajaran ta ON ta.id = k.tahun_ajaran_id
        WHERE ta.is_active = true
      `),

      // Total pembayaran SPP bulan ini (dari transaksi_pembayaran)
      query(`
        SELECT
          COUNT(tp.id)              AS jumlah_transaksi,
          COALESCE(SUM(tp.jumlah_bayar), 0) AS total_nominal
        FROM finance.transaksi_pembayaran tp
        WHERE DATE_TRUNC('month', tp.tanggal_bayar) = DATE_TRUNC('month', CURRENT_DATE)
      `),

      // Total payroll (slip gaji) bulan ini
      query(`
        SELECT
          COUNT(id)                       AS jumlah_slip,
          COALESCE(SUM(gaji_bersih), 0)   AS total_gaji_bersih
        FROM finance.slip_gaji
        WHERE bulan = $1 AND tahun = $2
      `, [bulan, tahun]),

      // Rekap tagihan SPP bulan ini (Lunas vs Belum Lunas)
      query(`
        SELECT
          status,
          COUNT(*) AS jumlah,
          COALESCE(SUM(nominal_akhir), 0) AS total_nominal
        FROM finance.tagihan_spp
        WHERE bulan = $1 AND tahun = $2
        GROUP BY status
      `, [bulan, tahun]),
    ]);

    // Susun rekap tagihan SPP jadi objek
    const sppByStatus = {};
    for (const row of tagSppRes.rows) {
      sppByStatus[row.status] = {
        jumlah:        parseInt(row.jumlah, 10),
        total_nominal: parseFloat(row.total_nominal),
      };
    }

    return {
      periode: { bulan, tahun },
      siswa: {
        total_aktif: parseInt(siswaRes.rows[0].total, 10),
      },
      guru: {
        total_aktif: parseInt(guruRes.rows[0].total, 10),
      },
      karyawan: {
        total_aktif: parseInt(karyawanRes.rows[0].total, 10),
      },
      kelas: {
        total_aktif: parseInt(kelasRes.rows[0].total, 10),
      },
      pembayaran_spp: {
        bulan_ini: {
          jumlah_transaksi: parseInt(pembayaranRes.rows[0].jumlah_transaksi, 10),
          total_nominal:    parseFloat(pembayaranRes.rows[0].total_nominal),
        },
        rekap_tagihan: sppByStatus,
      },
      payroll: {
        bulan_ini: {
          jumlah_slip:      parseInt(payrollRes.rows[0].jumlah_slip, 10),
          total_gaji_bersih: parseFloat(payrollRes.rows[0].total_gaji_bersih),
        },
      },
    };
  },

  /**
   * Grafik tren pembayaran SPP 6 bulan terakhir
   */
  getTrenPembayaran: async () => {
    const sql = `
      SELECT
        EXTRACT(YEAR  FROM tp.tanggal_bayar)::int AS tahun,
        EXTRACT(MONTH FROM tp.tanggal_bayar)::int AS bulan,
        COUNT(tp.id)                              AS jumlah_transaksi,
        COALESCE(SUM(tp.jumlah_bayar), 0)         AS total_nominal
      FROM finance.transaksi_pembayaran tp
      WHERE tp.tanggal_bayar >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
      GROUP BY 1, 2
      ORDER BY 1 ASC, 2 ASC
    `;
    const res = await query(sql);
    return res.rows.map(r => ({
      ...r,
      total_nominal: parseFloat(r.total_nominal),
    }));
  },

  /**
   * Grafik tren payroll 6 bulan terakhir
   */
  getTrenPayroll: async () => {
    const sql = `
      SELECT
        tahun::int                           AS tahun,
        bulan::int                           AS bulan,
        COUNT(id)                            AS jumlah_slip,
        COALESCE(SUM(gaji_bersih), 0)        AS total_gaji_bersih
      FROM finance.slip_gaji
      WHERE (tahun * 100 + bulan) >= (
        (EXTRACT(YEAR FROM CURRENT_DATE)::int) * 100
        + EXTRACT(MONTH FROM CURRENT_DATE)::int
        - 5
      )
      GROUP BY tahun, bulan
      ORDER BY tahun ASC, bulan ASC
    `;
    const res = await query(sql);
    return res.rows.map(r => ({
      ...r,
      total_gaji_bersih: parseFloat(r.total_gaji_bersih),
    }));
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GURU DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Jadwal hari ini untuk guru tertentu
   * @param {string} guruId - UUID guru
   */
  getJadwalHariIniGuru: async (guruId) => {
    const hariIni = HARI_MAP[new Date().getDay()];
    const sql = `
      SELECT
        jp.id, jp.hari, jp.jam_mulai, jp.jam_selesai,
        jp.kelas_id, k.nama_kelas, k.tingkat,
        jp.mata_pelajaran_id, m.nama AS nama_mapel, m.kode_mapel,
        jp.semester_id, sm.nama AS semester_nama,
        -- Hitung sudah berapa siswa diabsen hari ini
        (
          SELECT COUNT(*)
          FROM academic.absensi ab
          WHERE ab.jadwal_id = jp.id
            AND ab.tanggal   = CURRENT_DATE
        ) AS sudah_diabsen,
        -- Total siswa di kelas
        (
          SELECT COUNT(*)
          FROM academic.siswa s2
          WHERE s2.kelas_id = jp.kelas_id
            AND s2.status = 'aktif'
            AND s2.deleted_at IS NULL
        ) AS total_siswa_kelas
      FROM academic.jadwal_pelajaran jp
      INNER JOIN academic.kelas   k  ON jp.kelas_id  = k.id
      INNER JOIN academic.mata_pelajaran   m  ON jp.mata_pelajaran_id  = m.id
      INNER JOIN academic.semester sm ON jp.semester_id = sm.id
      WHERE jp.guru_id = $1
        AND jp.hari    = $2
      ORDER BY jp.jam_mulai ASC
    `;
    const res = await query(sql, [guruId, hariIni]);
    return res.rows;
  },

  /**
   * Rekap absensi yang sudah diisi guru hari ini (per jadwal)
   * @param {string} guruId
   */
  getAbsensiHariIniGuru: async (guruId) => {
    const hariIni = HARI_MAP[new Date().getDay()];
    const sql = `
      SELECT
        jp.id AS jadwal_id, jp.jam_mulai, jp.jam_selesai,
        k.nama_kelas, m.nama AS nama_mapel,
        COUNT(ab.id)                                              AS total_diabsen,
        SUM(CASE WHEN ab.status = 'Hadir' THEN 1 ELSE 0 END)     AS hadir,
        SUM(CASE WHEN ab.status = 'Sakit' THEN 1 ELSE 0 END)     AS sakit,
        SUM(CASE WHEN ab.status = 'Izin'  THEN 1 ELSE 0 END)     AS izin,
        SUM(CASE WHEN ab.status = 'Alpha' THEN 1 ELSE 0 END)     AS alpha
      FROM academic.jadwal_pelajaran jp
      INNER JOIN academic.kelas k ON jp.kelas_id = k.id
      INNER JOIN academic.mata_pelajaran m ON jp.mata_pelajaran_id = m.id
      LEFT JOIN academic.absensi ab
        ON ab.jadwal_id = jp.id AND ab.tanggal = CURRENT_DATE
      WHERE jp.guru_id = $1
        AND jp.hari    = $2
      GROUP BY.nama
      ORDER BY jp.jam_mulai ASC
    `;
    const res = await query(sql, [guruId, hariIni]);
    return res.rows;
  },

  /**
   * Daftar jadwal guru yang nilainya BELUM diinput untuk semester aktif
   * @param {string} guruId
   */
  getNilaiBelumDiinputGuru: async (guruId) => {
    const sql = `
      SELECT
        jp.id AS jadwal_id,
        jp.kelas_id, k.nama_kelas,
        jp.mata_pelajaran_id, m.nama AS nama_mapel,
        jp.semester_id, sm.nama AS semester_nama,
        COUNT(DISTINCT s.id)  AS total_siswa,
        COUNT(DISTINCT n.siswa_id) AS sudah_dinilai,
        COUNT(DISTINCT s.id) - COUNT(DISTINCT n.siswa_id) AS belum_dinilai
      FROM academic.jadwal_pelajaran jp
      INNER JOIN academic.kelas   k  ON jp.kelas_id   = k.id
      INNER JOIN academic.mata_pelajaran   m  ON jp.mata_pelajaran_id   = m.id
      INNER JOIN academic.semester sm ON jp.semester_id = sm.id
      INNER JOIN academic.siswa   s  ON s.kelas_id = jp.kelas_id AND s.status = 'aktif' AND s.deleted_at IS NULL
      LEFT JOIN academic.nilai    n
        ON n.siswa_id        = s.id
       AND n.mata_pelajaran_id = jp.mata_pelajaran_id
       AND n.semester_id     = jp.semester_id
       AND n.guru_id         = $1
      WHERE jp.guru_id = $1
        AND sm.is_active = true
      GROUP BY.nama,
               jp.semester_id, sm.nama
      HAVING COUNT(DISTINCT s.id) - COUNT(DISTINCT n.siswa_id) > 0
      ORDER BY.nama ASC
    `;
    const res = await query(sql, [guruId]);
    return res.rows;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SISWA DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Profil dasar + jadwal semester aktif untuk siswa
   * @param {string} siswaId
   */
  getJadwalSiswa: async (siswaId) => {
    const sql = `
      SELECT
        jp.id, jp.hari, jp.jam_mulai, jp.jam_selesai,
        m.nama AS nama_mapel, m.kode_mapel,
        g.nama_lengkap AS guru_nama,
        k.nama_kelas, sm.nama AS semester_nama
      FROM academic.jadwal_pelajaran jp
      INNER JOIN academic.kelas   k  ON jp.kelas_id   = k.id
      INNER JOIN academic.mata_pelajaran   m  ON jp.mata_pelajaran_id   = m.id
      INNER JOIN academic.guru    g  ON jp.guru_id    = g.id
      INNER JOIN academic.semester sm ON jp.semester_id = sm.id
      INNER JOIN academic.siswa   s  ON s.kelas_id = jp.kelas_id
      WHERE s.id        = $1
        AND sm.is_active = true
      ORDER BY
        CASE jp.hari
          WHEN 'Senin'   THEN 1
          WHEN 'Selasa'  THEN 2
          WHEN 'Rabu'    THEN 3
          WHEN 'Kamis'   THEN 4
          WHEN 'Jumat'   THEN 5
          WHEN 'Sabtu'   THEN 6
          ELSE 7
        END,
        jp.jam_mulai ASC
    `;
    const res = await query(sql, [siswaId]);
    return res.rows;
  },

  /**
   * Nilai siswa per semester aktif
   * @param {string} siswaId
   */
  getNilaiSiswa: async (siswaId) => {
    const sql = `
      SELECT
        n.id, n.nilai_harian, n.nilai_uts, n.nilai_uas, n.nilai_akhir,
        n.bobot_harian, n.bobot_uts, n.bobot_uas, n.catatan, n.created_at,
        m.nama AS nama_mapel, m.kode_mapel,
        g.nama  AS guru_nama,
        sm.nama AS semester_nama
      FROM academic.nilai n
      INNER JOIN academic.mata_pelajaran   m  ON n.mata_pelajaran_id = m.id
      INNER JOIN academic.guru    g  ON n.guru_id           = g.id
      INNER JOIN academic.semester sm ON n.semester_id      = sm.id
      WHERE n.siswa_id   = $1
        AND sm.is_active = true
      ORDER BY.nama ASC
    `;
    const res = await query(sql, [siswaId]);
    return res.rows;
  },

  /**
   * Rekap absensi siswa bulan & semester aktif
   * @param {string} siswaId
   */
  getAbsensiSiswa: async (siswaId) => {
    const [bulanRes, semesterRes] = await Promise.all([
      // Rekap bulan ini
      query(`
        SELECT
          SUM(CASE WHEN ab.status = 'Hadir' THEN 1 ELSE 0 END) AS hadir,
          SUM(CASE WHEN ab.status = 'Sakit' THEN 1 ELSE 0 END) AS sakit,
          SUM(CASE WHEN ab.status = 'Izin'  THEN 1 ELSE 0 END) AS izin,
          SUM(CASE WHEN ab.status = 'Alpha' THEN 1 ELSE 0 END) AS alpha,
          COUNT(ab.id) AS total
        FROM academic.absensi ab
        WHERE ab.siswa_id = $1
          AND EXTRACT(MONTH FROM ab.tanggal) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR  FROM ab.tanggal) = EXTRACT(YEAR  FROM CURRENT_DATE)
      `, [siswaId]),

      // Rekap semester aktif + 5 absensi terbaru
      query(`
        SELECT
          ab.id, ab.tanggal, ab.status, ab.keterangan,
          m.nama AS nama_mapel, k.nama_kelas
        FROM academic.absensi ab
        INNER JOIN academic.jadwal_pelajaran jp ON ab.jadwal_id = jp.id
        INNER JOIN academic.mata_pelajaran   m  ON jp.mata_pelajaran_id  = m.id
        INNER JOIN academic.semester sm ON jp.semester_id = sm.id
        INNER JOIN academic.kelas k ON jp.kelas_id = k.id
        WHERE ab.siswa_id   = $1
          AND sm.is_active  = true
        ORDER BY ab.tanggal DESC
        LIMIT 10
      `, [siswaId]),
    ]);

    return {
      rekap_bulan_ini: bulanRes.rows[0],
      riwayat_terbaru: semesterRes.rows,
    };
  },

  /**
   * Tagihan SPP siswa (aktif + riwayat)
   * @param {string} siswaId
   */
  getTagihanSppSiswa: async (siswaId) => {
    const [belumLunasRes, riwayatRes] = await Promise.all([
      // Tagihan yang belum lunas
      query(`
        SELECT
          ts.id, ts.bulan, ts.tahun, ts.nominal, ts.nominal_akhir,
          ts.potongan, ts.status, ts.jatuh_tempo, ts.created_at,
          ks.nama AS komponen_nama
        FROM finance.tagihan_spp ts
        INNER JOIN finance.komponen_spp ks ON ts.komponen_spp_id = ks.id
        WHERE ts.siswa_id = $1
          AND ts.status   != 'Lunas'
        ORDER BY ts.tahun DESC, ts.bulan DESC
      `, [siswaId]),

      // Riwayat pembayaran (5 terbaru)
      query(`
        SELECT
          tp.id, tp.jumlah_bayar, tp.metode, tp.tanggal_bayar, tp.no_referensi,
          ts.bulan, ts.tahun, ts.status AS status_tagihan
        FROM finance.transaksi_pembayaran tp
        INNER JOIN finance.tagihan_spp ts ON tp.tagihan_id = ts.id
        WHERE ts.siswa_id = $1
        ORDER BY tp.tanggal_bayar DESC
        LIMIT 5
      `, [siswaId]),
    ]);

    // Hitung total tunggakan
    const totalTunggakan = belumLunasRes.rows.reduce(
      (acc, r) => acc + parseFloat(r.nominal_akhir || r.nominal),
      0
    );

    return {
      tagihan_belum_lunas: belumLunasRes.rows,
      total_tunggakan:     totalTunggakan,
      riwayat_pembayaran:  riwayatRes.rows,
    };
  },

  /**
   * Ringkasan 1 halaman untuk siswa (semua data sekaligus)
   * @param {string} siswaId
   */
  getSiswaDashboard: async (siswaId) => {
    const [jadwal, nilai, absensi, tagihan] = await Promise.all([
      DashboardRepository.getJadwalSiswa(siswaId),
      DashboardRepository.getNilaiSiswa(siswaId),
      DashboardRepository.getAbsensiSiswa(siswaId),
      DashboardRepository.getTagihanSppSiswa(siswaId),
    ]);

    // Jadwal hari ini
    const hariIni = HARI_MAP[new Date().getDay()];
    const jadwalHariIni = jadwal.filter(j => j.hari === hariIni);

    // Rata-rata nilai akhir
    const rataRata = nilai.length
      ? (nilai.reduce((s, n) => s + parseFloat(n.nilai_akhir || 0), 0) / nilai.length).toFixed(2)
      : null;

    return {
      jadwal_hari_ini: jadwalHariIni,
      jadwal_semua:    jadwal,
      nilai: {
        list:      nilai,
        rata_rata: rataRata ? parseFloat(rataRata) : null,
      },
      absensi,
      tagihan_spp: tagihan,
    };
  },
};

module.exports = DashboardRepository;
