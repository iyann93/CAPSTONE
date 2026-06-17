const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Inject state
const stateToInject = `  const [komponenGajiList, setKomponenGajiList] = useState([]);
  const [siswaSearchQuery, setSiswaSearchQuery] = useState("");
  const [showSiswaDropdown, setShowSiswaDropdown] = useState(false);`;

if (!content.includes('const [siswaSearchQuery, setSiswaSearchQuery] = useState("");')) {
    content = content.replace('  const [komponenGajiList, setKomponenGajiList] = useState([]);', stateToInject);
}

// 2. Replace the old "Pilih Siswa" block
const oldSiswaBlock = `<div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Siswa</label>
                  <select
                    value={beasiswaForm.siswaId}
                    onChange={(e) => setBeasiswaForm({ ...beasiswaForm, siswaId: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 h-[46px]"
                  >
                    <option value="" disabled>-- Pilih Siswa --</option>
                    {siswaList.map(s => (
                      <option key={s.id} value={s.id}>{s.nama_lengkap} ({s.nis})</option>
                    ))}
                  </select>
                </div>`;

const newSiswaBlock = `<div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Siswa</label>
                  <div className="relative">
                    <div
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 h-[46px] cursor-pointer flex items-center justify-between"
                      onClick={() => setShowSiswaDropdown(!showSiswaDropdown)}
                    >
                      <span className={beasiswaForm.siswaId ? "text-gray-800" : "text-gray-400"}>
                        {beasiswaForm.siswaId ? (siswaList.find(s => String(s.id) === String(beasiswaForm.siswaId))?.nama_lengkap || "Pilih Siswa") : "-- Pilih Siswa --"}
                      </span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={\`text-gray-400 transition-transform \${showSiswaDropdown ? 'rotate-180' : ''}\`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                    {showSiswaDropdown && (
                      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] max-h-[250px] flex flex-col overflow-hidden">
                        <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                            </span>
                            <input
                              type="text"
                              placeholder="Cari nama atau NIS siswa..."
                              value={siswaSearchQuery}
                              onChange={(e) => setSiswaSearchQuery(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#1A3D63] shadow-sm"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto p-1 custom-scrollbar">
                          {siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">Siswa tidak ditemukan</div>
                          ) : (
                            siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).map(s => (
                              <div
                                key={s.id}
                                className={\`px-3 py-2.5 text-sm cursor-pointer rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between \${String(beasiswaForm.siswaId) === String(s.id) ? 'bg-blue-50/50' : ''}\`}
                                onClick={() => {
                                  setBeasiswaForm({ ...beasiswaForm, siswaId: s.id });
                                  setShowSiswaDropdown(false);
                                  setSiswaSearchQuery("");
                                }}
                              >
                                <div>
                                  <div className={\`font-medium \${String(beasiswaForm.siswaId) === String(s.id) ? 'text-[#1A3D63]' : 'text-gray-700'}\`}>{s.nama_lengkap}</div>
                                  <div className="text-[11px] text-gray-400 mt-0.5">NIS: {s.nis}</div>
                                </div>
                                {String(beasiswaForm.siswaId) === String(s.id) && (
                                  <svg width="16" height="16" fill="none" stroke="#1A3D63" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>`;

const rxSiswa = new RegExp(oldSiswaBlock.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1").replace(/\s+/g, '\\s+'));
content = content.replace(rxSiswa, newSiswaBlock);

// 3. Replace Nama Program Beasiswa
const oldNamaBeasiswa = `<div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Program Beasiswa</label>
                    <input
                      type="text"
                      value={beasiswaForm.namaBeasiswa}
                      onChange={(e) => setBeasiswaForm({ ...beasiswaForm, namaBeasiswa: e.target.value })}
                      placeholder="Contoh: Prestasi Akademik"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>`;

const newNamaBeasiswa = `<div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Program Beasiswa</label>
                    <div className="relative">
                      <select
                        value={beasiswaForm.namaBeasiswa}
                        onChange={(e) => setBeasiswaForm({ ...beasiswaForm, namaBeasiswa: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 appearance-none pr-10"
                      >
                        <option value="" disabled>-- Pilih Program --</option>
                        <option value="Beasiswa Prestasi Akademik">Beasiswa Prestasi Akademik</option>
                        <option value="Beasiswa dari Lazismu">Beasiswa dari Lazismu</option>
                        <option value="Beasiswa Tahfidz Al-Qur'an">Beasiswa Tahfidz Al-Qur'an</option>
                        <option value="Beasiswa Prestasi Non-Akademik">Beasiswa Prestasi Non-Akademik</option>
                        <option value="Beasiswa Tahfiz Quran">Beasiswa Tahfiz Quran</option>
                        <option value="Beasiswa Penyarikatan Muhammadiyah">Beasiswa Penyarikatan Muhammadiyah</option>
                      </select>
                      <span className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </span>
                    </div>
                  </div>`;

const rxNama = new RegExp(oldNamaBeasiswa.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1").replace(/\s+/g, '\\s+'));
content = content.replace(rxNama, newNamaBeasiswa);

// 4. Replace Nominal Potongan
const oldNominal = `<div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Potongan (Rp)</label>
                    <input
                      type="number"
                      value={beasiswaForm.nominal}
                      onChange={(e) => setBeasiswaForm({ ...beasiswaForm, nominal: e.target.value })}
                      placeholder="250000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>`;

const newNominal = `<div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Potongan (Rp)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-gray-500 font-semibold text-sm">Rp</span>
                      <input
                        type="number"
                        value={beasiswaForm.nominal}
                        onChange={(e) => setBeasiswaForm({ ...beasiswaForm, nominal: e.target.value })}
                        placeholder="250000"
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                      />
                    </div>
                  </div>`;

const rxNominal = new RegExp(oldNominal.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1").replace(/\s+/g, '\\s+'));
content = content.replace(rxNominal, newNominal);

// 5. Replace Periode
const oldPeriode = `<div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Periode</label>
                    <input
                      type="text"
                      value={beasiswaForm.periode}
                      onChange={(e) => setBeasiswaForm({ ...beasiswaForm, periode: e.target.value })}
                      placeholder="Contoh: 2025/2026"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>`;

const newPeriode = `<div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Periode</label>
                    <div className="relative">
                      <select
                        value={beasiswaForm.periode}
                        onChange={(e) => setBeasiswaForm({ ...beasiswaForm, periode: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 appearance-none pr-10"
                      >
                        <option value="2025/2026">2025/2026</option>
                      </select>
                      <span className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </span>
                    </div>
                  </div>`;

const rxPeriode = new RegExp(oldPeriode.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1").replace(/\s+/g, '\\s+'));
content = content.replace(rxPeriode, newPeriode);

// 6. Remove (Opsional) from Tanggal Selesai
const oldTgl = `<label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Selesai (Opsional)</label>`;
const newTgl = `<label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Selesai</label>`;

content = content.replace(oldTgl, newTgl);

fs.writeFileSync(file, content);
console.log('Successfully updated modal beasiswa.');
