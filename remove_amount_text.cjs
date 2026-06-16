const fs = require('fs');

const dashboardPath = './src/pages/dashboards/BendaharaDashboard.jsx';
let dashContent = fs.readFileSync(dashboardPath, 'utf8');

dashContent = dashContent.replace(
  /\{item\.amount\.replace\('Rp ', ''\)\}\/bln \· Berlaku/g,
  "Berlaku"
);

fs.writeFileSync(dashboardPath, dashContent);
console.log("SUCCESS");
