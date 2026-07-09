require('dotenv').config();
const db = require('./src/config/db');

async function debugRekap() {
  const dbClasses = (await db.query('SELECT * FROM academic.kelas')).rows;
  const dbSiswaData = (await db.query('SELECT * FROM academic.siswa')).rows;
  const dbAbsensi = (await db.query('SELECT id, siswa_id, tanggal, status FROM academic.absensi')).rows;
  const dbNilai = (await db.query('SELECT * FROM academic.nilai')).rows;

  const classMap = {};
  dbClasses.forEach((cls) => {
    classMap[cls.nama_kelas] = {};
  });

  dbSiswaData.forEach((siswa) => {
    const cls = dbClasses.find((c) => c.id === siswa.kelas_id);
    const className = cls ? cls.nama_kelas : "Tanpa Kelas";
    
    if (!classMap[className]) {
      classMap[className] = {};
    }

    classMap[className][siswa.id] = {
      id: siswa.id,
      name: siswa.nama_lengkap,
      className,
      hadir: 0,
      izin: 0,
      sakit: 0,
      harian: "-",
      uts: "-",
      uas: "-"
    };
  });

  const sessionCountsMap = {};

  dbAbsensi.forEach(record => {
    let foundStudent = null;
    let classNameForStudent = "Tanpa Kelas";
    
    for (const [cName, students] of Object.entries(classMap)) {
      if (students[record.siswa_id]) {
        foundStudent = students[record.siswa_id];
        classNameForStudent = cName;
        break;
      }
    }
    
    if (foundStudent) {
      if (record.status === "Hadir") foundStudent.hadir++;
      else if (record.status === "Izin") foundStudent.izin++;
      else if (record.status === "Sakit") foundStudent.sakit++;
    }
  });

  Object.values(classMap).forEach(clsStudents => {
    Object.values(clsStudents).forEach(stu => {
      const studentGrades = dbNilai.filter(n => n.siswa_id === stu.id);
      if (studentGrades.length > 0) {
        const sumHarian = studentGrades.reduce((sum, n) => sum + parseFloat(n.nilai_harian || 0), 0);
        const sumUts = studentGrades.reduce((sum, n) => sum + parseFloat(n.nilai_uts || 0), 0);
        const sumUas = studentGrades.reduce((sum, n) => sum + parseFloat(n.nilai_uas || 0), 0);
        
        stu.harian = parseFloat((sumHarian / studentGrades.length).toFixed(1));
        stu.uts = parseFloat((sumUts / studentGrades.length).toFixed(1));
        stu.uas = parseFloat((sumUas / studentGrades.length).toFixed(1));
      }
    });
  });

  console.log('--- RESULT FOR KELAS VII ---');
  const vii = classMap['Kelas VII'];
  if (vii) {
    Object.values(vii).forEach(stu => {
      console.log(`${stu.name}: Hadir=${stu.hadir} Harian=${stu.harian} UTS=${stu.uts} UAS=${stu.uas}`);
    });
  } else {
    console.log('Kelas VII not found in classMap!');
  }

  process.exit(0);
}
debugRekap();
