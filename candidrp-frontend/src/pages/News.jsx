import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import hero from "../assets/News.jpg"; // ✅ ADD YOUR IMAGE PATH
// --- PREVIEW PLACEHOLDERS END ---

// Standard UI Components for icons (using SVGs for portability)
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default function News() {
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
    // Keeping the original fetch concept as requested
    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.filter((item) => item.status === "published"));
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setIsLoaded(true);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* REFINED HERO SECTION */}
  <section className="relative pt-44 pb-24 overflow-hidden border-b border-slate-100">

  {/* 🔹 BACKGROUND IMAGE */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
               backgroundImage: `url(${hero})`,
               backgroundSize: "cover",
               backgroundPosition: "center",
             }}
  ></div>

  {/* 🔹 OVERLAY */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#1f0638]/100 via-[#5b2c91]/20 to-[]/50"></div>


  {/* 🔹 EXISTING BLOBS */}
  {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
  </div> */}


  {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-10 flex justify-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
              Official Press
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Articles &{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Events
              </span>
            </h1>

            <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
              Stay informed with the latest insights, technological
              breakthroughs, and corporate milestones.
            </p>
          </motion.div>
        </div>
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

</section>


      {/* ARTICLE GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">

          
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.article
                key={post.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col h-full"
              >
                {/* MODERN CARD IMAGE */}
                <Link 
                  to={`/news/${post.slug}`}
                  className="relative aspect-[16/10] mb-6 overflow-hidden rounded-2xl bg-slate-100 block"
                >
                  <motion.img
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    src={
                      post.sections?.find(s => s.image)?.image ||
                      post.sections?.find(s => s.images)?.images?.[0] ||
                      "https://images.unsplash.com/photo-1504711432869-efd5971ee112?q=80&w=800&auto=format&fit=crop"
                    }
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    alt={post.title}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-2xl"></div>
                </Link>

                {/* CARD CONTENT */}
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                    <span className="font-semibold text-indigo-600 text-[10px] uppercase tracking-wider">Article</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <div className="flex items-center gap-1.5 font-medium">
                      <CalendarIcon />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                    <Link to={`/news/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt || "We are pleased to announce our latest milestone in digital transformation and industry-leading innovation."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <Link
                      to={`/news/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group/link"
                    >
                      <span>Read Full Report</span>
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {isLoaded && posts.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-medium">No published articles found.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}


