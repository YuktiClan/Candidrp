

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // ❌ Remove token
    localStorage.removeItem("token");

    // (optional) clear all storage
    // localStorage.clear();

    // ✅ Redirect to login
    navigate("/login");

    // (optional) force refresh for safety
    window.location.reload();
};

  const menu = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Web Contacts", path: "/contacts", icon: <Users size={20} /> },
    { name: "All Articles", path: "/news", icon: <Newspaper size={20} /> },
    { name: "Create Article", path: "/create", icon: <PlusCircle size={20} /> },
    { name: "Manage Job", path: "/create-job", icon: <PlusCircle size={20} /> },
    // { name: "Applicants", path: "/applicants", icon: <Users size={20} /> },
  ];

  // ✅ MOBILE STATE
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
      else setCollapsed(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
<div className="flex h-screen items-stretch md:p-3 p-0 bg-gray-200 font-sans">
      {/* ✅ MOBILE TOP BUTTON */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="fixed top-4 left-4 z-[60] bg-[#0a111a] text-white p-3 rounded-xl shadow-lg"
        >
          {mobileOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      )}

      <div className="flex h-full relative w-full">

        {/* MAIN SIDEBAR */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden
          ${
            isMobile
              ? `fixed top-0 left-0 w-full z-50 ${
                  mobileOpen ? "h-[70vh] opacity-100" : "h-0 opacity-0"
                }`
              : `${collapsed ? "w-0 opacity-0 mr-0" : "w-64 opacity-100 mr-3"} h-full`
          }`}
        >
          <div className="h-full w-full md:w-64 rounded-b-[32px] md:rounded-[32px] bg-[#0a111a] text-white shadow-2xl flex flex-col">

            <div className="px-4 py-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <div className="w-2.5 h-6 bg-emerald-400 rounded-full"></div>
              </div>
              <span className="text-xl font-bold">CandidRP</span>
            </div>

            <div className="flex-1 px-3 space-y-1 overflow-y-auto">
              {menu.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm ${
                      isActive
                        ? "bg-emerald-400 text-[#020617] font-bold"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 space-y-2 border-t border-white/5">

            {/* 🔐 RESET PASSWORD */}
              <Link
                to="/reset"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-yellow-400 hover:bg-yellow-400/10 rounded-xl text-sm"
              >
                <ShieldCheck size={16} /> Reset Password
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-xl text-sm"
              >
                <LogOut size={16} /> Logout
              </button>
              {/* 
              {!isMobile && (
                <button
                  onClick={() => setCollapsed(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs"
                >
                  <ChevronLeft size={16} /> Collapse View
                </button>
              )} */}
            </div>
          </div>
        </div>

        {/* ICON SIDEBAR (HIDE ON MOBILE) */}
        {!isMobile && (
          <div className="w-20 h-full">
            <div className="h-full rounded-[40px] bg-[#0a111a] text-white shadow-2xl flex flex-col items-center py-8">

              <div className="mb-10 w-12 h-2 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20">
                <div className="w-2.5 h-2 bg-emerald-400 rounded-full"></div>
              </div>

              <div className="flex flex-col gap-3 flex-1 items-center w-full px-2">
                {menu.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`p-2.5 rounded-2xl flex items-center justify-center ${
                        isActive
                          ? "bg-emerald-400 text-[#020617]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto px-3 w-full">
                <button
                  onClick={() => setCollapsed((prev) => !prev)}
                  className="w-12 h-12 mx-auto flex items-center justify-center rounded-2xl"
                >
                  {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

