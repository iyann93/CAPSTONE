const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split(/\r?\n/);
  
  let cleaned = [];
  let inConflict = false;
  let keep = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('<<<<<<<')) {
      inConflict = true;
      keep = true; // We'll keep the HEAD part (or local part)
      continue;
    }
    
    if (line.startsWith('=======')) {
      if (inConflict) {
        keep = false; // Ignore the remote part
      } else {
        cleaned.push(line); // It might be a decorative comment like in WakilKepalaHome
      }
      continue;
    }
    
    if (line.startsWith('>>>>>>>')) {
      inConflict = false;
      keep = true;
      continue;
    }
    
    if (keep || !inConflict) {
      cleaned.push(line);
    }
  }
  
  fs.writeFileSync(filePath, cleaned.join('\n'), 'utf8');
  console.log('Cleaned', filePath);
}

cleanFile(path.join(__dirname, '../src/components/Sidebar.jsx'));
cleanFile(path.join(__dirname, '../src/pages/dashboards/CatatanSiswa.jsx'));
