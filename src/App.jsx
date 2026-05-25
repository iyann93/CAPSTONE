import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SiswaDashboard from "./pages/dashboards/SiswaDashboard";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import PlaceholderDashboard from "./pages/dashboards/PlaceholderDashboard";
import BendaharaDashboard from "./pages/dashboards/BendaharaDashboard";
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
  const handleLogout = () => {
    localStorage.removeItem("siakad_user");
    setUser(null);
    setCollapsed(true);
    setActiveMenu("Dashboard");
  };
  const handleLogin = (authenticatedUser) => {
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
      case "Admin":
        return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
      case "Super Admin":
        return <SuperAdminDashboard user={user} activeMenu={activeMenu} />;
      case "Siswa":
        return <SiswaDashboard user={user} activeMenu={activeMenu} onViewChange={setActiveMenu} />;
      case "Bendahara":
        return <BendaharaDashboard user={user} activeMenu={activeMenu} />;
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
