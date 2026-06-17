const fs = require('fs');
const filePath = 'd:\\SEMESTER 6\\capstone SIA\\CAPSTONE\\src\\pages\\dashboards\\BendaharaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Use a carefully crafted regex that DOES NOT use [\s\S]*? across tags.
// Instead, use [^<]*? to match anything except opening tags, or just specific strings.

const regex1 = /<div className="relative">\s*<select\s+value=\{selectedYear\}\s+onChange=\{\(e\) => setSelectedYear\(e\.target\.value\)\}\s+className="[^"]+"\s*>\s*<option value="2025\/2026">Tahun Ajaran: 2025\/2026<\/option>\s*<\/select>\s*<span className="absolute right-3 top-3\.5 text-gray-400 pointer-events-none(?: transition-colors)?">\s*<IconChevronDown \/>\s*<\/span>\s*<\/div>/g;

let count = 0;
content = content.replace(regex1, (match) => {
  count++;
  return `<div className="relative group w-full sm:w-auto">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
                  </div>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
                  >
                    <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>`;
});

// Second match for the one that has an SVG left and no onChange, line 2335
// This one is already wrapped in <div className="relative"> ... <svg>...</svg> </span> <span ...> <IconChevronDown/> </span> </div>
// Let's do exact substring replacement for it.
const exactMatch2 = `<div className="relative">
                  <select className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-[13px] font-bold text-gray-600 cursor-pointer appearance-none focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 shadow-sm transition-all">
                    <option>Tahun Ajaran: 2025/2026</option>
                  </select>
                  <span className="absolute left-3.5 top-2.5 text-gray-400 pointer-events-none">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </span>
                  <span className="absolute right-3.5 top-3 text-gray-400 pointer-events-none">
                    <IconChevronDown />
                  </span>
                </div>`;
                
if (content.includes(exactMatch2)) {
    count++;
    content = content.replace(exactMatch2, `<div className="relative group w-full sm:w-auto">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
                  </div>
                  <select
                    className="w-full flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
                  >
                    <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>`);
}

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced', count, 'dropdowns safely');
