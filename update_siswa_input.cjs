const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = '<label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Siswa</label>';
const endStr = '<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">';

let startIndex = content.indexOf(startStr);
let endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const newSiswaBlock = \`\${startStr}
                  <div className="relative" onBlur={(e) => {
                    // Timeout allows click on option to fire first
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setTimeout(() => setShowSiswaDropdown(false), 200);
                    }
                  }}>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-400">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Ketik nama atau NIS siswa..."
                        value={siswaSearchQuery || (beasiswaForm.siswaId ? (siswaList.find(s => String(s.id) === String(beasiswaForm.siswaId))?.nama_lengkap || "") : "")}
                        onChange={(e) => {
                          setSiswaSearchQuery(e.target.value);
                          setBeasiswaForm({ ...beasiswaForm, siswaId: "" });
                          setShowSiswaDropdown(true);
                        }}
                        onFocus={() => setShowSiswaDropdown(true)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 bg-white text-gray-800"
                      />
                    </div>
                    {showSiswaDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] max-h-[200px] flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="p-1">
                          {siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">Siswa tidak ditemukan</div>
                          ) : (
                            siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).map(s => (
                              <div
                                key={s.id}
                                className={\`px-4 py-2.5 text-sm cursor-pointer rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between \${String(beasiswaForm.siswaId) === String(s.id) ? 'bg-blue-50/50' : ''}\`}
                                onClick={() => {
                                  setBeasiswaForm({ ...beasiswaForm, siswaId: s.id });
                                  setSiswaSearchQuery(s.nama_lengkap);
                                  setShowSiswaDropdown(false);
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
                </div>
                \n                \`;

    // To remove exactly the old div container for "Pilih Siswa":
    // The previous structure had <div> ... label ... <div relative>... </div> </div>
    // Let's replace from <label to <div className="grid grid-cols-1
    // Actually, we need to preserve the wrapper <div>. So let's wrap it in <div>
    
    content = content.substring(0, startIndex - 5) + "<div>\n                  " + newSiswaBlock + content.substring(endIndex);
    fs.writeFileSync(file, content);
    console.log("Successfully updated to autocomplete input");
} else {
    console.log("Blocks not found");
}
