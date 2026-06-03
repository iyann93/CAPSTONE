'use strict';

const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  user: env.db.user,
  host: env.db.host,
  database: env.db.database,
  password: env.db.password,
  port: env.db.port,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', (client) => {
  // Set search_path per connection — run as a standalone statement
  client.query("SET search_path TO shared, academic, finance, public", (err) => {
    if (err) console.error('[DB] Failed to set search_path:', err.message);
  });
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

/**
 * Run a single parameterized query
 */
const query = (text, params) => pool.query(text, params);

/**
 * Get a client for transaction usage
 * Usage: const client = await getClient(); try { await client.query('BEGIN'); ... } finally { client.release(); }
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
