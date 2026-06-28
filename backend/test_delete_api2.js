const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function run() {
  try {
    // Generate a valid token
    const token = jwt.sign(
      { userId: '4c735dce-a4a5-48fa-8cf1-7001db10bb57', role: 'Superadmin' }, 
      process.env.JWT_SECRET || 'secret_key', 
      { expiresIn: '1h' }
    );

    // Make the exact request the frontend makes
    const res = await axios.delete('http://localhost:5000/api/v1/finance/spp/batal-bulanan', {
      headers: { Authorization: `Bearer ${token}` },
      data: { bulan: 8, tahun: 2026 }
    });
    
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
run();
