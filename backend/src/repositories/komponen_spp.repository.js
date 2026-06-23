'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const KomponenSppRepository = {
  findAll: async () => {
    const sql = `
      SELECT ks.*, k.nama_kelas
      FROM finance.komponen_spp ks
      LEFT JOIN academic.kelas k ON ks.kelas_id = k.id
      ORDER BY ks.angkatan DESC, ks.nama ASC
    `;
    const res = await query(sql);
    return res.rows;
  },

  findById: async (id) => {
    const sql = `SELECT * FROM finance.komponen_spp WHERE id = $1`;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  },

  create: async (data) => {
    const { nama, nominal, angkatan, kelasId, tahunAjaranId, isAktif, denda, defaultJatuhTempo, catatan } = data;
    const sql = `
      INSERT INTO finance.komponen_spp 
        (nama, nominal, angkatan, kelas_id, tahun_ajaran_id, is_aktif, denda, default_jatuh_tempo, catatan)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const res = await query(sql, [
      nama, nominal, angkatan || null, kelasId || null, tahunAjaranId || null,
      isAktif !== false, denda || 0, defaultJatuhTempo || 10, catatan || null
    ]);
    return res.rows[0];
  },

  update: async (id, data) => {
    // Partial update by falling back to existing data if undefined
    const existing = await query(`SELECT * FROM finance.komponen_spp WHERE id = $1`, [id]);
    if (!existing.rows.length) return null;
    const old = existing.rows[0];

    const nama = data.nama !== undefined ? data.nama : old.nama;
    const nominal = data.nominal !== undefined ? data.nominal : old.nominal;
    const angkatan = data.angkatan !== undefined ? data.angkatan : old.angkatan;
    const kelasId = data.kelasId !== undefined ? data.kelasId : old.kelas_id;
    const tahunAjaranId = data.tahunAjaranId !== undefined ? data.tahunAjaranId : old.tahun_ajaran_id;
    const isAktif = data.isAktif !== undefined ? data.isAktif : old.is_aktif;
    const denda = data.denda !== undefined ? data.denda : old.denda;
    const defaultJatuhTempo = data.defaultJatuhTempo !== undefined ? data.defaultJatuhTempo : old.default_jatuh_tempo;
    const catatan = data.catatan !== undefined ? data.catatan : old.catatan;

    const sql = `
      UPDATE finance.komponen_spp
      SET nama = $1, nominal = $2, angkatan = $3, kelas_id = $4, tahun_ajaran_id = $5,
          is_aktif = $6, denda = $7, default_jatuh_tempo = $8, catatan = $9
      WHERE id = $10
      RETURNING *
    `;
    const res = await query(sql, [
      nama, nominal, angkatan || null, kelasId || null, tahunAjaranId || null,
      isAktif !== false, denda || 0, defaultJatuhTempo || 10, catatan || null, id
    ]);
    return res.rows[0] || null;
  },

  delete: async (id) => {
    const res = await query(`DELETE FROM finance.komponen_spp WHERE id = $1 RETURNING id`, [id]);
    return res.rows[0] || null;
  },

  /**
   * Generate tagihan SPP massal untuk semua siswa aktif berdasarkan komponen yang aktif
   * @param {number} bulan
   * @param {number} tahun
   * @param {string} userId  - user who triggers generation
   * @param {string|null} kelasId - optional filter by class
   */
  generateBulanan: async (bulan, tahun, userId, kelasId = null) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');

      // Get all active komponen_spp
      let kompQuery = `SELECT * FROM finance.komponen_spp WHERE is_aktif = true`;
      const kompParams = [];
      if (kelasId) {
        kompQuery += ` AND (kelas_id = $1 OR kelas_id IS NULL)`;
        kompParams.push(kelasId);
      }
      const kompRes = await client.query(kompQuery, kompParams);
      const komponenList = kompRes.rows;

      if (komponenList.length === 0) {
        throw Object.assign(new Error('Tidak ada komponen SPP aktif'), { statusCode: 422 });
      }

      // Get all active students
      let siswaQuery = `SELECT id, kelas_id FROM academic.siswa WHERE status = 'aktif' AND deleted_at IS NULL`;
      const siswaParams = [];
      if (kelasId) {
        siswaQuery += ` AND kelas_id = $1`;
        siswaParams.push(kelasId);
      }
      const siswaRes = await client.query(siswaQuery, siswaParams);
      const siswaList = siswaRes.rows;

      if (siswaList.length === 0) {
        throw Object.assign(new Error('Tidak ada siswa aktif yang ditemukan'), { statusCode: 422 });
      }

      let generated = 0;
      let skipped = 0;
      let updated = 0;

      // 1. Pre-fetch existing tagihan for this period to avoid N+1 queries
      const existingRes = await client.query(
        `SELECT id, siswa_id, komponen_spp_id, nominal, status FROM finance.tagihan_spp WHERE bulan = $1 AND tahun = $2`,
        [bulan, tahun]
      );
      // Map key -> existing row
      const existingMap = new Map(existingRes.rows.map(r => [`${r.siswa_id}-${r.komponen_spp_id}`, r]));

      // 2. Prepare bulk insert and update data
      const insertValues = [];
      const queryParams = [];
      const updateCases = []; // rows to update nominal

      for (const siswa of siswaList) {
        const applicableKomponen = komponenList.filter(k =>
          k.kelas_id === null || k.kelas_id === siswa.kelas_id
        );

        for (const komp of applicableKomponen) {
          const key = `${siswa.id}-${komp.id}`;
          const existing = existingMap.get(key);

          if (existing) {
            // If nominal changed and tagihan not yet paid → update
            if (existing.status === 'belum_bayar' && parseFloat(existing.nominal) !== parseFloat(komp.nominal)) {
              updateCases.push({ id: existing.id, nominal: komp.nominal });
              updated++;
            } else {
              skipped++;
            }
            continue;
          }

          const jatuhTempo = new Date(tahun, bulan - 1, komp.default_jatuh_tempo || 10);
          insertValues.push(`($$, $$, $$, $$, $$, 0, 'belum_bayar', $$, NOW(), NOW(), $$)`);
          queryParams.push(siswa.id, komp.id, bulan, tahun, komp.nominal, jatuhTempo, userId);
          generated++;
        }
      }

      // 3. Execute bulk insert in chunks
      if (insertValues.length > 0) {
        const CHUNK_SIZE = 500;
        for (let i = 0; i < insertValues.length; i += CHUNK_SIZE) {
          const chunkValues = insertValues.slice(i, i + CHUNK_SIZE);
          const chunkParams = queryParams.slice(i * 7, (i + CHUNK_SIZE) * 7);
          let paramIdx = 1;
          const formattedChunk = chunkValues.map(valStr =>
            valStr.replace(/\$\$/g, () => `$${paramIdx++}`)
          );
          await client.query(`
            INSERT INTO finance.tagihan_spp 
              (siswa_id, komponen_spp_id, bulan, tahun, nominal, potongan, status, jatuh_tempo, created_at, updated_at, updated_by)
            VALUES ${formattedChunk.join(', ')}
          `, chunkParams);
        }
      }

      // 4. Update nominal for changed belum_bayar tagihan
      for (const upd of updateCases) {
        await client.query(
          `UPDATE finance.tagihan_spp SET nominal = $1, updated_at = NOW(), updated_by = $2 WHERE id = $3`,
          [upd.nominal, userId, upd.id]
        );
      }

      await client.query('COMMIT');
      return { generated, skipped, updated, total_siswa: siswaList.length };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Hapus tagihan SPP massal untuk bulan dan tahun tertentu (hanya yang belum_bayar)
   * @param {number} bulan
   * @param {number} tahun
   */
  deleteBulanan: async (bulan, tahun) => {
    const sql = `
      DELETE FROM finance.tagihan_spp
      WHERE bulan = $1 AND tahun = $2 AND status = 'belum_bayar'
      RETURNING id
    `;
    const res = await require('../config/db').query(sql, [bulan, tahun]);
    return res.rows.length;
  }
};

module.exports = KomponenSppRepository;
