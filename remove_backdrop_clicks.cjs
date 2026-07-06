const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') && !fullPath.includes('Sidebar.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = content;
      let pos = 0;
      
      while (true) {
        pos = modified.indexOf('<div', pos);
        if (pos === -1) break;
        
        // Parse the opening tag
        let i = pos + 4;
        let inString = false;
        let stringChar = '';
        let braceDepth = 0;
        let tagEnd = -1;
        
        while (i < modified.length) {
          const char = modified[i];
          if (!inString && braceDepth === 0 && (char === '"' || char === "'" || char === '`')) {
            inString = true;
            stringChar = char;
          } else if (inString && char === stringChar) {
            inString = false;
          } else if (!inString && char === '{') {
            braceDepth++;
          } else if (!inString && char === '}') {
            braceDepth--;
          } else if (!inString && braceDepth === 0 && char === '>') {
            tagEnd = i;
            break;
          }
          i++;
        }
        
        if (tagEnd !== -1) {
          const tagString = modified.substring(pos, tagEnd + 1);
          // Check if it's a backdrop
          if ((tagString.includes('inset-0') || tagString.includes('backdrop') || tagString.includes('inset: 0')) && tagString.includes('onClick=')) {
            // It's a backdrop with an onClick! We need to remove the onClick prop.
            let newTagString = tagString;
            
            // Find onClick={ or onClick={(e)
            // It might be onClick={...} or onClick={() => ...}
            // We use the same parsing logic to isolate the onClick prop
            
            let onClickPos = newTagString.indexOf('onClick=');
            if (onClickPos !== -1) {
              // find the start of the value
              let valStart = newTagString.indexOf('{', onClickPos);
              if (valStart !== -1) {
                let innerBraceDepth = 0;
                let valEnd = -1;
                for (let j = valStart; j < newTagString.length; j++) {
                  if (newTagString[j] === '{') innerBraceDepth++;
                  else if (newTagString[j] === '}') {
                    innerBraceDepth--;
                    if (innerBraceDepth === 0) {
                      valEnd = j;
                      break;
                    }
                  }
                }
                
                if (valEnd !== -1) {
                  // Remove from onClickPos to valEnd
                  newTagString = newTagString.substring(0, onClickPos) + newTagString.substring(valEnd + 1);
                  // Clean up multiple spaces
                  newTagString = newTagString.replace(/\s+>/, '>');
                  
                  modified = modified.substring(0, pos) + newTagString + modified.substring(tagEnd + 1);
                  // tagEnd changed, so adjust pos to the end of the new tag
                  pos = pos + newTagString.length;
                  continue;
                }
              }
            }
          }
        }
        pos = tagEnd !== -1 ? tagEnd + 1 : pos + 4;
      }

      if (modified !== content) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log('Modified:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
