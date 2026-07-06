import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const StudentEdit = ({ student, onBack, onSave, onDelete }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get('/kelas?limit=100').then(res => {
      if (res.data && res.data.data) setClasses(res.data.data);
    }).catch(err => {
      console.error("Gagal mengambil data kelas:", err);
    });
  }, []);

  const [formData, setFormData] = useState({
    namaLengkap: student.name,
    nis: student.nis,
    nisn: student.nisn,
    jenisKelamin: student.gender,
    agama: "Islam",
    tempatLahir: student.tempat_lahir || "Yogyakarta",
    tanggalLahir: student.tanggal_lahir || "2006-03-15",
    telepon: "081234567890",
    email: student.email,
    alamat: "Jl. Mawar No. 12",
    kelurahan: "Kebayoran Baru",
    kecamatan: "Kebayoran Baru",
    kota: "Sleman",
    provinsi: "DI Yogyakarta",
    kelas: student.kelas,
    kelas_id: student.kelas_id,
    tahunMasuk: "2023",
    namaAyah: "Budi Pratama",
    namaIbu: "Sri Wahyuni",
    pekerjaanAyah: "Wiraswasta",
    pekerjaanIbu: "Guru",
    teleponOrtu: "081298765432",
    isAktif: student.status === "Aktif" || student.status === "aktif"
  });

  const handleSave = () => {
    // Determine tingkat and jurusan
    let tingkat = "Kelas X";
    if (formData.kelas.startsWith("XI ")) tingkat = "Kelas XI";
    if (formData.kelas.startsWith("XII ")) tingkat = "Kelas XII";


    // Initials
    const initials = formData.namaLengkap
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const matchedKelasId = formData.kelas_id || student.kelas_id;

    const updatedStudent = {
      ...student,
      name: formData.namaLengkap,
      email: formData.email,
      nis: formData.nis,
      nisn: formData.nisn,
      kelas: formData.kelas,
      kelas_id: matchedKelasId,
      tingkat,
      gender: formData.jenisKelamin,
      status: formData.isAktif ? "aktif" : "tidak_aktif",
      initials,
      // store detail fields as well
      agama: formData.agama,
      tempatLahir: formData.tempatLahir,
      tanggalLahir: formData.tanggalLahir,
      telepon: formData.telepon,
      alamat: formData.alamat,
      kelurahan: formData.kelurahan,
      kecamatan: formData.kecamatan,
      kota: formData.kota,
      provinsi: formData.provinsi,
      tahunMasuk: formData.tahunMasuk,
      namaAyah: formData.namaAyah,
      namaIbu: formData.namaIbu,
      pekerjaanAyah: formData.pekerjaanAyah,
      pekerjaanIbu: formData.pekerjaanIbu,
      teleponOrtu: formData.teleponOrtu,
    };
    onSave(updatedStudent);
  };

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus siswa ${student.name}?`)) {
      onDelete(student.id);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="flex items-center text-[13px] text-gray-500 gap-2">
            <span>Dashboard</span>
            <span>›</span>
            <span>Data Siswa</span>
            <span>›</span>
            <span>{student.name}</span>
            <span>›</span>
            <span className="font-bold text-[#1e293b]">Edit</span>
          </div>

          <div className="flex items-start gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-[#1e293b] shadow-sm transition-colors mt-0.5 flex-shrink-0"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-bold text-[#1e293b]">Edit Data Siswa</h1>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[12px] font-mono mt-1">{student.nis}</span>
              </div>
              <p className="text-gray-500 text-[15px] mt-1">
                Perubahan akan berlaku di seluruh sistem setelah disimpan.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-[14px] font-bold hover:bg-red-50 transition-colors mt-6 md:mt-0"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          Hapus Siswa
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-6">
          {/* Identitas Pribadi */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Identitas Pribadi</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Nama Lengkap<span className="text-red-500">*</span></label>
                <input type="text" value={formData.namaLengkap} onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">NIS<span className="text-red-500">*</span></label>
                <input type="text" value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">NISN<span className="text-red-500">*</span></label>
                <input type="text" value={formData.nisn} onChange={(e) => setFormData({...formData, nisn: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Jenis Kelamin<span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                  <button onClick={() => setFormData({...formData, jenisKelamin: "L"})} className={`flex-1 py-2.5 border rounded-xl text-[14px] font-medium transition-colors ${formData.jenisKelamin === 'L' ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'border-gray-200 text-gray-600'}`}>Laki-laki</button>
                  <button onClick={() => setFormData({...formData, jenisKelamin: "P"})} className={`flex-1 py-2.5 border rounded-xl text-[14px] font-medium transition-colors ${formData.jenisKelamin === 'P' ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'border-gray-200 text-gray-600'}`}>Perempuan</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Agama<span className="text-red-500">*</span></label>
                <select value={formData.agama} onChange={(e) => setFormData({...formData, agama: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white appearance-none">
                  <option>Islam</option>
                  <option>Kristen</option>
                  <option>Katolik</option>
                  <option>Hindu</option>
                  <option>Buddha</option>
                  <option>Konghucu</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Tempat Lahir</label>
                <input type="text" value={formData.tempatLahir} onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Tanggal Lahir<span className="text-red-500">*</span></label>
                <input type="date" value={formData.tanggalLahir} onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" />
              </div>
            </div>
          </div>

          {/* Kontak & Alamat */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Kontak & Alamat</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">No. Telepon</label>
                <input type="text" value={formData.telepon} onChange={(e) => setFormData({...formData, telepon: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Alamat</label>
                <input type="text" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Kelurahan</label>
                <input type="text" value={formData.kelurahan} onChange={(e) => setFormData({...formData, kelurahan: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Kecamatan</label>
                <input type="text" value={formData.kecamatan} onChange={(e) => setFormData({...formData, kecamatan: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Kota</label>
                <input type="text" value={formData.kota} onChange={(e) => setFormData({...formData, kota: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Provinsi</label>
                <input type="text" value={formData.provinsi} onChange={(e) => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
            </div>
          </div>

          {/* Data Akademik */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Data Akademik</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Kelas<span className="text-red-500">*</span></label>
                <select 
                  value={formData.kelas_id || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const found = classes.find(c => c.id === selectedId);
                    setFormData({ 
                      ...formData, 
                      kelas_id: selectedId,
                      kelas: found ? found.nama_kelas : "" 
                    });
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white appearance-none"
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.nama_kelas}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Tahun Masuk</label>
                <input type="text" value={formData.tahunMasuk} onChange={(e) => setFormData({...formData, tahunMasuk: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
            </div>
          </div>

          {/* Data Orang Tua / Wali */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <h3 className="text-[15px] font-bold text-[#1e293b]">Data Orang Tua / Wali</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Nama Ayah<span className="text-red-500">*</span></label>
                <input type="text" value={formData.namaAyah} onChange={(e) => setFormData({...formData, namaAyah: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Nama Ibu<span className="text-red-500">*</span></label>
                <input type="text" value={formData.namaIbu} onChange={(e) => setFormData({...formData, namaIbu: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Pekerjaan Ayah</label>
                <input type="text" value={formData.pekerjaanAyah} onChange={(e) => setFormData({...formData, pekerjaanAyah: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Pekerjaan Ibu</label>
                <input type="text" value={formData.pekerjaanIbu} onChange={(e) => setFormData({...formData, pekerjaanIbu: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold text-gray-700">No. Telepon Orang Tua</label>
                <input type="text" value={formData.teleponOrtu} onChange={(e) => setFormData({...formData, teleponOrtu: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" />
              </div>
            </div>
          </div>

          {/* Riwayat Perubahan */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#1e293b]">Riwayat Perubahan</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0">SR</div>
                <div>
                  <p className="text-[13px] font-bold text-[#1e293b]">Siti Rahayu</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Memperbarui nomor telepon dan alamat</p>
                  <p className="text-[11px] text-gray-400 mt-1">10 Nov 2023 · 09:15</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0">AS</div>
                <div>
                  <p className="text-[13px] font-bold text-[#1e293b]">Admin Sistem</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Data siswa pertama kali dimasukkan</p>
                  <p className="text-[11px] text-gray-400 mt-1">12 Jul 2023 · 08:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="w-full xl:w-[320px] space-y-6">
          {/* Pratinjau Profil */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 flex flex-col items-center">
            <div 
              className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center text-white text-[28px] font-bold mb-4 shadow-sm"
              style={{ backgroundColor: student.avatarColor }}
            >
              {student.initials}
            </div>
            <h4 className="text-[16px] font-bold text-[#1e293b] text-center">{student.name}</h4>
            <p className="text-[13px] text-gray-500 mt-1 text-center">{student.nis} - {student.kelas}</p>
          </div>

          {/* Status Siswa */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#1e293b]">Status Siswa</p>
              <p className="text-[12px] text-gray-500">Aktif terdaftar</p>
            </div>
            <div className="relative inline-block w-11 h-6 select-none cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isAktif}
                onChange={() => setFormData({...formData, isAktif: !formData.isAktif})}
                className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${formData.isAktif ? 'border-[#3B82F6] translate-x-5' : 'border-gray-300 translate-x-0'}`} 
                style={{ zIndex: 1 }} 
              />
              <label className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${formData.isAktif ? 'bg-[#3B82F6]' : 'bg-gray-300'}`}></label>
            </div>
          </div>

          {/* Informasi Data */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Terdaftar</span>
                <span className="font-medium text-[#1e293b]">12 Jul 2023</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Nilai Rata-rata</span>
                <span className="font-bold text-blue-500">{student.nilaiRataRata}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Kehadiran</span>
                <span className="font-bold text-emerald-500">{student.kehadiran}%</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Ranking</span>
                <span className="font-bold text-purple-600">#3</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <button 
              onClick={handleSave}
              className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-[12px] text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Simpan Perubahan
            </button>
            <button 
              onClick={onBack}
              className="w-full py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-[12px] text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEdit;
