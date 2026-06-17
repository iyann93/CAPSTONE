const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// The original else block
const startMarker = `) : (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex items-center gap-3 mb-2">`;
const startIndex = content.indexOf(startMarker);
if(startIndex === -1) {
    console.error("Could not find startMarker");
    process.exit(1);
}

// Find the end of the Beasiswa case
const endMarker = `case "Monitor Tunggakan":`;
const caseIndex = content.indexOf(endMarker, startIndex);
if(caseIndex === -1) {
    console.error("Could not find endMarker");
    process.exit(1);
}
const endIndex = content.lastIndexOf('</div>\n        );', caseIndex);

// Extract the table structure from the old content to preserve it!
const oldBlock = content.substring(startIndex, endIndex);

// Table starts around `<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">`
const tableStartMarker = `<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">`;
const tableEndMarker = `</div>
              </div>
            )}
          </div>`;

const tableStartIndex = oldBlock.indexOf(tableStartMarker);
const tableEndIndex = oldBlock.lastIndexOf(`</div>
              </div>
            )}`); // Remove the `</div>` since it belongs to the parent container which we will re-inject.

if (tableStartIndex === -1 || tableEndIndex === -1) {
    console.error("Could not find table boundaries");
    process.exit(1);
}

const tableContent = oldBlock.substring(tableStartIndex, tableEndIndex + 16);

const newElseBlock = `) : (() => {
              const activeProgram = programList.find(p => p.title === selectedProgramForView) || {
                title: selectedProgramForView,
                subtitle: "2025/2026",
                type: "Beasiswa",
                amount: "-",
                status: "Aktif",
                description: "Belum ada deskripsi detail untuk program beasiswa ini.",
                quota: "Tidak dibatasi",
                requirements: "Belum ada persyaratan khusus yang ditambahkan."
              };

              return (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setSelectedProgramForView(null)} className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border-none shrink-0">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Detail Program Beasiswa</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Program Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm lg:sticky lg:top-6 flex flex-col gap-6">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold mb-3 uppercase tracking-wider">
                          {activeProgram.type || 'Beasiswa'}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 leading-snug">{activeProgram.title}</h3>
                        <div className="text-xs text-gray-400 mt-1.5 font-medium flex items-center gap-1.5">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
                          Periode {activeProgram.subtitle}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Nominal / Potongan</div>
                          <div className="text-[15px] font-bold text-[#1A3D63]">{activeProgram.amount}</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div className="text-right">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</div>
                          <div className={\`inline-flex px-2 py-0.5 rounded text-xs font-bold \${activeProgram.status === 'Aktif' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}\`}>
                            {activeProgram.status || 'Aktif'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2">Deskripsi Program</h4>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          {activeProgram.description || "Belum ada deskripsi spesifik untuk program beasiswa ini."}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2">Persyaratan</h4>
                        <div className="text-[13px] text-gray-500 leading-relaxed bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                          {activeProgram.requirements ? (
                            <div className="whitespace-pre-line">{activeProgram.requirements}</div>
                          ) : (
                            <span className="italic text-gray-400">Belum ada persyaratan khusus.</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-500 font-medium">Kuota Penerima: <span className="font-bold text-gray-800">{activeProgram.quota || "Tidak dibatasi"}</span></div>
                        <div className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded">
                          {beasiswaList.filter(b => b.nama_beasiswa === selectedProgramForView).length} Terdaftar
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Table */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Daftar Siswa Penerima</h3>
                          <p className="text-xs text-gray-500 mt-1">Siswa yang terdaftar dalam program {activeProgram.title}.</p>
                        </div>
                      </div>
                      ${tableContent}
                    </div>
                  </div>
                </div>
              );
            })()`;

const newContent = content.substring(0, startIndex) + newElseBlock + content.substring(tableEndIndex + 16 + startIndex);

fs.writeFileSync(file, newContent);
console.log("Successfully splitted the view!");
