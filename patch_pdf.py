import re

with open('src/pages/dashboards/GenerateRaporWali.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_pdf_code = '''  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
        const doc = new jsPDF();
        
        // Header
        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.text("LAPORAN HASIL BELAJAR", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text("Semester Ganjil Tahun Ajaran 2024/2025", 105, 26, { align: "center" });
        
        doc.setLineWidth(0.5);
        doc.line(14, 30, 196, 30);
        
        // Student Info
        doc.setFont("times", "normal");
        doc.text(Nama Siswa    : , 14, 40);
        doc.text(NISN / NIS    :  / , 14, 46);
        
        doc.text(Kelas         : , 140, 40);
        doc.text(Fase          : D (SMP), 140, 46);
        
        // A. Sikap
        doc.setFont("times", "bold");
        doc.text("A. Sikap", 14, 60);
        doc.setFontSize(16);
          const logoImg = document.getElementById("logo-sekolah-pdf");
          if (logoImg) {
              doc.addImage(logoImg, "PNG", 14, 12, 24, 24);
          }
        doc.setFont("times", "normal");'''

new_pdf_code = '''  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
        const doc = new jsPDF();
        
        try {
            const img = new Image();
            img.src = '/logo-mbs.png';
            await new Promise((resolve, reject) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/png');
                    doc.addImage(dataURL, "PNG", 14, 12, 24, 24);
                    resolve();
                };
                img.onerror = () => {
                    console.warn("Gagal memuat logo sekolah untuk PDF.");
                    resolve();
                };
            });
        } catch (e) {
            console.error("Error logo", e);
        }
        
        // Header
        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.text("LAPORAN HASIL BELAJAR", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text("Semester Ganjil Tahun Ajaran 2024/2025", 105, 26, { align: "center" });
        
        doc.setLineWidth(0.5);
        doc.line(14, 30, 196, 30);
        
        // Student Info
        doc.setFont("times", "normal");
        doc.text(Nama Siswa    : , 14, 40);
        doc.text(NISN / NIS    :  / , 14, 46);
        
        doc.text(Kelas         : , 140, 40);
        doc.text(Fase          : D (SMP), 140, 46);
        
        // A. Sikap
        doc.setFont("times", "bold");
        doc.text("A. Sikap", 14, 60);
        doc.setFont("times", "normal");'''

content = content.replace(old_pdf_code, new_pdf_code)

with open('src/pages/dashboards/GenerateRaporWali.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching completed.")
