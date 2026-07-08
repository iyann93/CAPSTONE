require('dotenv').config();
const repo = require('./src/repositories/jadwal_pelajaran.repository.js');
repo.findAll({ limit: 10, offset: 0 }).then(console.log).catch(console.error).finally(() => process.exit());
