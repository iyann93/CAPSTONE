const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldHtml = `<div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-gray-600 shadow-sm">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  Tahun Ajaran: 2025/2026
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </div>`;

const newHtml = `<div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-sm font-semibold text-gray-700 outline-none cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                    defaultValue="2025/2026"
                  >
                    <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                  </select>
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  </div>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>`;

// Replace using a normalize whitespace regex just in case
const regexOldHtml = new RegExp(oldHtml.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1").replace(/\s+/g, '\\s+'));

if (regexOldHtml.test(content)) {
    content = content.replace(regexOldHtml, newHtml);
    fs.writeFileSync(file, content);
    console.log('Successfully updated dropdown.');
} else {
    console.log('Target string not found.');
}
