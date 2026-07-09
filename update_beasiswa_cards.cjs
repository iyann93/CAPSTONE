const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// The Beasiswa case has cards starting around line 1416
// Let's use a targeted replace for those exact 4 blocks.
const old1 = 'className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-blue-500"';
const old2 = 'className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-green-500"';
const old3 = 'className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-orange-500"';
const old4 = 'className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-purple-500"';

const newClass = 'className="bg-[#1A3D63] rounded-xl p-5 shadow-sm"';

content = content.replace(old1, newClass)
                 .replace(old2, newClass)
                 .replace(old3, newClass)
                 .replace(old4, newClass);

// For the text inside those 4 cards:
// We need to only replace the text inside the Beasiswa Stats container.
// Let's find the section.
const parts = content.split('case "Beasiswa":');
if (parts.length > 1) {
    let beasiswaSection = parts[1];
    const beasiswaTabsStart = beasiswaSection.indexOf('{/* Tabs */}');
    let statsSection = beasiswaSection.substring(0, beasiswaTabsStart);
    
    // replace inside statsSection
    statsSection = statsSection.replace(/className="text-2xl font-bold text-gray-800"/g, 'className="text-2xl font-bold text-white"');
    statsSection = statsSection.replace(/className="text-\[11px\] text-gray-400 mt-1 font-semibold uppercase tracking-wider"/g, 'className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider"');
    
    parts[1] = statsSection + beasiswaSection.substring(beasiswaTabsStart);
    content = parts.join('case "Beasiswa":');
    
    fs.writeFileSync(file, content);
    console.log('Successfully updated Beasiswa cards.');
} else {
    console.log('Could not find case "Beasiswa":');
}
