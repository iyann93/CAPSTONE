import re

with open('src/pages/dashboards/KepalaSekolahHome.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new states
state_old = '''  const [financialData, setFinancialData] = useState({
    pemasukanBulanIni: 0,
    pengeluaranBulanIni: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0
  });

  useEffect(() => {
    const fetchFinance = async () => {'''

state_new = '''  const [financialData, setFinancialData] = useState({
    pemasukanBulanIni: 0,
    pengeluaranBulanIni: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalSiswa: 0,
    calonLulusan: 0,
    pengajuanKurikulum: 2 // based on mock data in PersetujuanKurikulum
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const res = await api.get('/siswa');
        const siswa = res.data?.data || [];
        const ixCount = siswa.filter(s => s.nama_kelas?.toUpperCase().includes('IX')).length;
        
        setDashboardStats(prev => ({
          ...prev,
          totalSiswa: siswa.length,
          calonLulusan: ixCount
        }));
      } catch (err) {
        console.error("Gagal load siswa:", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchFinance = async () => {'''
content = content.replace(state_old, state_new)

# Update HTML values
# 3 Pengajuan Kurikulum -> {dashboardStats.pengajuanKurikulum}
content = content.replace('value="3"', 'value={dashboardStats.pengajuanKurikulum}')
# 120 Calon Lulusan -> {dashboardStats.calonLulusan}
content = content.replace('value="120"', 'value={dashboardStats.calonLulusan}')
# 1,248 Total Siswa -> {dashboardStats.totalSiswa.toLocaleString()}
content = content.replace('value="1,248"', 'value={dashboardStats.totalSiswa.toLocaleString()}')

# Update hardcoded list at bottom
content = content.replace('3 Pengajuan Kurikulum', '{dashboardStats.pengajuanKurikulum} Pengajuan Kurikulum')
content = content.replace('120 Calon Lulusan', '{dashboardStats.calonLulusan} Calon Lulusan')

with open('src/pages/dashboards/KepalaSekolahHome.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched KepalaSekolahHome.jsx")
