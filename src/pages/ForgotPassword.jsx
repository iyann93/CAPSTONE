import { useState } from "react";
import { getLogoWideUrl } from "../utils/logo";
const MailIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="m22 6-10 7L2 6" />
  </svg>;
const ShieldIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 11v3" />
    <circle cx="12" cy="10" r="1" />
  </svg>;
const CheckShieldIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-500">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>;
const PaperPlaneIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
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
const ForgotPassword = ({ onBack, onSendInstructions }) => {
  const [email, setEmail] = useState("");
  return <div className="flex flex-col-reverse lg:flex-row min-h-screen w-full bg-white font-sans relative overflow-x-hidden overflow-y-auto">
      {
    /* Left Side (Form) */
  }
      <div className="w-full lg:w-[40%] min-h-[100dvh] lg:min-h-screen bg-white flex flex-col p-6 sm:p-8 lg:px-20 xl:px-24 py-10 lg:py-16 justify-between relative z-10 border-r border-gray-100">
        
        {
    /* Header Logo */
  }
        <div className="flex flex-wrap items-center gap-4">
          <img src={getLogoWideUrl()} alt="MBS Prambanan" className="h-16 object-contain" />
        </div>

        {
    /* Form Container */
  }
        <div className="max-w-[400px] w-full mx-auto relative z-10 my-auto pt-12 lg:pt-16 pb-12">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-50 rounded-full flex items-center justify-center mb-4 lg:mb-6">
            <CheckShieldIcon />
          </div>
          <h1 className="text-gray-900 text-[28px] lg:text-[32px] font-bold mb-2 lg:mb-3 tracking-tight">Lupa Password?</h1>
          <p className="text-gray-400 text-[13px] leading-relaxed mb-10 pr-4">
            Jangan khawatir, masukkan NISN atau alamat email yang terdaftar. Kami akan mengirimkan instruksi untuk mereset kata sandi Anda.
          </p>

          <div className="space-y-8">
            <div className="relative group/field">
              <label className="block text-[11px] text-gray-400 font-bold mb-3 uppercase tracking-wider">
                Email atau NISN
              </label>
              <div className="relative border-b border-gray-400 focus-within:border-gray-800 pb-3 transition-colors">
                <input
    type="text"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-transparent text-gray-900 focus:outline-none text-[15px] font-medium placeholder:text-gray-300"
    placeholder="siswa@mbsprambanan.sch.id"
  />
              </div>
            </div>

            <button
    onClick={() => onSendInstructions(email)}
    className="w-full bg-[#1A3D63] hover:bg-[#122A44] text-white font-bold py-3.5 rounded-[16px] transition-all shadow-[0_10px_30px_-10px_rgba(26,61,99,0.3)] active:scale-[0.98] mt-4 flex items-center justify-center text-[14px]"
  >
              <PaperPlaneIcon />
              Kirim Instruksi Reset
            </button>
          </div>
        </div>

        {
    /* Bottom Actions */
  }
        <div className="w-full mx-auto">
          <div className="border-t border-gray-300 w-full mb-6" />
          <div className="flex flex-wrap items-center justify-between">
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
    className="absolute top-[5%] right-[-10%] w-full max-w-[600px] lg:w-full max-w-[800px] opacity-[0.85] pointer-events-none mix-blend-screen"
  />
        <img
    src="/Overlay-Blur.png"
    alt=""
    className="absolute bottom-[10%] left-[-10%] w-full max-w-[500px] lg:w-full max-w-[700px] opacity-[0.65] pointer-events-none mix-blend-screen"
  />
        
        <div className="relative z-10 max-w-[550px]">
          <h2 className="text-white text-[36px] md:text-[48px] lg:text-[64px] font-bold leading-[1.1] lg:leading-[1.05] tracking-tight mb-3 lg:mb-4">
            Pemulihan Akses <br className="hidden md:block" /> Akun
          </h2>
          <p className="text-white/70 text-[14px] lg:text-[15px] mb-8 lg:mb-12">Amankan Kembali Akun akademik Anda</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="text-white">
              <ShieldIcon />
            </div>
            <h3 className="text-white text-[16px] font-bold">Panduan Keamanan</h3>
          </div>

          <div className="flex flex-col gap-3">
            <InfoCard
    icon={<MailIcon />}
    title="Periksa Folder Spam"
    description="Jika Anda tidak menerima email instruksi reset dalam beberapa menit, periksa folder spam atau promosi pada kotak masuk email anda"
  />
            <InfoCard
    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>}
    title="Gunakan Password Kuat"
    description="Setelah berhasil login, ganti password Anda dengan kombinasi huruf besar, kecil, angka, dan simbol untuk menjaga keamanan akun."
  />
            <InfoCard
    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>}
    title="Hubungkan Admin IT"
    description="Jika Anda masih mengalami kendala setelah mereset password, segera hubungi bagian IT atau Tata Usaha Sekolah"
  />
          </div>
        </div>
      </div>
    </div>;
};
var ForgotPassword_default = ForgotPassword;
export {
  ForgotPassword_default as default
};
