import { useState } from "react";
const CheckShieldIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-500">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>;
const SaveIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>;
const ShieldIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 11v3" />
    <circle cx="12" cy="10" r="1" />
  </svg>;
const InfoCard = ({ icon, title, description }) => <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 relative overflow-hidden transition-all">
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold text-[14px] mb-1 leading-snug">{title}</h4>
        <p className="text-white/60 text-[12px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>;
const ResetPassword = ({ onBack, onSave }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return <div className="flex flex-col-reverse lg:flex-row min-h-screen w-full bg-white font-sans relative overflow-x-hidden overflow-y-auto">
      {
    /* Left Side (Form) */
  }
      <div className="w-full lg:w-[40%] min-h-[100dvh] lg:min-h-screen bg-white flex flex-col p-6 sm:p-8 lg:px-20 xl:px-24 py-10 lg:py-16 justify-between relative z-10 border-r border-gray-100">
        
        {
    /* Header Logo */
  }
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-[#1A3D63] rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-xl leading-none">S</span>
          </div>
          <span className="text-gray-900 font-bold text-[13px] tracking-wide">SMA NUSANTARA</span>
        </div>

        {
    /* Form Container */
  }
        <div className="max-w-[400px] w-full mx-auto relative z-10 my-auto pt-12 lg:pt-16 pb-12">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-50 rounded-full flex items-center justify-center mb-4 lg:mb-6">
            <CheckShieldIcon />
          </div>
          <h1 className="text-gray-900 text-[28px] lg:text-[32px] font-bold mb-2 lg:mb-3 tracking-tight">Buat Password Baru</h1>
          <p className="text-gray-400 text-[13px] leading-relaxed mb-10 pr-4">
            Silakan masukkan password baru Anda. Pastikan kombinasi password kuat dan mudah Anda ingat.
          </p>

          <div className="space-y-6">
            <div className="relative group/field">
              <label className="block text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-wider">
                Password Baru
              </label>
              <div className="relative border-b border-gray-400 focus-within:border-gray-800 pb-2 transition-colors">
                <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-transparent text-gray-900 focus:outline-none text-[15px] tracking-widest font-bold placeholder:text-gray-300 placeholder:tracking-widest"
    placeholder="••••••••"
  />
              </div>
            </div>

            <div className="relative group/field">
              <label className="block text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-wider">
                Konfirmasi Password Baru
              </label>
              <div className="relative border-b border-gray-400 focus-within:border-gray-800 pb-2 transition-colors">
                <input
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full bg-transparent text-gray-900 focus:outline-none text-[15px] tracking-widest font-bold placeholder:text-gray-300 placeholder:tracking-widest"
    placeholder="••••••••"
  />
              </div>
            </div>

            {
    /* Password Strength Indicator */
  }
            <div className="pt-2 pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kekuatan Password:</span>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Kuat</span>
              </div>
              <div className="flex gap-1.5 mb-2">
                <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-400">Gunakan minimal 8 karakter dengan kombinasi huruf, angka, & simbol.</p>
            </div>

            <button
    onClick={() => onSave(password)}
    className="w-full bg-[#1A3D63] hover:bg-[#122A44] text-white font-bold py-3.5 rounded-[16px] transition-all shadow-[0_10px_30px_-10px_rgba(26,61,99,0.3)] active:scale-[0.98] mt-2 flex items-center justify-center text-[14px]"
  >
              <SaveIcon />
              Simpan Password Baru
            </button>
          </div>
        </div>

        {
    /* Bottom Actions */
  }
        <div className="w-full mx-auto">
          <div className="border-t border-gray-300 w-full mb-6" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[12px]">Ingat kata sandi lama Anda?</span>
            <button
    onClick={onBack}
    className="bg-[#4B7DA3] hover:bg-[#3d6a8b] text-white font-bold py-2.5 px-6 rounded-lg transition-all text-[12px]"
  >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>

      {
    /* Right Side: Info Section */
  }
      <div className="w-full lg:w-[60%] min-h-[100dvh] lg:min-h-screen bg-[#1F3A5F] relative flex flex-col p-8 lg:p-20 xl:p-24 justify-center overflow-hidden">
        
        {
    /* Custom Decorative Assets from User */
  }
        <img
    src="/bg-blur.png"
    alt=""
    className="absolute top-[5%] right-[-10%] w-[600px] lg:w-[800px] opacity-[0.85] pointer-events-none mix-blend-screen"
  />
        <img
    src="/Overlay-Blur.png"
    alt=""
    className="absolute bottom-[10%] left-[-10%] w-[500px] lg:w-[700px] opacity-[0.65] pointer-events-none mix-blend-screen"
  />
        
        <div className="relative z-10 max-w-[550px]">
          <h2 className="text-white text-[36px] md:text-[48px] lg:text-[64px] font-bold leading-[1.1] lg:leading-[1.05] tracking-tight mb-3 lg:mb-4">
            Keamanan Akses <br className="hidden md:block" /> Akun
          </h2>
          <p className="text-white/70 text-[14px] lg:text-[15px] mb-8 lg:mb-12">Langkah terakhir mengamankan kembali akun Anda</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="text-white">
              <ShieldIcon />
            </div>
            <h3 className="text-white text-[16px] font-bold">Tips Keamanan Akun</h3>
          </div>

          <div className="flex flex-col gap-3">
            <InfoCard
    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M9 15h6" />
                </svg>}
    title="Hindari Password Mudah Ditebak"
    description="Jangan gunakan tanggal lahir, nama hewan peliharaan, atau kata berurutan seperti '123456' sebagai kata sandi Anda."
  />
            <InfoCard
    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>}
    title="Gunakan Perangkat Pribadi"
    description="Lakukan pergantian kata sandi hanya pada perangkat pribadi yang Anda percayai. Hindari menggunakan warnet atau perangkat publik."
  />
            <InfoCard
    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>}
    title="Rahasiakan Password Anda"
    description="Pihak sekolah atau admin SIAKAD tidak akan pernah menanyakan password Anda. Jangan bagikan password kepada siapapun."
  />
          </div>
        </div>
      </div>
    </div>;
};
var ResetPassword_default = ResetPassword;
export {
  ResetPassword_default as default
};
