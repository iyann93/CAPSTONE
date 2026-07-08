import re

with open('src/pages/dashboards/SuperAdminDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove from features
content = content.replace('features: ["Dashboard", "Laporan Akademik", "Monitoring Siswa", "Monitoring Keuangan", "Laporan Integrasi", "Perkembangan Akademik", "Unduh Rapor"]',
                          'features: ["Dashboard", "Laporan Akademik", "Monitoring Siswa", "Monitoring Keuangan", "Perkembangan Akademik", "Unduh Rapor"]')

# 2. Remove onClick from Error Logs
content = content.replace('onClick={() => onViewChange?.("Laporan Integrasi")} />', '/>')

# 3. Remove switch case
content = re.sub(r'case "Laporan Integrasi":\s*return <LaporanIntegrasi />;', '', content)

with open('src/pages/dashboards/SuperAdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched SuperAdminDashboard.jsx")
