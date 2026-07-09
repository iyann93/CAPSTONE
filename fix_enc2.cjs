const fs = require('fs');
const path = require('path');

const map = {
  'â€¢': '•',
  'â†’': '→',
  'â–²': '▲',
  'â— ': '● ',
  'â‰¤': '≤',
  'âœ…': '✅',
  'â†‘': '↑',
  'âœ—': '✗',
  'âš ': '⚠',
  'âœ“': '✓',
  'ðŸ‘¨â€ ðŸ «': '👨‍🏫',
  'âˆ’': '−',
  'â† ': '←',
  'â™‚': '♂',
  'â™€': '♀'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fp = path.join(dir, f);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      processDir(fp);
    } else if (f.endsWith('.jsx')) {
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
        console.log('Fixed ' + fp);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src/pages'));
