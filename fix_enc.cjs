const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src/pages/dashboards');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
const map = {
  'â€”': '—',
  'â€“': '–',
  'â€¢': '•',
  'â‰¥': '≥',
  'â†’': '→',
  'â— ': '● ',
  'â”€': '─',
  'â€¦': '…',
  'Ã—': '×',
  'âš ï¸': '⚠️',
  'â€º': '›'
};
files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let modified = false;
  for (const [bad, good] of Object.entries(map)) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      modified = true;
    }
  }
  if (modified) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Fixed ' + f);
  }
});
