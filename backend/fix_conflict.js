const fs = require('fs');

function fixCatatanSiswa() {
  const filePath = 'c:/Users/Lenovo/Downloads/CAPSTONE/src/pages/dashboards/CatatanSiswa.jsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Conflict 1: lines 1 to 108 (approx)
  // We will keep the remote version (======= to >>>>>>>) but we need to add saveSuccess state.
  // Actually, I'll just regex replace the blocks.

  // Block 1: Imports and state
  content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n/m, '');
  content = content.replace(/>>>>>>> b7de6e958f516ccc642a2b491e40f3e544911fa2\r?\n/g, '');

  // Add saveSuccess state if it's missing in the kept remote version
  if (!content.includes('saveSuccess')) {
    content = content.replace('const [notification, setNotification] = useState(null);', 'const [saveSuccess, setSaveSuccess] = useState(false);');
  } else {
    // Wait, the kept remote version has:
    // const [selectedStudentId, setSelectedStudentId] = useState("");
    // const [notification, setNotification] = useState(null);
    content = content.replace('const [notification, setNotification] = useState(null);', 'const [saveSuccess, setSaveSuccess] = useState(false);');
  }

  // Conflict 2: handleSave
  // <<<<<<< HEAD
  //     // Save to localStorage immediately
  // ...
  // =======
  //     setNotification(`Catatan ...
  // >>>>>>> ...
  content = content.replace(/<<<<<<< HEAD\r?\n\s*\/\/ Save to localStorage immediately[\s\S]*?=======\r?\n/m, '    setSaveSuccess(true);\n\n/* ======= REMOVED ======= */\n');
  content = content.replace(/\/\* ======= REMOVED ======= \*\/[\s\S]*?>>>>>>> [a-f0-9]{40}\r?\n/m, ''); // remove the remote notification part

  // Conflict 3: notification render
  // <<<<<<< HEAD
  //       {/* Header */}
  // =======
  //       {notification && ReactDOM.createPortal( ... )}
  // >>>>>>> ...
  content = content.replace(/<<<<<<< HEAD\r?\n\s*\{\/\* Header \*\/\}\r?\n=======\r?\n[\s\S]*?>>>>>>> [a-f0-9]{40}\r?\n/m, '      {/* Header */}\n');

  // Also fix the dropdown override issue if present
  content = content.replace(/if \(classNames\.length > 0\) \{\s*setSelectedClass\(classNames\[0\]\);\s*\}/, 'if (classNames.length > 0 && !classNames.includes(selectedClass)) {\n          setSelectedClass(classNames[0]);\n        }');

  // And the reset of saveSuccess on dropdown change
  // <<<<<<< HEAD
  //                   setSaveSuccess(false);
  // =======
  // >>>>>>> ...
  content = content.replace(/<<<<<<< HEAD\r?\n\s*setSaveSuccess\(false\);\r?\n=======\r?\n>>>>>>> [a-f0-9]{40}\r?\n/m, '                  setSaveSuccess(false);\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("CatatanSiswa fixed");
}

fixCatatanSiswa();
