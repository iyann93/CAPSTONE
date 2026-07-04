import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const StudentForm = ({ onBack, onSave }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get('/kelas?limit=100').then(res => {
      if (res.data && res.data.data) setClasses(res.data.data);
    }).catch(err => {
      console.error("Gagal mengambil data kelas:", err);
    });
  }, []);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    nis: "",
    nisn: "",
    jenisKelamin: "",
    agama: "",
    tempatLahir: "",
    tanggalLahir: "",
    telepon: "",
    email: "",
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    kelas: "",
    kelas_id: "",
    tahunMasuk: "2023",
    namaAyah: "",
    namaIbu: "",
    pekerjaanAyah: "",
    pekerjaanIbu: "",
    teleponOrtu: "",
    isAktif: true
  });

  const [errors, setErrors] = useState({});

  const handleSave = () => {
    // Basic validation
    const newErrors = {};
    if (!formData.namaLengkap) newErrors.namaLengkap = "Nama lengkap wajib diisi";
    if (!formData.nis) newErrors.nis = "NIS wajib diisi";
    if (!formData.nisn) newErrors.nisn = "NISN wajib diisi";
    if (!formData.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    if (!formData.agama) newErrors.agama = "Agama wajib dipilih";
    if (!formData.tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!formData.kelas_id) newErrors.kelas = "Kelas wajib dipilih";
    if (!formData.namaAyah) newErrors.namaAyah = "Nama ayah wajib diisi";
    if (!formData.namaIbu) newErrors.namaIbu = "Nama ibu wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Harap lengkapi semua field yang berbintang (*) terlebih dahulu.");
      return;
    }

    // Determine tingkat and jurusan
    let tingkat = "Kelas X";
    if (formData.kelas.startsWith("XI ") || formData.kelas.startsWith("XI")) tingkat = "Kelas XI";
    if (formData.kelas.startsWith("XII ") || formData.kelas.startsWith("XII")) tingkat = "Kelas XII";


    const initials = formData.namaLengkap
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    // Random colors
    const colors = ["bg-[#3B82F6]", "bg-[#10B981]", "bg-[#F59E0B]", "bg-[#EF4444]", "bg-[#8B5CF6]", "bg-[#EC4899]"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const matchedKelasId = formData.kelas_id;

    const newStudent = {
      id: Date.now(),
      name: formData.namaLengkap,
      email: formData.email || `${formData.namaLengkap.toLowerCase().replace(/\s+/g, ".")}@student.mbsprambanan.sch.id`,
      nis: formData.nis,
      nisn: formData.nisn,
      kelas: formData.kelas,
      kelas_id: matchedKelasId,
      tingkat,
      gender: formData.jenisKelamin,
      nilaiRataRata: 0.0,
      kehadiran: 100,
      status: formData.isAktif ? "Aktif" : "Tidak Aktif",
      avatarColor,
      initials,
      // store detail fields as well for editing
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

    onSave(newStudent);
  };

  const getInitials = () => {
    if (!formData.namaLengkap) return "?";
    return formData.namaLengkap
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center text-[13px] text-gray-500 gap-2">
          <span>Dashboard</span>
          <span>›</span>
          <span>Data Siswa</span>
          <span>›</span>
          <span className="font-bold text-[#1e293b]">Tambah Siswa</span>
        </div>

        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-[#1e293b] shadow-sm transition-colors mt-0.5 flex-shrink-0"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b]">Tambah Siswa Baru</h1>
            <p className="text-gray-500 text-[15px] mt-1">
              Lengkapi data pribadi dan akademik siswa baru.
            </p>
          </div>
        </div>
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
                <input 
                  type="text" 
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  placeholder="Nama lengkap sesuai ijazah" 
                  className={`w-full px-4 py-2.5 border ${errors.namaLengkap ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`} 
                />
                {errors.namaLengkap && <p className="text-red-500 text-xs mt-0.5">{errors.namaLengkap}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">NIS (Nomor Induk Siswa)<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  placeholder="cth. 2023001" 
                  className={`w-full px-4 py-2.5 border ${errors.nis ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`} 
                />
                {errors.nis && <p className="text-red-500 text-xs mt-0.5">{errors.nis}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">NISN (Nomor Induk Siswa Nasional)<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  placeholder="10 digit angka" 
                  className={`w-full px-4 py-2.5 border ${errors.nisn ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`} 
                />
                {errors.nisn && <p className="text-red-500 text-xs mt-0.5">{errors.nisn}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Jenis Kelamin<span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, jenisKelamin: "L" })}
                    className={`flex-1 py-2.5 border rounded-xl text-[14px] font-medium transition-all ${formData.jenisKelamin === 'L' ? 'bg-[#3B82F6] border-[#3B82F6] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Laki-laki
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, jenisKelamin: "P" })}
                    className={`flex-1 py-2.5 border rounded-xl text-[14px] font-medium transition-all ${formData.jenisKelamin === 'P' ? 'bg-[#3B82F6] border-[#3B82F6] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Perempuan
                  </button>
                </div>
                {errors.jenisKelamin && <p className="text-red-500 text-xs mt-0.5">{errors.jenisKelamin}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Agama<span className="text-red-500">*</span></label>
                <select 
                  value={formData.agama}
                  onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${errors.agama ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`}
                >
                  <option value="">Pilih Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
                {errors.agama && <p className="text-red-500 text-xs mt-0.5">{errors.agama}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Tempat Lahir</label>
                <input 
                  type="text" 
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  placeholder="Kota tempat lahir" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Tanggal Lahir<span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${errors.tanggalLahir ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`} 
                />
                {errors.tanggalLahir && <p className="text-red-500 text-xs mt-0.5">{errors.tanggalLahir}</p>}
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
                <label className="text-[13px] font-bold text-gray-700">No. Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="08xxxxxxxxxx" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@contoh.com" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Alamat Lengkap</label>
                <input 
                  type="text" 
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jalan, nomor rumah, RT/RW" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Kelurahan</label>
                <input 
                  type="text" 
                  value={formData.kelurahan}
                  onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Kecamatan</label>
                <input 
                  type="text" 
                  value={formData.kecamatan}
                  onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Kota / Kabupaten</label>
                <input 
                  type="text" 
                  value={formData.kota}
                  onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Provinsi</label>
                <input 
                  type="text" 
                  value={formData.provinsi}
                  onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                  placeholder="DKI Jakarta" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
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
                  value={formData.kelas_id}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const found = classes.find(c => String(c.id) === selectedId);
                    setFormData({ 
                      ...formData, 
                      kelas_id: selectedId,
                      kelas: found ? found.nama_kelas : "" 
                    });
                  }}
                  className={`w-full px-4 py-2.5 border ${errors.kelas ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`}
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.nama_kelas}</option>
                  ))}
                </select>
                {errors.kelas && <p className="text-red-500 text-xs mt-0.5">{errors.kelas}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Tahun Masuk</label>
                <input 
                  type="text" 
                  value={formData.tahunMasuk}
                  onChange={(e) => setFormData({ ...formData, tahunMasuk: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
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
                <input 
                  type="text" 
                  value={formData.namaAyah}
                  onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${errors.namaAyah ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`} 
                />
                {errors.namaAyah && <p className="text-red-500 text-xs mt-0.5">{errors.namaAyah}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Nama Ibu<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.namaIbu}
                  onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${errors.namaIbu ? 'border-red-500' : 'border-gray-200'} rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white`} 
                />
                {errors.namaIbu && <p className="text-red-500 text-xs mt-0.5">{errors.namaIbu}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Pekerjaan Ayah</label>
                <input 
                  type="text" 
                  value={formData.pekerjaanAyah}
                  onChange={(e) => setFormData({ ...formData, pekerjaanAyah: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700">Pekerjaan Ibu</label>
                <input 
                  type="text" 
                  value={formData.pekerjaanIbu}
                  onChange={(e) => setFormData({ ...formData, pekerjaanIbu: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white text-[#1e293b]" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold text-gray-700">No. Telepon Orang Tua</label>
                <input 
                  type="text" 
                  value={formData.teleponOrtu}
                  onChange={(e) => setFormData({ ...formData, teleponOrtu: e.target.value })}
                  placeholder="08xxxxxxxxxx" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors bg-white" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="w-full xl:w-[340px] space-y-6">
          {/* Pratinjau Siswa */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-6">Pratinjau Siswa</h3>
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-[72px] h-[72px] bg-[#94A3B8] rounded-[20px] flex items-center justify-center text-white text-[28px] font-bold mb-4 shadow-sm">
                {getInitials()}
              </div>
              <h4 className="text-[15px] font-bold text-[#1e293b] text-center">{formData.namaLengkap || "Nama Siswa"}</h4>
              <p className="text-[12px] text-gray-400 font-mono mt-0.5">{formData.nis ? `${formData.nis} / ${formData.nisn || "—"}` : "—"}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Jenis Kelamin</span>
                <span className="font-bold text-[#1e293b]">{formData.jenisKelamin === 'L' ? 'Laki-laki' : formData.jenisKelamin === 'P' ? 'Perempuan' : '—'}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Agama</span>
                <span className="font-bold text-[#1e293b]">{formData.agama || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Kelas</span>
                <span className="font-bold text-[#1e293b]">{formData.kelas || '—'}</span>
              </div>

              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Tahun Masuk</span>
                <span className="font-bold text-[#1e293b]">{formData.tahunMasuk || '2023'}</span>
              </div>
            </div>
          </div>

          {/* Status Siswa */}
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Status Siswa</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-[#1e293b]">{formData.isAktif ? "Aktif" : "Tidak Aktif"}</p>
                <p className="text-[12px] text-gray-500">Siswa aktif terdaftar</p>
              </div>
              <div 
                onClick={() => setFormData({ ...formData, isAktif: !formData.isAktif })}
                className="relative inline-block w-11 h-6 select-none cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={formData.isAktif}
                  readOnly
                  className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${formData.isAktif ? 'border-[#3B82F6] translate-x-5' : 'border-gray-300 translate-x-0'}`} 
                  style={{ zIndex: 1 }} 
                />
                <label className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${formData.isAktif ? 'bg-[#3B82F6]' : 'bg-gray-300'}`}></label>
              </div>
            </div>
          </div>

          {/* Warning Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-[16px] p-4 flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-[12px] text-orange-800 leading-relaxed">
              Pastikan NIS dan NISN benar dan tidak duplikat. Data ini akan digunakan untuk seluruh sistem akademik.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button 
              onClick={handleSave}
              className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-[12px] text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Simpan Data Siswa
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

export default StudentForm;
