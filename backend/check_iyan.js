require('dotenv').config();
const { query } = require('./src/config/db');
async function check() {
    try {
        const res = await query("SELECT table_name FROM information_schema.tables WHERE table_schema='academic'");
        console.log(res.rows.map(r => r.table_name));
    } catch(err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
check();
