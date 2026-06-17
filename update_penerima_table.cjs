const fs = require('fs');
const filePath = 'd:\\SEMESTER 6\\capstone SIA\\CAPSTONE\\src\\pages\\dashboards\\BendaharaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states
const stateInsert = `
  const [selectedProgramForView, setSelectedProgramForView] = useState(null);
  const [penerimaSearchQuery, setPenerimaSearchQuery] = useState('');
  const [penerimaStatusFilter, setPenerimaStatusFilter] = useState('Semua');
`;
content = content.replace(
  /const \[selectedProgramForView, setSelectedProgramForView\] = useState\(null\);/,
  stateInsert
);

// 2. Add NIS to payload
content = content.replace(
  /siswa_nama: siswaData\?\.nama_lengkap \|\| "Siswa",/,
  'siswa_nama: siswaData?.nama_lengkap || "Siswa",\n        nis: siswaData?.nis || "-",'
);

// 3. Replace the Right Column Table section (Lines ~1826-~1900)
// It starts with `{/* Right Column: Table */}` and ends after `</table>`
const rightColRegex = /\{\/\* Right Column: Table \*\/\}[\s\S]*?(?=\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\} else if \(activeMenu === "Pengaturan"\) \{)/;
// Wait, the outer div ends right before `} else if (activeMenu === "Pengaturan") {` or somewhere similar.
// It's safer to replace the exact HTML blocks.
const oldHeaderCard = `<div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Daftar Siswa Penerima</h3>
                            <p className="text-xs text-gray-400 mt-1">Siswa yang terdaftar dalam program {activeProgram.title}.</p>
                          </div>`;

const newHeaderCard = `<div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">Daftar Penerima Beasiswa</h3>
                              <p className="text-xs text-gray-400 mt-1">Siswa yang terdaftar dalam program {activeProgram.title}.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className="relative w-full sm:w-48">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" /></svg>
                                </span>
                                <input
                                  type="text"
                                  value={penerimaSearchQuery}
                                  onChange={(e) => setPenerimaSearchQuery(e.target.value)}
                                  placeholder="Cari Nama / NIS..."
                                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                                />
                              </div>
                              <select
                                value={penerimaStatusFilter}
                                onChange={(e) => setPenerimaStatusFilter(e.target.value)}
                                className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1A3D63] text-gray-600 bg-white"
                              >
                                <option value="Semua">Semua Status</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Non-Aktif">Non-Aktif</option>
                              </select>
                            </div>
                          </div>`;
content = content.replace(oldHeaderCard, newHeaderCard);

// Replace Table Head
const oldThead = `<thead>
                                <tr className="bg-gray-50/50 text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                                  <th className="py-3.5 px-4 text-center w-10">NO</th>
                                  <th className="py-3.5 px-6">NAMA SISWA</th>
                                  <th className="py-3.5 px-6">KELAS</th>
                                  <th className="py-3.5 px-6">POTONGAN</th>
                                  <th className="py-3.5 px-6">PERIODE</th>
                                  <th className="py-3.5 px-6">STATUS</th>
                                  <th className="py-3.5 px-6 text-right">AKSI</th>
                                </tr>
                              </thead>`;

const newThead = `<thead>
                                <tr className="bg-white text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                                  <th className="py-4 px-5">NAMA SISWA</th>
                                  <th className="py-4 px-4 text-center">NIS</th>
                                  <th className="py-4 px-4 text-center">KELAS</th>
                                  <th className="py-4 px-5">PROGRAM BEASISWA</th>
                                  <th className="py-4 px-5">NOMINAL BANTUAN</th>
                                  <th className="py-4 px-4 text-center">PERIODE</th>
                                  <th className="py-4 px-4 text-center">STATUS</th>
                                  <th className="py-4 px-5 text-right">AKSI</th>
                                </tr>
                              </thead>`;
content = content.replace(oldThead, newThead);

// Replace Tbody
const oldTbodyStart = `<tbody className="divide-y divide-gray-50 text-xs">
                                {(activeProgram.penerima?.length || 0) > 0 ? (
                                  (activeProgram.penerima || []).map((row, idx) => (`;
const oldTbodyEnd = `                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-400">Belum ada penerima beasiswa</td>
                                  </tr>
                                )}
                              </tbody>`;

const tBodyReplacement = `<tbody className="divide-y divide-gray-50 text-xs">
                                {(() => {
                                  let filteredPenerima = activeProgram.penerima || [];
                                  if (penerimaSearchQuery) {
                                    const q = penerimaSearchQuery.toLowerCase();
                                    filteredPenerima = filteredPenerima.filter(p => 
                                      (p.siswa_nama?.toLowerCase() || "").includes(q) || 
                                      (p.nis?.toLowerCase() || "").includes(q)
                                    );
                                  }
                                  if (penerimaStatusFilter !== 'Semua') {
                                    filteredPenerima = filteredPenerima.filter(p => p.status === penerimaStatusFilter);
                                  }

                                  if (filteredPenerima.length === 0) {
                                    return (
                                      <tr>
                                        <td colSpan="8" className="py-8 text-center text-gray-400 font-medium">Belum ada penerima yang ditemukan.</td>
                                      </tr>
                                    );
                                  }

                                  return filteredPenerima.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                                      <td className="py-4 px-5 font-bold text-gray-800">{row.siswa_nama}</td>
                                      <td className="py-4 px-4 text-center text-gray-500 font-medium">{row.nis || "-"}</td>
                                      <td className="py-4 px-4 text-center">
                                        <span className="text-gray-600 bg-gray-100 px-2 py-1.5 rounded-md border border-gray-200 text-[10px] font-bold">{row.nama_kelas}</span>
                                      </td>
                                      <td className="py-4 px-5 font-bold text-gray-700">{row.nama_beasiswa}</td>
                                      <td className="py-4 px-5 font-bold text-gray-800">
                                        Rp {Number(row.nominal).toLocaleString('id-ID')}
                                      </td>
                                      <td className="py-4 px-4 text-center text-gray-500 font-medium">{row.periode}</td>
                                      <td className="py-4 px-4 text-center">
                                        <span className={\`px-3 py-1.5 rounded-md text-[10px] font-bold \${row.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-500 border border-gray-200'}\`}>
                                          {row.status}
                                        </span>
                                      </td>
                                      <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button
                                            onClick={() => {
                                              setSelectedBeasiswa(row);
                                              setBeasiswaForm({
                                                siswaId: row.siswa_id,
                                                namaBeasiswa: row.nama_beasiswa,
                                                nominal: row.nominal,
                                                periode: row.periode || "2025/2026",
                                                status: row.status,
                                                tanggalMulai: row.tanggal_mulai ? new Date(row.tanggal_mulai).toISOString().split('T')[0] : "",
                                                tanggalSelesai: row.tanggal_selesai ? new Date(row.tanggal_selesai).toISOString().split('T')[0] : ""
                                              });
                                              setShowAddPenerimaModal(true);
                                            }}
                                            className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-blue-500 transition-colors cursor-pointer"
                                          >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                                          </button>
                                          <button
                                            onClick={() => {
                                              setSelectedBeasiswa(row);
                                              setShowDeleteBeasiswaModal(true);
                                            }}
                                            className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors cursor-pointer"
                                          >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ));
                                })()}
                              </tbody>`;

const fullTbodyRegex = /<tbody className="divide-y divide-gray-50 text-xs">[\s\S]*?<\/tbody>/;
content = content.replace(fullTbodyRegex, tBodyReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('UI Revamp for Daftar Penerima Beasiswa table successfully applied!');
