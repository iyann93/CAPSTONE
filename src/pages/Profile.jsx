import React, { useState } from 'react';

const UploadIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
</svg>;
const TrashIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
</svg>;
const EmailIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
</svg>;
const PhoneIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
</svg>;
const MapPinIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
</svg>;
const UserOutlineIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
</svg>;
const ShieldIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2 text-[#1A3D63]">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
</svg>;
const SaveIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
</svg>;
const KeyIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
</svg>;
const Profile = ({ user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isWali = user?.role === "Wali Kelas";

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || (isWali ? "Asih Kinanti, S.Pd" : "Siti Aminah"),
    email: isWali ? "asih.kinanti@siakad.id" : "siti.keuangan@siakad.id",
    phone: isWali ? "+62 856-1234-9988" : "+62 812-3456-7890",
    address: isWali ? "Jl. Pramuka No. 45, Sleman, DI Yogyakarta 55281" : "Jl. Pendidikan No. 1, Kel. Menteng, Jakarta Pusat 10310",
    nip: isWali ? "198807152010012015" : "198507232010011015"
  });
  const [formData, setFormData] = useState(profileData);

  const handleSave = () => {
    setIsSaving(true);
    // Simulasi proses simpan
    setTimeout(() => {
      setProfileData(formData);
      setIsSaving(false);
      setShowToast(true);
      // Sembunyikan toast setelah 3 detik
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return <div className="animate-fadeIn space-y-6 pb-20">
    {/* Toast Notification */}
    {showToast && (
      <div className="fixed bottom-6 right-6 bg-[#E6F4EA] border border-[#10B981] text-[#059669] px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slideUp z-50">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        <div>
          <p className="font-bold text-sm">Berhasil Disimpan!</p>
          <p className="text-xs font-medium">Informasi profil Anda telah diperbarui.</p>
        </div>
      </div>
    )}

    {
      /* ── Page Header ── */
    }
    <div className="mb-8">
      <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight mb-1">Profil Saya</h1>
      <p className="text-[14px] text-gray-500">Kelola informasi personal dan keamanan akun Anda.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {
        /* Left Column: Profile Summary */
      }
      <div className="lg:col-span-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {
            /* Top Blue Cover */
          }
          <div className="h-32 bg-[#B3CFE5]" />

          <div className="px-6 pb-6 relative flex flex-col items-center">
            {
              /* Profile Image (Overlapping) */
            }
            <div className="relative w-24 h-24 rounded-full bg-white p-1.5 -mt-12 mb-4 shadow-sm border border-gray-100">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <svg width="40" height="40" fill="none" stroke="#D1D5DB" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1A3D63] text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-[#0A1931] shadow-sm transition-all cursor-pointer">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>

            {
              /* Name & Role */
            }
            <h2 className="text-[20px] font-bold text-[#1F2937] mb-1">{profileData.fullName}</h2>
            <p className="text-[13px] text-gray-500">{user?.role || "Pegawai"}</p>

            <div className="w-full h-px bg-gray-100 mb-6" />

            {
              /* Contact Info */
            }
            <div className="w-full space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><EmailIcon /></div>
                <span className="text-[13px] text-gray-600 font-medium">{profileData.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><PhoneIcon /></div>
                <span className="text-[13px] text-gray-600 font-medium">{profileData.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><MapPinIcon /></div>
                <span className="text-[13px] text-gray-600 font-medium leading-relaxed">{profileData.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        /* Right Column: Forms */
      }
      <div className="lg:col-span-8 space-y-6">
        {
          /* Informasi Personal */
        }
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center px-8 py-5 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-[#1F2937] flex items-center">
              <UserOutlineIcon />
              Informasi Personal
            </h3>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Nama Lengkap</label>
                <input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-5 py-3 bg-[#F9FAFB] border border-gray-100 rounded-full text-[14px] font-medium text-gray-700 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 ml-1">NIP / ID Pegawai</label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-5 py-3 bg-[#F9FAFB] border border-gray-100 rounded-full text-[14px] font-medium text-gray-700 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Email</label>
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3 bg-[#F9FAFB] border border-gray-100 rounded-full text-[14px] font-medium text-gray-700 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 ml-1">No. Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-3 bg-[#F9FAFB] border border-gray-100 rounded-full text-[14px] font-medium text-gray-700 focus:outline-none"
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Alamat Lengkap</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-5 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-[14px] font-medium text-gray-700 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-50 pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1A3D63] hover:bg-[#0A1931]'} text-white px-6 py-2.5 rounded-full font-bold text-[13px] shadow-sm transition-all flex items-center`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <SaveIcon />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
var Profile_default = Profile;
export {
  Profile_default as default
};
