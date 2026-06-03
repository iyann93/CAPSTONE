'use strict';

/**
 * Parse pagination params from request query
 */
const paginate = (q = {}) => {
  const page = Math.max(parseInt(q.page, 10) || 1, 1);
  const limit = Math.min(parseInt(q.limit, 10) || 20, 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build ORDER BY clause with a whitelist of allowed sort fields.
 * Prefix field with '-' for DESC order. e.g., sort='-nama' → ORDER BY nama DESC
 *
 * @param {string} sort - sort string from query params
 * @param {object} allowedMap - { 'fieldAlias': 'table.column' }
 * @param {string} defaultSort - default ORDER BY expression
 */
const buildOrderBy = (sort, allowedMap, defaultSort = 'created_at DESC') => {
  if (!sort) return `ORDER BY ${defaultSort}`;
  const desc = sort.startsWith('-');
  const key = desc ? sort.slice(1) : sort;
  if (!allowedMap[key]) return `ORDER BY ${defaultSort}`;
  return `ORDER BY ${allowedMap[key]} ${desc ? 'DESC' : 'ASC'}`;
};

/**
 * Build a WHERE clause and params array from a conditions object.
 * Each condition added via addCondition() increments the param index.
 *
 * @param {number} startIdx - starting $N index (default 1)
 * @returns {{ addLike, addExact, addBool, build }}
 */
const whereBuilder = (startIdx = 1) => {
  const conditions = [];
  const values = [];
  let idx = startIdx;

  return {
    /**
     * Add an ILIKE condition across multiple columns (OR'd together)
     * e.g. addLike('search term', ['t.nama', 't.kode'])
     */
    addLike(value, columns) {
      if (!value) return;
      const clause = columns.map((col) => `${col} ILIKE $${idx}`).join(' OR ');
      conditions.push(`(${clause})`);
      values.push(`%${value}%`);
      idx++; // same param for all cols in this group
    },

    /**
     * Add an exact equality condition
     */
    addExact(value, column) {
      if (value === undefined || value === null || value === '') return;
      conditions.push(`${column} = $${idx}`);
      values.push(value);
      idx++;
    },

    /**
     * Add a boolean filter (only when explicitly provided)
     */
    addBool(value, column) {
      if (value === undefined || value === null || value === '') return;
      const bool = value === 'true' || value === true;
      conditions.push(`${column} = $${idx}`);
      values.push(bool);
      idx++;
    },

    build() {
      return {
        where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
        values,
        nextIdx: idx,
      };
    },
  };
};

module.exports = { paginate, buildOrderBy, whereBuilder };
