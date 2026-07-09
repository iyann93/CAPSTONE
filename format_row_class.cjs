const fs = require('fs');

const dashboardPath = './src/pages/dashboards/BendaharaDashboard.jsx';
let dashContent = fs.readFileSync(dashboardPath, 'utf8');

dashContent = dashContent.replace(
  /\{row\.class\}/g,
  "{row.class?.replace('Kelas ', '')?.replace('-', ' ')}"
);

dashContent = dashContent.replace(
  />\{row\.kelas\}</g,
  ">{row.kelas?.replace('Kelas ', '')?.replace('-', ' ')}<"
);

fs.writeFileSync(dashboardPath, dashContent);
console.log("SUCCESS");
