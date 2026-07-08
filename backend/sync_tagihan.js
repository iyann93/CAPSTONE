require('dotenv').config();
const { query } = require('./src/config/db');
const { syncBeasiswaToTagihan } = require('./src/repositories/spp.repository');

async function syncTagihan() {
    try {
        console.log("Starting sync...");
        const tagihanRes = await query("SELECT t.id, t.siswa_id, t.nominal as old_nominal, s.kelas_id, s.nama_lengkap FROM finance.tagihan_spp t JOIN academic.siswa s ON t.siswa_id = s.id WHERE t.status = 'belum_bayar'");
        const tagihans = tagihanRes.rows;
        console.log(`Found ${tagihans.length} tagihan belum bayar.`);

        const komponenRes = await query("SELECT id, kelas_id, nominal FROM finance.komponen_spp");
        const komponenMap = {};
        for(let k of komponenRes.rows) {
            komponenMap[k.kelas_id] = k;
        }

        let updated = 0;
        for (let tag of tagihans) {
            const komp = komponenMap[tag.kelas_id];
            if (komp) {
                if (Number(tag.old_nominal) !== Number(komp.nominal)) {
                    console.log(`Updating tagihan for ${tag.nama_lengkap}: ${tag.old_nominal} -> ${komp.nominal}`);
                    await query(
                        "UPDATE finance.tagihan_spp SET komponen_spp_id = $1, nominal = $2 WHERE id = $3",
                        [komp.id, komp.nominal, tag.id]
                    );
                    updated++;
                }
                // Also sync beasiswa
                await syncBeasiswaToTagihan(tag.siswa_id);
            } else {
                console.log(`No komponen_spp found for kelas_id ${tag.kelas_id} for student ${tag.nama_lengkap}`);
            }
        }
        console.log(`Sync complete. Updated ${updated} tagihan.`);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

syncTagihan();
