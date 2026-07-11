const fs = require('fs');
const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.ddquzxpbczeagfezjkzq:2300016025fernanda@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });
client.connect().then(async () => {
    try {
        const res = await client.query(`
            SELECT tc.table_schema, tc.table_name, kcu.column_name 
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name 
            JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name 
            WHERE constraint_type = 'FOREIGN KEY' AND ccu.table_name='jadwal_pelajaran'
        `);
        fs.writeFileSync('scratch_refs.json', JSON.stringify(res.rows, null, 2));
    } catch(err) {
        fs.writeFileSync('scratch_refs.json', JSON.stringify({error: err.message}));
    }
    client.end();
});
