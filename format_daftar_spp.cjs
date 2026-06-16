const fs = require('fs');

const dashboardPath = './src/pages/dashboards/BendaharaDashboard.jsx';
let dashContent = fs.readFileSync(dashboardPath, 'utf8');

// The specific lines inside Daftar Pengaturan SPP:
// Original:
// {item.grade}
// <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded ml-2">TA {item.ta}</span>
//
// {item.amount}/bln • Berlaku:

dashContent = dashContent.replace(
  /\{item\.grade\}\s*<span className="text-\[11px\]/g,
  "{item.grade.replace('-', ' ')}\n                                <span className=\"text-[11px]"
);

dashContent = dashContent.replace(
  /\{item\.amount\}\/bln/g,
  "{item.amount.replace('Rp ', '')}/bln"
);

fs.writeFileSync(dashboardPath, dashContent);
console.log("SUCCESS");
