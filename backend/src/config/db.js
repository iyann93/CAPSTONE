'use strict';

const { Pool } = require('pg');
const env = require('./env');

const poolConfig = env.db.connectionString 
  ? {
      connectionString: env.db.connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: env.db.user,
      host: env.db.host,
      database: env.db.database,
      password: String(env.db.password), // Force to string
      port: env.db.port,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: false,
    };

const pool = new Pool(poolConfig);

pool.on('connect', (client) => {
  // connection established
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
