require('dotenv').config();
const { query } = require('./src/config/db');
query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'semester'").then(res => {
  console.log(res.rows);
  process.exit(0);
});
