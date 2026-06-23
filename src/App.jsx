import React, { useState, useEffect } from "react";
import api from "./api/axios";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import PlaceholderDashboard from "./pages/dashboards/PlaceholderDashboard";
import BendaharaDashboard from "./pages/dashboards/BendaharaDashboard";
import AdminTUDashboard from "./pages/dashboards/AdminTUDashboard";
import OrangTuaDashboard from "./pages/dashboards/OrangTuaDashboard";
const App = () => {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [authView, setAuthView] = useState("login");
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const scrollContainerRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeMenu, user]);

  // Inactivity / Idle Timeout Logic
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set timeout for 15 minutes (900000 milliseconds)
      timeoutId = setTimeout(() => {
        if (user) {
          console.log("Tidak ada aktivitas selama 15 menit. Auto-logout...");
          alert("Sesi Anda telah berakhir karena tidak ada aktivitas selama 15 menit. Silakan login kembali.");
          handleLogout();
        }
      }, 900000); // 15 menit
    };

    if (user) {
      // Listen for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      events.forEach(event => {
        window.addEventListener(event, resetTimer, { passive: true });
      });

      // Initialize the timer
      resetTimer();

      // Cleanup on unmount or when user logs out
      return () => {
        clearTimeout(timeoutId);
        events.forEach(event => {
          window.removeEventListener(event, resetTimer);
        });
      };
    }
  }, [user]);
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    if (user) handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user]);
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.removeItem("siakad_user");
    setUser(null);
    setCollapsed(true);
    setActiveMenu("Dashboard");
  };

  // Check saved session on mount
  useEffect(() => {
    const validateSession = async () => {
      const savedUser = localStorage.getItem("siakad_user");
      if (savedUser) {
        try {
          // Tetap pasang user dari cache biar UI cepat render
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.role === "Bendahara") parsedUser.fullName = "Siti Aminah";
          setUser(parsedUser);
          
          // Verifikasi ke backend apakah session/cookie masih valid
          const res = await api.get('/auth/me');
          if (res.data.success) {
            // Update dengan data terbaru dari server (termasuk role)
            const freshUser = res.data.data;
            if (freshUser.role === "Bendahara") freshUser.fullName = "Siti Aminah";
            setUser(freshUser);
            localStorage.setItem("siakad_user", JSON.stringify(freshUser));
          }
        } catch (e) {
          // Jika 401 (Unauthorized) atau token hilang, paksa logout
          console.warn("Sesi tidak valid / Token expired. Memaksa logout...");
          localStorage.removeItem("siakad_user");
          setUser(null);
        }
      }
    };
    validateSession();
  }, []);

  const handleLogin = (authenticatedUser) => {
    if (authenticatedUser.role === "Bendahara") authenticatedUser.fullName = "Siti Aminah";
    localStorage.setItem("siakad_user", JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
    setActiveMenu("Dashboard");
  };
  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case "Admin TU":
      case "Admin":
        return <AdminTUDashboard user={user} activeMenu={activeMenu} />;
      case "Super Admin":
        return <SuperAdminDashboard user={user} activeMenu={activeMenu} />;

      case "Bendahara":
        return <BendaharaDashboard user={user} activeMenu={activeMenu} onViewChange={setActiveMenu} />;
      case "Orang Tua":
        return <OrangTuaDashboard user={user} activeMenu={activeMenu} onViewChange={setActiveMenu} />;
      default:
        return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
    }
  };
  if (!user) {
    if (authView === "forgot") {
      return <ForgotPassword
        onBack={() => setAuthView("login")}
        onSendInstructions={(email) => {
          console.log("Sending instructions to:", email);
          setAuthView("reset");
        }}
      />;
    }
    if (authView === "reset") {
      return <ResetPassword
        onBack={() => setAuthView("login")}
        onSave={(password) => {
          console.log("Saving new password:", password);
          alert("Password baru Anda telah disimpan!");
          setAuthView("login");
        }}
      />;
    }
    return <Login
      onLogin={handleLogin}
      onForgotPassword={() => setAuthView("forgot")}
    />;
  }
  return <div className="flex flex-col min-h-screen bg-[#F4F6FA] font-sans h-screen overflow-hidden">
    <TopBar
      user={user}
      onToggle={() => setCollapsed((c) => !c)}
      onLogout={handleLogout}
      onProfileClick={() => setActiveMenu("My Profile")}
    />
    <div className="flex flex-1 min-h-0 overflow-hidden relative">
      <Sidebar
        role={user.role}
        user={user}
        collapsed={collapsed}
        activeMenu={activeMenu}
        onMenuClick={(menu) => {
          setActiveMenu(menu);
          if (window.innerWidth < 1024) setCollapsed(true);
        }}
        onClose={() => setCollapsed(true)}
      />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth relative"
      >
        {
          /* Decorative Blurs */
        }
        <img
          src="/bg-blur.png"
          alt=""
          className="absolute top-0 right-0 w-[800px] opacity-[0.15] pointer-events-none mix-blend-multiply"
        />
        <img
          src="/Overlay-Blur.png"
          alt=""
          className="absolute bottom-0 left-0 w-[600px] opacity-[0.1] pointer-events-none mix-blend-multiply"
        />

        <div className="relative z-10">
          {renderDashboard()}
        </div>
      </div>
    </div>
  </div>;
};
var App_default = App;
export {
  App_default as default
};
