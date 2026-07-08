import re

with open('src/pages/dashboards/KepalaSekolahHome.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the Agenda block
start_str = '{/* Agenda & Perhatian Khusus */}'
start_idx = content.find(start_str)

if start_idx != -1:
    # Find the end of the block. The block ends right before the closing div of the grid.
    # We can search for the start of the final divs:
    end_str = '      </div>\n    </div>\n  );\n};'
    end_idx = content.find(end_str)
    
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

with open('src/pages/dashboards/KepalaSekolahHome.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Perlu Ditindaklanjuti")
