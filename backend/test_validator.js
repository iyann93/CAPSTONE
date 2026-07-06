const { body, validationResult } = require('express-validator');
const express = require('express');
const app = express();
app.use(express.json());

const createNilaiValidator = [
  body('siswaId').notEmpty().withMessage('Siswa wajib diisi').isUUID().withMessage('Siswa ID tidak valid'),
  body('mataPelajaranId').notEmpty().withMessage('Mata pelajaran wajib diisi').isUUID().withMessage('Mata Pelajaran ID tidak valid'),
  body('semesterId').notEmpty().withMessage('Semester wajib diisi').isUUID().withMessage('Semester ID tidak valid'),
  body('nilaiHarian').notEmpty().withMessage('Nilai Tugas/Harian wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('nilaiUts').notEmpty().withMessage('Nilai UTS wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('nilaiUas').notEmpty().withMessage('Nilai UAS wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('catatan').optional().isString()
];

app.post('/test', createNilaiValidator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.json({ success: true });
});

const request = require('supertest');

async function run() {
  const payload = {
    siswaId: 'e28a55cd-51be-4972-8785-5b8f67385a4a', // UUID
    mataPelajaranId: '7034fc60-28e5-4cb8-9de6-0b32b7934d42',
    semesterId: '00000002-0000-0000-0000-000000000001',
    nilaiHarian: 0,
    nilaiUts: 0,
    nilaiUas: 0,
    catatan: ''
  };

  const res = await request(app).post('/test').send(payload);
  console.log(res.body);
}

run();
