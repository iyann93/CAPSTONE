import { useState, useEffect } from "react";
import { getAnnouncements } from "../utils/announcementStore";
import api from "../api/axios";
import LogoRound from "../assets/logo-round.png";
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
const NewsCard = ({ category, categoryColor, title, description, time, onClick }) => <div onClick={onClick} className="bg-[#2A4B6D] border border-[#37587E] rounded-[20px] p-6 mb-4 relative overflow-hidden group hover:bg-[#2E5175] transition-all duration-300 cursor-pointer">
    <div className="flex flex-wrap justify-between items-center mb-4">
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
    <h4 className="text-white font-bold text-[15px] mb-2 leading-snug group-hover:text-blue-200 transition-colors">{title}</h4>
    <p className="text-white/70 text-[13px] leading-relaxed line-clamp-2">
      {description}
    </p>
  </div>;
const Login = ({ onLogin, onForgotPassword, setAuthView }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    // Fetch only active announcements
    const all = getAnnouncements();
    const active = all.filter(a => a.isActive !== false).slice(0, 3); // max 3
    setAnnouncements(active);
  }, []);

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
      } else if (err.response?.data?.message === 'MAINTENANCE' || err.response?.status === 503) {
        if (setAuthView) setAuthView("maintenance");
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
        
        {/* Header Logo removed as requested */}

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
          <div className="flex flex-wrap items-center justify-between">
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
    className="absolute top-[5%] right-[-10%] w-full max-w-[600px] lg:w-full max-w-[800px] opacity-[0.85] pointer-events-none mix-blend-screen"
  />
        <img
    src="/Overlay-Blur.png"
    alt=""
    className="absolute bottom-[10%] left-[-10%] w-full max-w-[500px] lg:w-full max-w-[700px] opacity-[0.65] pointer-events-none mix-blend-screen"
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
          <div className="w-24 md:w-32 lg:w-[140px] flex items-center justify-center relative mt-2 md:mt-4 md:mr-8">
            <img
              src={LogoRound}
              alt="MBS Prambanan"
              className="w-full object-contain drop-shadow-xl relative z-10"
            />
          </div>
        </div>

        {
    /* News Section */
  }
        <div className="relative z-10 w-full max-w-[650px]">
          <div className="flex flex-wrap items-center justify-between mb-8 px-2">
            <div className="flex flex-wrap items-center gap-4">
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
            {announcements.map((ann) => (
              <NewsCard
                key={ann.id}
                category={ann.category ? ann.category.toUpperCase() : "INFO"}
                categoryColor={
                  ann.importance === "Penting"
                    ? "bg-red-500 text-white"
                    : ann.category === "Kegiatan"
                    ? "bg-white text-[#0A1931]"
                    : "bg-[#FACC15] text-[#0A1931]"
                }
                title={ann.title}
                description={ann.desc}
                time={ann.date}
                onClick={() => setSelectedNews(ann)}
              />
            ))}
            {announcements.length === 0 && (
              <div className="text-white/50 text-[13px] text-center py-4">Belum ada info terbaru.</div>
            )}
          </div>
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedNews(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-zoomIn flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-start sticky top-0 bg-white z-10">
              <div className="flex gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                  selectedNews.importance === "Penting" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                }`}>
                  {selectedNews.importance}
                </span>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold">
                  {selectedNews.category}
                </span>
              </div>
              <button onClick={() => setSelectedNews(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <h2 className="text-[20px] font-bold text-gray-800 leading-snug mb-3">{selectedNews.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-gray-400 mb-6">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {selectedNews.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {selectedNews.author}
                </span>
              </div>
              <div className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
                {selectedNews.desc}
              </div>

              {selectedNews.attachment && (
                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Lampiran Dokumen</p>
                  <div className="flex flex-wrap items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1A3D63" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-800 line-clamp-1">{selectedNews.attachment}</p>
                        <p className="text-[11px] text-gray-400">PDF Document</p>
                      </div>
                    </div>
                    {selectedNews.attachmentData ? (
                      <a 
                        href={selectedNews.attachmentData}
                        download={selectedNews.attachment}
                        className="text-[12px] font-bold bg-[#1A3D63] hover:bg-[#122A44] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Unduh
                      </a>
                    ) : (
                      <button 
                        onClick={() => alert(`Memulai unduhan: ${selectedNews.attachment}`)}
                        className="text-[12px] font-bold bg-[#1A3D63] hover:bg-[#122A44] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Unduh
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>;
};
var Login_default = Login;
export {
  Login_default as default
};

