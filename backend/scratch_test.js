const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.ddquzxpbczeagfezjkzq:2300016025fernanda@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });
client.connect().then(async () => {
    try {
        const idRes = await client.query('SELECT id FROM academic.jadwal_pelajaran LIMIT 1');
        if (idRes.rows.length === 0) return console.log('NO DATA');
        const id = idRes.rows[0].id;
        console.log('Attempting delete on:', id);
        await client.query('DELETE FROM academic.jadwal_pelajaran WHERE id = $1', [id]);
        console.log('SUCCESSFUL DELETE');
    } catch(err) {
        console.log('DEL ERR CONFLICT:', err.message);
    } finally {
        client.end();
    }
});
