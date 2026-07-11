require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT column_name, generation_expression FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'nilai' AND column_name = 'nilai_akhir';").then(res => console.log(res.rows)).catch(console.error).finally(()=>process.exit());
