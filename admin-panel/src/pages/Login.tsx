import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
  }, []);


  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err: any) {
       setError(err?.response?.data?.error || "Invalid credentials ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-60 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000" />
      </div>

      <div className="relative w-full max-w-[900px] min-h-[600px] mx-4 flex bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden animate-in fade-in zoom-in duration-700">

        {/* Left Side: Visual/Image Section */}
        <div className="hidden md:flex w-1/2 bg-[#6366f1] relative p-12 flex-col justify-between overflow-hidden">
          {/* Abstract Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Manage your <br />
              <span className="text-indigo-200">Empire CANDID RP</span>
            </h1>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl">
            <p className="text-white/90 text-sm leading-relaxed italic">
              "The best way to predict the future is to create it. Our admin suite gives you the tools to build yours today."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-300 border-2 border-white/30" />
              <span className="text-xs font-medium text-white">Powered by yuktic.com</span>
            </div>
          </div>

          {/* Floating animated circles for the image side */}
          <div className="absolute top-1/2 right-[-10%] w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce duration-[5s]" />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Password
              </label>

              <div className="relative group">
                {/* Lock Icon */}
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />

                {/* Input */}
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"   // ✅ IMPORTANT
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />


                

                {/* Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

                


              </div>

              {error && (
                  <div className="w-full mt-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center justify-between">
                    <span>{error}</span>
                    
                  </div>
                )}
            </div>



            <button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full group relative bg-[#111827] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-gray-200 active:scale-[0.98] mt-2 overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>


          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}} />
    </div>
  );
}