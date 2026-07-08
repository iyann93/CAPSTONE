with open('src/pages/dashboards/RekapAbsensiSiswa.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">',
    '{!isEmbedded && (<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">'
)
content = content.replace(
    '<button\n            onClick={() => setDbSessionCounts',
    '</div>)}\n        <button\n            onClick={() => setDbSessionCounts'
)

# Wait, if I do this blind replace, it might fail or break syntax if the layout isn't exactly what I thought.
# Let me just check the exact lines.
