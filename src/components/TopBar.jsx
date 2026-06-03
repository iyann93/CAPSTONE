import { useState, useRef, useEffect } from "react";
const BellIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>;
const ChatIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>;
const MenuIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>;
const UserIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-3">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>;
const LogoutIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-3">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>;
const TopBar = ({ user, onToggle, onLogout, onProfileClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-[#1A3D63] text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      {/* Left: Logo & Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#1A3D63] font-black text-lg leading-none">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">SIAKAD Terintegrasi</span>
        </div>
      </div>

      {/* Right: Controls + User Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="relative p-1 hover:bg-white/10 rounded-full transition-colors" aria-label="Notifikasi">
            <BellIcon />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 border-2 border-[#1A3D63] rounded-full" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors" aria-label="Pesan">
            <ChatIcon />
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          <div
            className="flex items-center gap-3 group cursor-pointer border-l border-white/10 pl-6 h-10"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[13px] font-black leading-tight text-white">{user?.fullName || "Guest"}</span>
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-0.5 text-white">{user?.role || "Visitor"}</span>
            </div>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xs border border-white/10 shadow-sm overflow-hidden">
                 <div className="w-full h-full bg-[#7C8FA9] flex items-center justify-center text-white font-bold text-xs">
                   {getInitials(user?.fullName)}
                 </div>
              </div>
            </div>
            <div className="text-white/40 group-hover:text-white transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={`transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onProfileClick) onProfileClick();
                }}
                className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
              >
                <UserIcon />
                My Profile
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-red-600 hover:bg-red-50 flex items-center transition-colors"
              >
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
var TopBar_default = TopBar;
export {
  TopBar_default as default
};
