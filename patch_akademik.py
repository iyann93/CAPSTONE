import re

with open('src/pages/dashboards/AkademikSiswa.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Bar Chart
bar_chart_block = r'''            \{\/\* Bar Chart \*\/\}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">.*?</div>
            </div>'''
# Since regex for HTML is tricky, I'll use simple string replace or split
