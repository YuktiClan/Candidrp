
import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Newspaper,
  Users,
  Globe,
  Clock,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  ArrowUpRight,
  ExternalLink,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCheck,
} from "lucide-react";

/**
 * PROFESSIONAL CANDID RP ADMIN PANEL
 * Green + Dark Blue + White Premium Theme
 * Modern Corporate Dashboard UI
 * Functionality Preserved
 */

export default function App() {
  const [stats, setStats] = useState({
    jobs: 0,
    news: 0,
    contacts: 0,
    candidates: 0,
    clients: 0,
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [userName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isError, setIsError] = useState(false);

  // CLOCK
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // INITIAL FETCH
  useEffect(() => {
    fetchDashboardStats();
    fetchNotifications();
  }, []);

  // FETCH STATS
  const fetchDashboardStats = async () => {
    try {
      setIsError(false);

      const jobsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/jobs`
      );
      const jobsData = await jobsRes.json();

      const newsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/news`
      );
      const newsData = await newsRes.json();

      const contactRes = await fetch(
        `${import.meta.env.VITE_API_URL}/contacts`
      );
      const contactData = await contactRes.json();

      let candidates = 0;
      let clients = 0;

      if (Array.isArray(contactData)) {
        contactData.forEach((c) => {
          if (
            c.message &&
            typeof c.message === "string" &&
            c.message.includes("Applying for:")
          ) {
            candidates++;
          } else {
            clients++;
          }
        });
      }

      setStats({
        jobs: jobsData.length || 0,
        news: newsData.length || 0,
        contacts: contactData.length || 0,
        candidates,
        clients,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setIsError(true);
    }
  };

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notification error", err);
      setNotifications([]);
    }
  };

  // DELETE SINGLE NOTIFICATION
  const deleteNotification = async (n: any) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/${n.id}`,
        {
          method: "DELETE",
        }
      );

      if (n.link) {
        window.location.href = n.link;
      } else {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Delete notification error", err);

      if (n.link) {
        window.location.href = n.link;
      }
    }
  };

  // MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          fetch(
            `${import.meta.env.VITE_API_URL}/notifications/${n.id}`,
            {
              method: "DELETE",
            }
          )
        )
      );

      setNotifications([]);
    } catch (err) {
      console.error("Mark all read error", err);
    }
  };

  return (
    
<div className="relative overflow-hidden bg-[#edf4ef] text-slate-800 font-sans rounded-[2.5rem] min-h-[80vh] border-2 border-[#0f172a]">  
      {/* PREMIUM BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300/30 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/20 blur-[140px] rounded-full"></div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-[1650px] mx-auto p-2 md:p-5 flex flex-col gap-4">

        {/* HEADER */}
        <header className="bg-white/85 backdrop-blur-2xl border border-white/70 rounded-[1rem] shadow-[0_10px_40px_rgba(15,23,42,0.08)] px-6 md:px-10 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* LEFT */}
          <div className="flex items-center gap-7">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#14532d] flex items-center justify-center shadow-xl shadow-emerald-900/20">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#0f172a]">
                CANDID RP
              </h1>

              <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                Enterprise Operations Dashboard
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                Welcome back
                <span className="font-bold text-[#14532d]">
                  {userName || "Admin"}
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 flex-wrap">

            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md ${
                isError
                  ? "bg-red-50 border-red-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  isError ? "bg-red-500" : "bg-emerald-500"
                }`}
              ></div>

              <span
                className={`text-sm font-bold flex items-center gap-2 ${
                  isError ? "text-red-600" : "text-emerald-700"
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}

                {isError ? "Connection Error" : "System Secure"}
              </span>
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {[
            {
              label: "Active Jobs",
              value: stats.jobs,
              icon: Briefcase,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              label: "Article Feed",
              value: stats.news,
              icon: Newspaper,
              color: "text-blue-700",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Candidates",
              value: stats.candidates,
              icon: Users,
              color: "text-green-700",
              bg: "bg-green-50",
              border: "border-green-100",
            },
            {
              label: "Clients",
              value: stats.clients,
              icon: Users,
              color: "text-slate-700",
              bg: "bg-slate-100",
              border: "border-slate-200",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-[2rem] border ${card.border} ${card.bg} p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)] transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-8">

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-md ${card.color}`}
                >
                  <card.icon className="w-7 h-7" />
                </div>

                <TrendingUp className="w-5 h-5 text-slate-400" />
              </div>

              <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-slate-500 mb-3">
                {card.label}
              </h3>

              <div className="text-5xl font-black text-[#0f172a]">
                {card.value}
              </div>

              <div className="absolute -bottom-8 -right-8 opacity-[0.04]">
                <card.icon className="w-36 h-36 text-black" />
              </div>
            </div>
          ))}
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* QUICK LINKS */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f172a] via-[#134e4a] to-[#14532d] border border-white/10 shadow-[0_20px_50px_rgba(20,83,45,0.25)] p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
              <div className="flex items-center justify-between mb-6">

                <h3 className="text-lg font-black text-[#ffffff] flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  Quick Access
                </h3>

                <Activity className="w-5 h-5 text-slate-100" />
              </div>

              <div className="space-y-4">

                {[
                  {
                    name: "Main Website",
                    url: "https://candidrp.com",
                    sub: "candidrp.com",
                    icon: Globe,
                    color: "text-emerald-700",
                  },
                  {
                    name: "LinkedIn Profile",
                    url: "https://www.linkedin.com/company/candid-resourcing-partners-ltd/",
                    sub: "Company Network",
                    icon: Users,
                    color: "text-blue-700",
                  },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
                  >
                    <div className="flex items-center gap-4">

                      <div
                        className={`w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center ${link.color}`}
                      >
                        <link.icon className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="font-bold text-[#c2ffe4] group-hover:text-emerald-700 transition-colors">
                          {link.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {link.sub}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-8 bg-white/20 backdrop-blur-2xl rounded-[2rem] border border-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] overflow-hidden">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-[#cdeddd] to-[#edfdf5]">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Bell className="w-7 h-7 text-emerald-700" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#0f172a]">
                    Notifications Center
                  </h3>

                  <p className="text-slate-500 font-medium">
                    Track latest activities and updates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">

                <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold">
                  {notifications.length} NEW
                </div>

                {/* MARK ALL READ BUTTON */}
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-semibold transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark All Read
                  </button>
                )}
              </div>
            </div>

            {/* NOTIFICATION BODY */}
            <div className="p-3 max-h-[190px] overflow-y-auto">

              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">

                  <div className="w-24 h-0 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <Bell className="w-10 h-10 text-slate-400" />
                  </div>

                  <h3 className="text-xl font-black text-slate-700 mb-2">
                    No Notifications
                  </h3>

                  <p className="text-slate-500">
                    Everything is up to date.
                  </p>

                  {isError && (
                    <p className="mt-4 text-red-500 text-sm font-medium">
                      Please check backend server connection.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">

                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => deleteNotification(n)}
                      className="group relative overflow-hidden rounded-[1.7rem] border border-slate-100 bg-gradient-to-r from-white to-slate-50 hover:from-emerald-50 hover:to-white p-6 transition-all duration-300 cursor-pointer hover:border-emerald-200 hover:shadow-lg"
                    >

                      <div className="flex items-start justify-between gap-5">

                        <div className="flex gap-5">

                          <div className="mt-2 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>

                          <div>
                            <h4 className=" font-black text-[#033c0d] group-hover:text-emerald-700 transition-colors">
                              {n.title}
                            </h4>

                            <p className="text-slate-600 leading-relaxed mt-2">
                              {n.message}
                            </p>
                          </div>
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-emerald-100 group-hover:border-emerald-200 transition-all">
                          <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-emerald-700" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}
