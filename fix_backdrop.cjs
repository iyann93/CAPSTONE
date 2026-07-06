const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (full.endsWith('.jsx') && !full.includes('Sidebar.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      
      // Remove onClick={...} if it's on the same line as inset-0 or backdrop
      content = content.replace(/^(.*?(?:inset-0|backdrop).*?)onClick=\{[^}]+\}(.*)$/gm, '$1$2');
      
      // Remove onClick={() => ...} if it's on the same line
      content = content.replace(/^(.*?(?:inset-0|backdrop).*?)onClick=\{\s*\(\)\s*=>.*?\}\s*(.*)$/gm, '$1$2');
      
      // Remove onClick={handler} if it's on the NEXT line after className="..."
      content = content.replace(/(className=\"[^\"]*(?:inset-0|backdrop)[^\"]*\"[^>]*)\n\s*onClick=\{[^}]+\}/gm, '$1');

      if (content !== fs.readFileSync(full, 'utf8')) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Modified', full);
      }
    }
  }
}
processDir('src');
