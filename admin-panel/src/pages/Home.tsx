import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Newspaper, 
  Users, 
  Globe, 
  ChevronRight,
  Clock,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  ArrowUpRight,
  ExternalLink,
  Search,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

/**
 * Modern Stylish Admin Panel for Candid RP
 * Focuses on Glassmorphism, Bento Grids, and sophisticated dark-mode aesthetics.
 */
export default function App() {
  // Manual state for dashboard statistics
  const [stats, setStats] = useState({
    jobs: 0,
    news: 0,
    contacts: 0,
    candidates: 0,
    clients: 0
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [userName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isError, setIsError] = useState(false);
  
  

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
    fetchDashboardStats();
    fetchNotifications();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsError(false);
      const jobsRes = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
      const jobsData = await jobsRes.json();

      const newsRes = await fetch(`${import.meta.env.VITE_API_URL}/news`);
      const newsData = await newsRes.json();

      const contactRes = await fetch(`${import.meta.env.VITE_API_URL}/contacts`);
      const contactData = await contactRes.json();

      let candidates = 0;
      let clients = 0;

      if (Array.isArray(contactData)) {
        contactData.forEach((c) => {
          if (c.message && typeof c.message === 'string' && c.message.includes("Applying for:")) {
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
        clients
      });

    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setIsError(true);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notification error", err);
      setNotifications([]);
    }
  };

  const deleteNotification = async (n: any) => {
    try {
      // Optimistic UI update or wait for delete? 
      // We'll wait to ensure the backend processes before redirecting
      await fetch(`${import.meta.env.VITE_API_URL}/notifications/${n.id}`, {
        method: "DELETE"
      });
      
      if (n.link) {
        window.location.href = n.link;
      } else {
        fetchNotifications(); // Refresh if no link provided
      }
    } catch (err) {
      console.error("Delete notification error", err);
      // Even if delete fails, redirect to avoid blocking user
      if (n.link) window.location.href = n.link;
    }
  };

  return (
      <div className=" overflow-hidden rounded-[2.5rem]  bg-[#0f172a] relative overflow-hidden font-sans text-slate-200 flex flex-col p-4 md:p-6 lg:p-0">      
      {/* BACKGROUND ELEMENTS - Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-8 lg:p-10 flex flex-col gap-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-4 bg-[#0f172a] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                  CANDID RP
                </h1>
              </div>
              <p className="text-slate-400 text-sm mt-1 font-medium flex items-center gap-2">
                Operations Hub <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Welcome back <span className="text-white font-bold">{userName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden lg:flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-md border rounded-2xl ${isError ? 'border-red-500/50' : 'border-white/10'}`}>
              <div className={`w-2 h-2 rounded-full animate-ping ${isError ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <span className={`text-xs font-bold tracking-wide uppercase flex items-center gap-2 ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
                {isError ? <AlertCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {isError ? 'Connection Error' : 'Network Secure'}
              </span>
            </div>
            
             
            
          </div>
        </header>

        {/* BENTO STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Active Jobs", value: stats.jobs, icon: Briefcase, color: "text-purple-400", bg: "from-purple-500/10 to-transparent", border: "border-purple-500/20" },
            { label: "Article Feed", value: stats.news, icon: Newspaper, color: "text-blue-400", bg: "from-blue-500/10 to-transparent", border: "border-blue-500/20" },
            { label: "Candidates", value: stats.candidates, icon: Users, color: "text-emerald-400", bg: "from-emerald-500/10 to-transparent", border: "border-emerald-500/20" },
            { label: "Clients", value: stats.clients, icon: Users, color: "text-orange-400", bg: "from-orange-500/10 to-transparent", border: "border-orange-500/20" },
          ].map((card, idx) => (
            <div key={idx} className={`relative p-3 rounded-3xl bg-gradient-to-br ${card.bg} backdrop-blur-md border ${card.border} hover:border-white/20 transition-all duration-300 group overflow-hidden`}>
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-black/40 ${card.color} border border-white/5`}>
                    <card.icon className="w-8 h-6" />
                  </div>
                  <TrendingUp className="w-8 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] mb-1">{card.label}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl  ml-4 font-black text-white">{card.value}</span>
                   
                  </div>
                </div>
              </div>
              {/* Decorative background number or icon */}
              <card.icon className={`absolute -bottom-6 -right-6 w-32 h-32 ${card.color} opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`} />
            </div>
          ))}
        </div>

        {/* CONTENT LAYOUT */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR AREA (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* LINKS BOX */}
            <div className="bg-[#0f172a]/50 backdrop-blur-2xl p-3 rounded-[0.5rem] border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Fast Connectivity
                </h3>
                <Activity className="w-4 h-4 text-slate-600" />
              </div>
              <div className="space-y-2">
                {[
                  { name: "Main Website", url: "https://candidrp.com", sub: "candidrp.com", icon: Globe, color: "text-emerald-400" },
                  { name: "LinkedIn Profile", url: "https://www.linkedin.com/company/candid-resourcing-partners-ltd/", sub: "Company Network", icon: Users, color: "text-blue-400" }
                ].map((link, i) => (
                  <a 
                    key={i}
                    href={link.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-[0.5rem] bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-1.5 rounded-xl bg-slate-900 ${link.color}`}>
                        <link.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{link.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{link.sub}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* UPGRADE / PROMO CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-900 to-pink-600 p-3 rounded-[0.5rem] text-white shadow-2xl group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest">Candidrp.com</span>
                </div>
                <h4 className="font-black text-2xl mb-0 leading-tight tracking-tight">Candidrp Advanced Intelligence</h4>
                <p className="text-white/70 text-sm mb-0 max-w-[200px]">Real-time Data management </p>
                
              </div>
            </div>
          </div>

          {/* MAIN MANAGEMENT AREA (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#0f172a]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden min-h-[100px]">
            
            {/* HUB HEADER */}
            <div className="p-7 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-0 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <Bell className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">System Notifications</h3>
                  <p className="text-sm text-slate-500 font-medium">Monitoring latest activity across zones</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-[10px] font-bold text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                {notifications.length} NEW
              </div>
            </div>

            {/* HUB CONTENT */}
            <div className="flex-1 p-3 overflow-y-auto max-h-[140px] scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 py-0 text-center">
                  <div className="w-16 h-15 rounded-full bg-slate-800 flex items-center justify-center mb-4 mx-auto">
                    <Bell className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 font-bold tracking-wide uppercase text-xs">No active notifications</p>
                  {isError && (
                    <p className="text-red-400 text-[10px] mt-2 font-mono">Check if Local Server (8000) is running</p>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => deleteNotification(n)}
                      className="group p-5 bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 rounded-3xl cursor-pointer transition-all duration-300 flex items-start justify-between"
                    >
                      <div className="flex gap-5">
                        <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                        <div>
                          <p className="text-white text-base font-bold mb-1 group-hover:text-emerald-400 transition-colors">{n.title}</p>
                          <p className="text-slate-400 text-sm leading-relaxed max-w-lg">{n.message}</p>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HUB FOOTER */}
            <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900">
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">System Time</span>
                    <span className="text-sm font-bold text-white font-mono mt-1">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                <div className="hidden sm:block h-8 w-px bg-white/10"></div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isError ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                    <Zap className={`w-4 h-4 ${isError ? 'text-red-400' : 'text-emerald-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">API Status</span>
                    <span className={`text-[10px] font-bold tracking-wider mt-1 flex items-center gap-1 ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      <span className={`w-1 h-1 rounded-full animate-pulse ${isError ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                      {isError ? 'OFFLINE' : 'OPERATIONAL'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase hidden md:block">
                Powered by yuktic.com
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Aesthetic Overlay Grid */}
<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>    </div>
  );
}