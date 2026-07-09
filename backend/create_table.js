require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

const createTableSql = `
  CREATE TABLE IF NOT EXISTS finance.dana_beasiswa (
    id SERIAL PRIMARY KEY,
    sumber VARCHAR(255) NOT NULL,
    nominal NUMERIC NOT NULL,
    tanggal DATE NOT NULL,
    keterangan TEXT,
    dibuat_at TIMESTAMP DEFAULT NOW()
  );
`;

pool.query(createTableSql)
  .then(() => {
    console.log("Table finance.dana_beasiswa created successfully.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error creating table:", err);
    process.exit(1);
  });
