with open('src/pages/dashboards/PersetujuanKurikulum.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove lines 161 to 183 (index 160 to 183)
new_lines = lines[:160] + lines[183:]

with open('src/pages/dashboards/PersetujuanKurikulum.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Removed lines 161 to 183")
