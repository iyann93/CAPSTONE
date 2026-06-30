const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboards', 'BendaharaDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The new function (using \r\n to match existing style)
const OLD_BLOCK_START = "        let savedData;\r\n        if (selectedBeasiswa && selectedBeasiswa.id) {\r\n          savedData = await updateBeasiswa(selectedBeasiswa.id, payload);\r\n        } else {\r\n          savedData = await createBeasiswa(payload);\r\n        }\r\n\r\n        const siswaData = siswaList.find(s => String(s.id) === String(beasiswaForm.siswaId));\r\n        const realId = savedData?.id || selectedBeasiswa?.id || Date.now();\r\n        const newPenerima = {\r\n          id: realId,\r\n          siswa_id: beasiswaForm.siswaId,\r\n          siswa_nama: siswaData?.nama_lengkap || \"Siswa\",\r\n          nis: siswaData?.nis || \"-\",\r\n          nama_kelas: siswaData?.nama_kelas || siswaData?.kelas || \"-\",\r\n          nama_beasiswa: beasiswaForm.namaBeasiswa,\r\n          nominal: nominalClean,\r\n          periode: beasiswaForm.periode,\r\n          status: beasiswaForm.status,\r\n          tanggal_mulai: beasiswaForm.tanggalMulai,\r\n          tanggal_selesai: beasiswaForm.tanggalSelesai || null,\r\n        };\r\n\r\n        setProgramList(prev => prev.map(prog => {\r\n          if (prog.title === beasiswaForm.namaBeasiswa) {\r\n            let updatedPenerima;\r\n            if (selectedBeasiswa && selectedBeasiswa.id) {\r\n              updatedPenerima = (prog.penerima || []).map(p =>\r\n                p.id === selectedBeasiswa.id ? newPenerima : p\r\n              );\r\n            } else {\r\n              updatedPenerima = [...(prog.penerima || []), newPenerima];\r\n            }\r\n            return { ...prog, penerima: updatedPenerima };\r\n          }\r\n          if (selectedBeasiswa && prog.penerima?.some(p => p.id === selectedBeasiswa.id)) {\r\n            return { ...prog, penerima: prog.penerima.filter(p => p.id !== selectedBeasiswa.id) };\r\n          }\r\n          return prog;\r\n        }));\r\n\r\n        setIsSavingBeasiswa(false);\r\n        triggerToast(selectedBeasiswa ? \"Penerima beasiswa berhasil diperbarui!\" : \"Penerima beasiswa berhasil ditambahkan!\");\r\n        loadBeasiswa();\r\n        setShowAddPenerimaModal(false);\r\n        setIsBeasiswaFormDirty(false);\r\n        setSelectedBeasiswa(null);";

const NEW_BLOCK = "        if (selectedBeasiswa && selectedBeasiswa.id) {\r\n          await updateBeasiswa(selectedBeasiswa.id, payload);\r\n        } else {\r\n          await createBeasiswa(payload);\r\n        }\r\n\r\n        await loadBeasiswa();\r\n\r\n        setIsSavingBeasiswa(false);\r\n        const countMsg = payload.siswaIds.length > 1 ? `${payload.siswaIds.length} penerima` : 'Penerima';\r\n        triggerToast(selectedBeasiswa ? \"Penerima beasiswa berhasil diperbarui!\" : `${countMsg} beasiswa berhasil ditambahkan!`);\r\n        setShowAddPenerimaModal(false);\r\n        setIsBeasiswaFormDirty(false);\r\n        setSelectedBeasiswa(null);\r\n        setSiswaSearchQuery(\"\");\r\n        setBeasiswaForm({\r\n          siswaIds: [],\r\n          namaBeasiswa: \"\",\r\n          nominal: \"\",\r\n          periode: \"2025/2026\",\r\n          status: \"Aktif\",\r\n          tanggalMulai: new Date().toISOString().split('T')[0],\r\n          tanggalSelesai: \"\"\r\n        });";

if (content.includes(OLD_BLOCK_START)) {
  content = content.replace(OLD_BLOCK_START, NEW_BLOCK);
  fs.writeFileSync(filePath, content);
  console.log("SUCCESS: handleSaveBeasiswa updated to support multiple students.");
} else {
  console.log("ERROR: Could not find the target block.");
  // Let's find what exists around line 807
  const lines = content.split('\n');
  for (let i = 806; i < 820; i++) {
    console.log(`Line ${i+1}: ${JSON.stringify(lines[i])}`);
  }
}
