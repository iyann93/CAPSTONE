const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split(/\r?\n/);

// Find the line where `<div className="flex items-center gap-2 flex-wrap mt-2">` is located inside `case "Beasiswa":`
// From my grep, it's around 1493
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('className="flex items-center gap-2 flex-wrap mt-2"')) {
        // Let's check if the next line has item.typeColor
        if (lines[i+1] && lines[i+1].includes('item.typeColor')) {
            startIdx = i + 1; // start of item.type span
            // Find the end of item.status span
            for (let j = startIdx; j < startIdx + 20; j++) {
                if (lines[j].includes('>{item.status}</span>')) {
                    endIdx = j;
                    break;
                }
            }
            break;
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    // Remove the lines
    lines.splice(startIdx, endIdx - startIdx + 1);
    
    // Write back
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Successfully removed the requested tags.');
} else {
    console.log('Could not find the target lines.');
}
