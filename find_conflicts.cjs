const fs = require('fs');
const lines = fs.readFileSync('src/pages/dashboards/BendaharaDashboard.jsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (line.includes('<<<<<<< HEAD')) {
    console.log(`Conflict at line ${i + 1}`);
  }
});
