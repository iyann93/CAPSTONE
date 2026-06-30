const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboards', 'BendaharaDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update form initial state
content = content.replace(
  /siswaId: "",\s+namaBeasiswa: "",/g,
  `siswaIds: [],\n    namaBeasiswa: "",`
);

// 2. Update validation check
content = content.replace(
  /if \(!beasiswaForm\.siswaId \|\| !beasiswaForm\.namaBeasiswa/g,
  `if ((!beasiswaForm.siswaIds || beasiswaForm.siswaIds.length === 0) && !beasiswaForm.siswaId || !beasiswaForm.namaBeasiswa`
);

// 3. Update payload
content = content.replace(
  /const payload = {\s+siswaId: beasiswaForm\.siswaId,/g,
  `const payload = {\n        siswaIds: beasiswaForm.siswaIds || (beasiswaForm.siswaId ? [beasiswaForm.siswaId] : []),`
);

// 4. Update table selection for editing (if applicable, though probably editing still uses siswaId since it's one record)
// Wait, when editing, we are editing ONE record, so it has a single siswa_id. 
// Let's ensure the edit form populates siswaIds with just that one ID.
content = content.replace(
  /siswaId: row\.siswa_id,/g,
  `siswaIds: [row.siswa_id],`
);

// Also handle other resets:
content = content.replace(
  /siswaId: "",/g,
  `siswaIds: [],`
);

// 5. Form UI
// Find the input and dropdown logic
const oldFormUI = `                        value={siswaSearchQuery || (beasiswaForm.siswaId ? (siswaList.find(s => String(s.id) === String(beasiswaForm.siswaId))?.nama_lengkap || "") : "")}
                        onChange={(e) => {
                          setIsBeasiswaFormDirty(true);
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
                                className={"px-4 py-2.5 text-sm cursor-pointer rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between " + (String(beasiswaForm.siswaId) === String(s.id) ? "bg-blue-50/50" : "")}
                                onClick={() => {
                                  setIsBeasiswaFormDirty(true);
                                  setBeasiswaForm({ ...beasiswaForm, siswaId: s.id });
                                  setSiswaSearchQuery(s.nama_lengkap);
                                  setShowSiswaDropdown(false);
                                }}
                              >
                                <div>
                                  <div className={"font-medium " + (String(beasiswaForm.siswaId) === String(s.id) ? "text-[#1A3D63]" : "text-gray-700")}>{s.nama_lengkap}</div>
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
                    )}`;

const newFormUI = `                        value={siswaSearchQuery}
                        placeholder={(!siswaSearchQuery && beasiswaForm.siswaIds && beasiswaForm.siswaIds.length > 0) ? \`\${beasiswaForm.siswaIds.length} siswa terpilih\` : "Ketik nama atau NIS siswa..."}
                        onChange={(e) => {
                          setIsBeasiswaFormDirty(true);
                          setSiswaSearchQuery(e.target.value);
                          setShowSiswaDropdown(true);
                        }}
                        onFocus={() => setShowSiswaDropdown(true)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 bg-white text-gray-800"
                      />
                    </div>
                    {/* Render selected students as small badges below input */}
                    {beasiswaForm.siswaIds && beasiswaForm.siswaIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {beasiswaForm.siswaIds.map(id => {
                          const s = siswaList.find(x => String(x.id) === String(id));
                          if (!s) return null;
                          return (
                            <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {s.nama_lengkap}
                              <button type="button" onClick={() => {
                                setBeasiswaForm(prev => ({...prev, siswaIds: prev.siswaIds.filter(x => x !== id)}));
                              }} className="hover:text-blue-900">
                                &times;
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {showSiswaDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] max-h-[200px] flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="p-1">
                          {siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">Siswa tidak ditemukan</div>
                          ) : (
                            siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).map(s => {
                              const isSelected = beasiswaForm.siswaIds && beasiswaForm.siswaIds.includes(s.id);
                              return (
                                <div
                                  key={s.id}
                                  className={"px-4 py-2.5 text-sm cursor-pointer rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between " + (isSelected ? "bg-blue-50/50" : "")}
                                  onClick={() => {
                                    setIsBeasiswaFormDirty(true);
                                    let newIds = beasiswaForm.siswaIds ? [...beasiswaForm.siswaIds] : [];
                                    if (isSelected) {
                                      newIds = newIds.filter(id => id !== s.id);
                                    } else {
                                      newIds.push(s.id);
                                    }
                                    setBeasiswaForm({ ...beasiswaForm, siswaIds: newIds });
                                  }}
                                >
                                  <div>
                                    <div className={"font-medium " + (isSelected ? "text-[#1A3D63]" : "text-gray-700")}>{s.nama_lengkap}</div>
                                    <div className="text-[11px] text-gray-400 mt-0.5">NIS: {s.nis}</div>
                                  </div>
                                  {isSelected && (
                                    <svg width="16" height="16" fill="none" stroke="#1A3D63" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}`;

if (content.includes(oldFormUI)) {
  content = content.replace(oldFormUI, newFormUI);
  console.log("Successfully replaced form UI");
} else {
  console.log("Failed to find exact oldFormUI. Trying simpler replacement.");
  // Simpler replacement using regex or split
  // Let's just find the input and replace until the end of showSiswaDropdown
  const startIdx = content.indexOf('value={siswaSearchQuery || (beasiswaForm.siswaId ?');
  const endStr = ')}';
  
  if (startIdx !== -1) {
    // we need to find the correct ending brace for showSiswaDropdown...
    // Actually regex is safer if we find specific parts.
    console.log("Will not replace with fallback to prevent syntax errors. Pls check.");
  }
}

fs.writeFileSync(filePath, content);
console.log("Done updating BendaharaDashboard.jsx");
