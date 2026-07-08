import re

with open('src/pages/dashboards/RaporSiswa.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace('import React, { useState } from "react";', 'import React, { useState } from "react";\nimport jsPDF from "jspdf";\nimport "jspdf-autotable";')

# Replace handleDownload
old_download = '''  const handleDownload = (rapor) => {
    if (rapor.status !== "Tersedia") return;
    setDownloading(rapor.id);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(prev => [...prev, rapor.id]);
      alert(? Rapor  berhasil diunduh!);
    }, 2000);
  };'''

new_download = '''  const handleDownload = async (rapor) => {
    if (rapor.status !== "Tersedia") return;
    setDownloading(rapor.id);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("SMP MUHAMMADIYAH PRAMBANAN", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("LAPORAN HASIL BELAJAR SISWA", 105, 28, { align: "center" });
        
        // Info Siswa
        doc.setFontSize(10);
        doc.text(Nama Siswa    : , 20, 45);
        doc.text(Kelas         : , 20, 52);
        doc.text(Semester      : , 20, 59);
        doc.text(Tanggal Rilis : , 20, 66);
        
        // Mock Table Data
        doc.autoTable({
          startY: 75,
          head: [['No', 'Mata Pelajaran', 'Nilai Akhir', 'Predikat', 'Keterangan']],
          body: [
            ['1', 'Pendidikan Agama Islam', '88', 'B', 'Tuntas'],
            ['2', 'Pendidikan Pancasila', '85', 'B', 'Tuntas'],
            ['3', 'Bahasa Indonesia', '90', 'A', 'Tuntas'],
            ['4', 'Matematika', '78', 'C', 'Tuntas'],
            ['5', 'Ilmu Pengetahuan Alam', '82', 'B', 'Tuntas'],
          ],
          theme: 'grid',
          headStyles: { fillColor: [26, 61, 99] }
        });
        
        const finalY = doc.lastAutoTable.finalY || 130;
        doc.setFont("helvetica", "bold");
        doc.text(Rata-rata Kelas : , 20, finalY + 10);
        doc.text(Peringkat Kelas : , 20, finalY + 17);
        
        doc.save(Rapor__.pdf);
        
        setDownloaded(prev => [...prev, rapor.id]);
        alert(Rapor  berhasil diunduh!);
      } catch (err) {
        alert("Gagal membuat PDF");
        console.error(err);
      } finally {
        setDownloading(null);
      }
    }, 1000);
  };'''

content = content.replace(old_download, new_download)

with open('src/pages/dashboards/RaporSiswa.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching RaporSiswa completed.")
