'use strict';

const { query } = require('../config/db');

const KasRepository = {
  getSaldo: async () => {
    const res = await query('SELECT saldo, updated_at FROM finance.kas_sekolah WHERE id = 1');
    if (res.rows.length === 0) return { saldo: 0 };
    return res.rows[0];
  },
  
  getMutasi: async ({ limit = 20, offset = 0 }) => {
    const sql = `
      SELECT * FROM finance.mutasi_kas
      ORDER BY id DESC
      LIMIT $1 OFFSET $2
    `;
    const countSql = `SELECT COUNT(*) FROM finance.mutasi_kas`;
    
    const [data, count] = await Promise.all([
      query(sql, [limit, offset]),
      query(countSql)
    ]);
    
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  }
};

module.exports = KasRepository;
