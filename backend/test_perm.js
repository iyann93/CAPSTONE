require('dotenv').config();
const { query } = require('./src/config/db');
query("SELECT * FROM shared.permissions WHERE modul = 'jadwal_pelajaran'").then(res => console.log(res.rows)).catch(console.error).finally(() => process.exit());
