const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Wrap the top section in {!selectedProgramForView ? ( <> ...
const headerStart = `{/* Header */}`;
const newHeaderStart = `{!selectedProgramForView ? (\n              <>\n                {/* Header */}`;
content = content.replace(headerStart, newHeaderStart);

// 2. Remove the old {!selectedProgramForView ? (
const oldCond = `{/* Tabs */}
            {/* Tab Content */}
            {!selectedProgramForView ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">`;
const newCond = `{/* Tabs */}
            {/* Tab Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">`;
// To be safe with spacing, use regex:
const condRegex = /\{\/\* Tab Content \*\/\}\s*\{!selectedProgramForView \? \(/;
content = content.replace(condRegex, '{/* Tab Content */}');

// 3. Add </> before the ) : (
const beforeElse = `</div>
            ) : (
              <div className="flex flex-col gap-4 animate-fadeIn">`;
const newBeforeElse = `</div>
              </>
            ) : (
              <div className="flex flex-col gap-4 animate-fadeIn">`;
// Using regex for flexibility:
const elseRegex = /<\/div>\s*\)\s*:\s*\(\s*<div className="flex flex-col gap-4 animate-fadeIn">/;
content = content.replace(elseRegex, '</div>\n              </>\n            ) : (\n              <div className="flex flex-col gap-4 animate-fadeIn">');

// 4. Change the number icon styling
const oldNumber = /<div className=\{`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg \$\{item.typeColor === 'blue' \? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'\}`\}>/g;
const newNumber = `<div className="w-8 h-8 rounded-full bg-[#EBF3FA] flex items-center justify-center text-[13px] font-bold text-[#1A3D63] shrink-0 shadow-sm">`;
content = content.replace(oldNumber, newNumber);

fs.writeFileSync(file, content);
console.log("Successfully refactored beasiswa view");
