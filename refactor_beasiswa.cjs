const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace State
content = content.replace('const [beasiswaTab, setBeasiswaTab] = useState("penerima"); // Default to penerima', 'const [selectedProgramForView, setSelectedProgramForView] = useState(null);');
// Just in case it was modified:
content = content.replace('const [beasiswaTab, setBeasiswaTab] = useState("penerima");', 'const [selectedProgramForView, setSelectedProgramForView] = useState(null);');

// 2. Remove Tab Headers
const tabStart = '<div className="flex gap-6 border-b border-gray-200 mb-6">';
const tabEnd = '</div>\n\n            {/* Tab Content */}';
const tabBlockRegex = /<div className="flex gap-6 border-b border-gray-200 mb-6">[\s\S]*?<\/div>\s*\{\/\* Tab Content \*\/\}/;
content = content.replace(tabBlockRegex, '{/* Tab Content */}');

// 3. Conditional
content = content.replace('{beasiswaTab === "program" ? (', '{!selectedProgramForView ? (');

// 4. Gift SVG to index
const giftRegex = /<div className=\{`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 \$\{item\.typeColor === 'blue' \? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'[\s\S]*?<\/div>/;
const newGift = `<div className={\`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg \${item.typeColor === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}\`}>
                          {i + 1}
                        </div>`;
content = content.replace(giftRegex, newGift);

// 5. Pencil to Eye
const pencilRegex = /<button className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-blue-500 transition-colors cursor-pointer">[\s\S]*?<\/button>/;
const newEye = `<button onClick={() => setSelectedProgramForView(item.title)} className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-blue-500 transition-colors cursor-pointer">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>`;
content = content.replace(pencilRegex, newEye);

// 6. Detail View Header
const detailRegex = /<\/div>\s*\)\s*:\s*\(\s*<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">/;
const newDetail = `</div>
            ) : (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setSelectedProgramForView(null)} className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                  </button>
                  <h2 className="text-lg font-bold text-gray-800">Daftar Penerima: {selectedProgramForView}</h2>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">`;
content = content.replace(detailRegex, newDetail);

// 7. Filter Data Penerima
const tableDataRegex = /\{beasiswaList\.length > 0 \? \([\s\S]*?beasiswaList\.map\(\(row, idx\) => \(/;
const newTableData = `{beasiswaList.filter(b => b.nama_beasiswa === selectedProgramForView).length > 0 ? (
                        beasiswaList.filter(b => b.nama_beasiswa === selectedProgramForView).map((row, idx) => (`;
content = content.replace(tableDataRegex, newTableData);

// 8. Close extra div added in step 6
// We added a wrapper `<div className="flex flex-col gap-4 animate-fadeIn">` around the table wrapper `<div className="bg-white rounded-2xl...">`
// Wait! The table is closed by `</div>` which was originally closing `<div className="bg-white rounded-2xl...">`. Now it only closes the inner div.
// We need to add one more `</div>` after the inner div is closed.
// Let's find the end of the `) : (` block.
// The original block ended with:
//               </div>
//             )}
// We need to change it to:
//                 </div>
//               </div>
//             )}
const endBlockRegex = /<\/div>\s*\}\)/;
// Wait, the original code is:
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
const oldEndBlock = `                    </tbody>
                  </table>
                </div>
              </div>
            )}`;
const newEndBlock = `                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}`;
content = content.replace(oldEndBlock, newEndBlock);

fs.writeFileSync(file, content);
console.log("Successfully refactored beasiswa UI");
