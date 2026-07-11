const fs = require('fs');
const path = require('path');
const dir = 'src/pages/dashboards';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    const regex1 = /onClick=\{\(\)\s*=>\s*setView\((.*?)\)\s*setTimeout/g;
    if (regex1.test(content)) {
      content = content.replace(regex1, 'onClick={() => { setView($1); setTimeout');
      const regex2 = /setTimeout\(\(\) => window.scrollTo\(\{ top: 0, behavior: "smooth" \}\), 50\);\}/g;
      content = content.replace(regex2, 'setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}');
      fs.writeFileSync(p, content);
      console.log('Fixed ' + file);
    }
  }
});
