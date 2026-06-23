import { useState } from "react";
import api from "../api/axios";
const EyeIcon = ({ show }) => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 hover:text-gray-600 transition-colors">
    {show ? <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </> : <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>}
  </svg>;
const BellIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>;
const NewsCard = ({ category, categoryColor, title, description, time }) => <div className="bg-[#2A4B6D] border border-[#37587E] rounded-[20px] p-6 mb-4 relative overflow-hidden group hover:bg-[#2E5175] transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <span className={`${categoryColor} text-[10px] font-black px-2.5 py-1 rounded-md tracking-wide uppercase`}>
        {category}
      </span>
      <span className="text-[11px] text-white/70 flex items-center gap-1.5 font-medium">
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
        {time}
      </span>
    </div>
    <h4 className="text-white font-bold text-[15px] mb-2 leading-snug">{title}</h4>
    <p className="text-white/70 text-[13px] leading-relaxed line-clamp-2">
      {description}
    </p>
  </div>;
const Login = ({ onLogin, onForgotPassword }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', {
        email: username.trim(), // API menggunakan email
        password: password
      });

      if (response.data.success) {
        const user = response.data.data.user;
        user.accessToken = response.data.data.accessToken;
        
        onLogin(user);
      }
    } catch (err) {
      if (!err.response) {
        setError("Tidak dapat terhubung ke server. Pastikan backend Node.js sedang berjalan!");
      } else {
        setError(err.response?.data?.message || "Username atau password salah!");
      }
    } finally {
      setLoading(false);
    }
  };

  return <div className="flex flex-col-reverse lg:flex-row min-h-screen w-full bg-white font-sans relative overflow-x-hidden overflow-y-auto">
      {
    /* Left Side (Login Form) */
  }
      <div className="w-full lg:w-[40%] min-h-[100dvh] lg:min-h-screen bg-white flex flex-col p-6 sm:p-8 lg:px-20 xl:px-24 py-10 lg:py-16 justify-between relative z-10">
        
        {
    /* Header Logo */
  }
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-[#1A3D63] rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-xl leading-none">S</span>
          </div>
          <span className="text-gray-900 font-bold text-[13px] tracking-wide">MBS PRAMBANAN</span>
        </div>

        {
    /* Form Container */
  }
        <div className="max-w-[400px] w-full mx-auto relative z-10 my-auto pt-12 lg:pt-16 pb-12">
          <h1 className="text-gray-900 text-4xl lg:text-[42px] font-bold mb-2 lg:mb-3 tracking-tight">Login</h1>
          <p className="text-gray-400 text-[14px] mb-12">Enter your account details</p>

          <div className="space-y-8">
            {error && <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs py-3.5 px-4 rounded-xl font-medium flex items-center gap-2">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>}
            
            <div className="relative group/field">
              <label className="block text-[12px] text-gray-500 font-medium mb-3">
                Username / NISN
              </label>
              <div className="relative border-b border-gray-400 focus-within:border-gray-800 pb-3 transition-colors">
                <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="w-full bg-transparent text-gray-900 focus:outline-none text-[15px] font-bold placeholder:text-gray-400 placeholder:font-normal"
    placeholder="Masukkan Username / NISN"
  />
              </div>
            </div>

            <div className="relative group/field">
              <label className="block text-[12px] text-gray-500 font-medium mb-3">
                Password
              </label>
              <div className="relative border-b border-gray-400 focus-within:border-gray-800 pb-3 flex items-center transition-colors">
                <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-transparent text-gray-900 focus:outline-none text-[20px] tracking-widest font-bold placeholder:text-gray-400 placeholder:tracking-widest"
    placeholder="••••••••"
  />
                <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="ml-2 focus:outline-none"
  >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            <button
    onClick={handleLogin}
    disabled={loading}
    className={`w-full bg-[#1A3D63] hover:bg-[#122A44] text-white font-bold py-4 rounded-[20px] transition-all shadow-[0_15px_40px_-10px_rgba(255,100,100,0.15)] active:scale-[0.98] mt-4 flex items-center justify-center gap-2 text-[15px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
  >
              <span>{loading ? "Loading..." : "Login"}</span>
              {!loading && <span className="font-bold">→</span>}
            </button>
          </div>
        </div>

        {
    /* Bottom Actions */
  }
        <div className="w-full mx-auto">
          <div className="border-t border-gray-300 w-full mb-6" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[13px]">Lupa password?</span>
            <button
    onClick={onForgotPassword}
    className="bg-[#4B7DA3] hover:bg-[#3d6a8b] text-white font-bold py-2.5 px-6 rounded-xl transition-all text-[13px]"
  >
              Reset Password
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
        
        {
    /* Welcome Section */
  }
        <div className="relative z-10 flex flex-col-reverse md:flex-row justify-between items-start mb-12 lg:mb-16 gap-6 md:gap-0">
          <div className="max-w-[500px]">
            <h2 className="text-white text-4xl md:text-5xl lg:text-[72px] font-bold leading-[1.1] lg:leading-[1.05] tracking-tight mb-3 lg:mb-4">
              Welcome to <br className="hidden md:block" />student portal
            </h2>
            <p className="text-white/70 text-[15px] lg:text-[16px]">Login to access your account</p>
          </div>
          <div className="w-20 md:w-24 lg:w-[140px] flex items-center justify-center relative mt-2 md:mt-4 md:mr-8">
             <img
    src="/logo-osis.png"
    alt="OSIS"
    className="w-full object-contain drop-shadow-2xl relative z-10"
    onError={(e) => {
      e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Lambang_OSIS.png";
    }}
  />
          </div>
        </div>

        {
    /* News Section */
  }
        <div className="relative z-10 w-full max-w-[650px]">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                <BellIcon />
              </div>
              <h3 className="text-white lg:text-[20px] font-bold">Info Penting Sekolah</h3>
            </div>
            <button className="text-white/70 text-[12px] font-medium hover:text-white transition-colors flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5">
              Lihat Semua <span>→</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <NewsCard
    category="AKADEMIK"
    categoryColor="bg-[#FACC15] text-[#0A1931]"
    title="Jadwal Ujian Akhir Semester Genap 2023/2024"
    description="Pelaksanaan UAS genap akan dilaksanakan mulai tanggal 15 Juni hingga 22 Juni 2024. Seluruh siswa diharap menyelesaikan administrasi dan mencetak kartu ujian."
    time="Hari ini, 08:30"
  />
            <NewsCard
    category="KEUANGAN"
    categoryColor="bg-[#FACC15] text-[#0A1931]"
    title="Batas Akhir Pembayaran SPP Tahap 3"
    description="Diingatkan kepada seluruh wali murid bahwa batas akhir pembayaran SPP tahap 3 adalah tanggal 10 setiap bulannya. Harap melunasi tepat waktu untuk menghindari kendala"
    time="Kemarin"
  />
            <NewsCard
    category="KEGIATAN"
    categoryColor="bg-white text-[#0A1931]"
    title="Pendaftaran Ekstrakurikuler Wajib Kelas X"
    description="Siswa kelas X wajib memilih minimal 1 ekstrakurikuler. Pendaftaran dibuka melalui portal SIAKAD ini hingga akhir pekan depan. Kuota terbatas tiap bidangnya."
    time="2 Hari Lalu"
  />
          </div>
        </div>
      </div>
    </div>;
};
var Login_default = Login;
export {
  Login_default as default
};
