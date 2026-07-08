import re

with open('src/pages/dashboards/PersetujuanKurikulum.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_str = '                <div className="bg-blue-50/50 hover:bg-blue-50 p-4 rounded-xl border border-blue-100 hover:border-blue-200 transition-all flex items-center justify-between cursor-pointer group">'
end_str = '              {/* Modal Footer / Actions */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open('src/pages/dashboards/PersetujuanKurikulum.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Lampiran")
