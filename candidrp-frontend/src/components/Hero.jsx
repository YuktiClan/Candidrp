import hero1 from "../assets/hero.png";
import hero2 from "../assets/Team.png";
import hero4 from "../assets/Team2.png";
import hero3 from "../assets/Services.png";

import aboutImg2 from "../assets/aboutus2.png";
import img1 from "../assets/AvinashChander.png";
import img2 from "../assets/MerlynChander.png";
import img3 from "../assets/SandraShantanu.png";
import img4 from "../assets/RishabhShantanu.png";
import img5 from "../assets/SatishKumar.png"; 
import { FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "framer-motion";
import React, { useState, useEffect, useRef,  useMemo } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ FIXED
import { ChevronDown, Send } from 'lucide-react';

// Team images
// const team = [
//   { name: "Avinash Chander", img: img1 },
//   { name: "Merlyn Chander", img: img2 },
//   { name: "Sandra Shantanu", img: img3 },
//   { name: "Rishabh Shantanu", img: img4 },
//   { name: "Satish Kumar", img: img5 },
// ];

// const loopData = [...team, ...team]; 





const SLIDES = [
  {
    id: 1,
    title: "OUR LEADERS,",
    subtitle: "Avinash Chander",
    image: img1,
    prompt: "HEY @TEAM, VIEW AVINASH'S PROFILE"
  },
  {
    id: 2,
    title: "OUR LEADERS,",
    subtitle: "Merlyn Chander",
    image: img2,
    prompt: "HEY @TEAM, VIEW MERLYN'S PROFILE"
  },
  {
    id: 3,
    title: "OUR LEADERS,",
    subtitle: "Sandra Shantanu",
    image: img3,
    prompt: "HEY @TEAM, VIEW SANDRA'S PROFILE"
  },
  {
    id: 4,
    title: "OUR LEADERS,",
    subtitle: "Rishabh Shantanu",
    image: img4,
    prompt: "HEY @TEAM, VIEW RISHABH'S PROFILE"
  },
  {
    id: 5,
    title: "OUR LEADERS,",
    subtitle: "Satish Kumar",
    image: img5,
    prompt: "HEY @TEAM, VIEW SATISH'S PROFILE"
  }
];


// animations
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};


const fadeLeft = {
  hidden: { opacity: 0, x: -200 }, // OUTSIDE LEFT
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 200 }, // OUTSIDE RIGHT
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function Hero() {
  const navigate = useNavigate();


  const [currentIndex, setCurrentIndex] = useState(0);

    
  
  // Ref for scroll tracking
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Persistence check for one-time animations
  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem("heroAnimation");
    if (alreadyPlayed) {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem("heroAnimation", "true");
    }
  }, []);

  // Use memo for the floating bubbles to prevent re-renders of static data
  const blobs = useMemo(() => [
    { left: "10%", delay: 0, size: 110, color: "from-cyan-400/20" },
    { left: "25%", delay: 2, size: 140, color: "from-blue-400/20" },
    { left: "45%", delay: 4, size: 90, color: "from-indigo-400/20" },
    { left: "65%", delay: 1, size: 130, color: "from-purple-400/20" },
    { left: "85%", delay: 3, size: 100, color: "from-cyan-400/20" },
  ], []);


  // Auto-rotate the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  // Indices for background preview belt
  const getBeltIndices = () => {
    const indices = [];
    for (let i = -5; i <= 5; i++) {
      let idx = (currentIndex + i) % SLIDES.length;
      if (idx < 0) idx = SLIDES.length + idx;
      indices.push({ key: `${idx}-${i}`, image: SLIDES[idx].image });
    }
    return indices;
  };




   const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardAnimation = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

  // ✅ HERO IMAGES
  const heroImages = [hero1, hero2, hero3];

  // ✅ CLONE FOR LOOP
  const slides = [
    heroImages[heroImages.length - 1],
    ...heroImages,
    heroImages[0],
  ];

  const [current, setCurrent] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // ✅ ABOUT SECTION COUNT FIX
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // ✅ AUTO SLIDE (pause safe)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // ✅ LOOP FIX (no glitch)
  useEffect(() => {
    if (current === slides.length - 1) {
      setTimeout(() => {
        setIsAnimating(false);
        setCurrent(1);
      }, 800);
    }

    if (current === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        setCurrent(slides.length - 2);
      }, 800);
    }
  }, [current, slides.length]);

  // ✅ RE-ENABLE ANIMATION
  useEffect(() => {
    if (!isAnimating) {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  }, [isAnimating]);


  const listContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.4,   // ⏱ starts a bit late
      staggerChildren: 0.2,
    },
  },
};




const listItem = {
  hidden: {
    opacity: 0,
    y: -20, // start from TOP (hidden above)
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


  
  return (
    <div className="w-full overflow-hidden">


      
    <div className="w-full overflow-hidden min-h-screen" ref={containerRef}>
      {/* ================= LANDING HERO ================= */}
<section className="relative min-h-screen w-full overflow-hidden text-white flex items-center justify-center px-4">
        
        {/* BACKGROUND LAYERS */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#07071a] via-[#020205] to-black z-0" />

        {/* GLOW BACKGROUNDS */}
        <div 
          className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-[#2563eb]/30 blur-[190px] rounded-full transform-gpu"
          style={{ transform: 'translateX(-50%) translateZ(0)' }}
        />
        <div 
          className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#9333ea]/25 blur-[170px] rounded-full transform-gpu"
          style={{ transform: 'translateX(-50%) translateZ(0)' }}
        />

        {/* NEW CYBER-GLASS BUBBLES */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {blobs.map((item, i) => (
            <motion.div
              key={i}
              className="absolute will-change-transform"
              style={{
                width: item.size,
                height: item.size,
                left: item.left,
                bottom: "-150px",
              }}
              initial={{ opacity: 0, scale: 0.5, y: 0, rotate: 0 }}
              animate={{
                y: "-120vh",
                x: [0, i % 2 === 0 ? 30 : -30, 0],
                scale: [0.7, 1.1, 0.8],
                opacity: [0, 0.6, 0],
                rotate: 360
              }}
              transition={{
                duration: 15 + i * 3,
                ease: "linear",
                repeat: Infinity,
                delay: item.delay,
              }}
            >
              {/* DIAMOND REFRACTION EFFECT */}
              <div className={`absolute inset-0 rounded-[35%] bg-gradient-to-br ${item.color} to-transparent backdrop-blur-[8px] border-[0.5px] border-white/30 rotate-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]`} />
              
              {/* INTERNAL NEON CORE */}
              <div className="absolute inset-[20%] rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-[2px]" />
              
              {/* SHARP REFLECTION SPECK */}
              <div className="absolute top-[15%] left-[15%] w-[15%] h-[15%] bg-white/60 rounded-full blur-[1px]" />
              
              {/* SECONDARY GLOW */}
              <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-[40px]" />
            </motion.div>
          ))}
        </div>

        {/* CURVE SVG */}
        <div className="absolute top-[55%] md:top-[12%] left-1/2 -translate-x-1/2 w-full max-w-[1600px] pointer-events-none">
          <svg viewBox="0 0 1600 600" className="w-full h-auto overflow-visible">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              d="M0 260 Q800 720 1600 260"
              stroke="url(#curveGradient)"
              strokeWidth="10"
              fill="transparent"
              style={{
                filter: "drop-shadow(0 0 30px #3b82f6)",
                willChange: "filter"
              }}
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.1, ease: "easeInOut" }}
              d="M0 260 Q800 720 1600 260"
              stroke="url(#whiteFade)"
              strokeWidth="2"
              fill="transparent"
            />
            <defs>
              <linearGradient id="curveGradient">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
                <stop offset="15%" stopColor="#00E5FF" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="85%" stopColor="#A020F0" />
                <stop offset="100%" stopColor="#A020F0" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="whiteFade">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="20%" stopColor="white" />
                <stop offset="80%" stopColor="white" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* WATER DROPS */}
        <div className="absolute top-[55%] md:top-[12%] left-1/2 -translate-x-1/2 w-full max-w-[1600px] pointer-events-none">
          <svg viewBox="0 0 1600 600" className="w-full h-auto overflow-visible">
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                r={2 + Math.random() * 2}
                fill="white"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  ease: "linear",
                  repeat: Infinity,
                  delay: i * 1.2
                }}
                style={{
                  offsetPath: "path('M0 260 Q800 720 1600 260')",
                  filter: "drop-shadow(0 0 4px #00E5FF)",
                  willChange: "transform"
                }}
              />
            ))}
          </svg>
        </div>

        {/* CONTENT SECTION */}
        <div className="relative z-20 w-full max-w-[1200px] px-6 flex flex-col items-center text-center">
          <motion.h1
            initial={
              hasAnimated ? false : { opacity: 0, filter: "blur(14px)", letterSpacing: "0.3em" }
            }
            animate={{ opacity: 1, filter: "blur(0px)", letterSpacing: "0.8em" }}
            transition={{ delay: 0.5, duration: 1.2, ease: "anticipate" }}
            className="text-4xl sm:text-6xl md:text-8xl font-semibold 
            tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.8em] text-white"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
             <span className="inline-block translate-x-[0.4em]">CANDID</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
          >
            RESOURCING PARTNERS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-5 text-gray-300 max-w-2xl"
          >
            Connecting Talent to Opportunity & Find the Perfect Fit with Us. Strategic recruitment solutions across banking, finance, IT and healthcare industries.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            onClick={() => navigate("/about")}
            className="mt-10 px-14 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
          >
            Explore
          </motion.button>
        </div>

        {/* BOTTOM FADE */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
</section>
    </div>

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] w-full overflow-hidden">

        {/* SLIDER */}
        <motion.div
          className="flex h-full"
          animate={{ x: `-${current * 100}%` }}
          transition={
            isAnimating
              ? { duration: 0.8, ease: "easeInOut" }
              : { duration: 0 }
          }
        >
          {slides.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </motion.div>

        

        {/* OVERLAY */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#1f0434]/90 via-[#0d0764]/20 to-transparent"></div> */}
         <div
  className="absolute inset-0"
  style={{
    background: `linear-gradient(
      to right,
      rgba(31, 4, 52, 0.95) 0%,     /* LEFT - strong dark */
      rgba(13, 7, 100, 0.6) 20%,    /* MIDDLE - smooth blend */
      rgba(13, 7, 100, 0.2) 50%,    /* RIGHT FADE START */
      rgba(13, 7, 100, 0) 100%      /* FULL TRANSPARENT */
    )`
  }}
></div>
        
<div className="absolute inset-0 z-10 flex items-center justify-start px-16 text-white">
  <motion.div
    className="max-w-2xl text-left"
    initial={{ opacity: 0, x: -80 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >

    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
      FIND THE PERFECT{" "}
      <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
         FIT WITH US!
      </span>
    </h1>

    <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
      Our team brings extensive knowledge of your specific talent requirements across industries.
    </p>

    

  </motion.div>
  
   {/* DIAMOND INDICATORS */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
  {heroImages.map((_, index) => (
    <button
      key={index}
      onClick={() => {
        setCurrent(index + 1);
        setIsPaused(true);

        setTimeout(() => {
          setIsPaused(false);
        }, 5000);
      }}
      className={`text-xl transition-all ${
        current === index + 1
          ? "text-purple-700 scale-125"
          : "text-white/90"
      }`}
    >
      ◈
    </button>
  ))}
</div>
  
</div> 





      </section>

      {/* ================= ABOUT ================= */}
      <motion.section
        ref={ref}
        className="py-20 bg-white overflow-hidden"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid md:grid-cols-2 items-center max-w-[1200px] mx-auto relative">

          {/* TEXT → FROM LEFT */}
          <motion.div 
            variants={fadeLeft}
            className="px-6 md:px-0 md:-ml-20"
          >
          <span className="bg-gradient-to-r from-purple-900 to-purple-500  text-yellow-400 px-3 py-2 rounded-full text-sm font-medium">
            
            ABOUT US
          </span>
          

          <h2 className="text-4xl font-bold mt-4 mb-4 text-[#531192]">
            Global Reach, Local Expertise
          </h2>
          <br/>

          <p className="text-gray-600 mb-6">
            At Candid Resourcing Partners Ltd, we focus on solving recruitment challenges by delivering the right talent that fuels business growth and long-term success.
            <br/><br/>
            With strong expertise across banking, finance, IT, and healthcare, we use market insights and extensive networks to provide accurate, tailored hiring solutions. From junior roles to senior leadership, we ensure every placement aligns with your objectives and contributes to lasting organisational success.
          </p>

          <h2 className="text-xl font-bold mt-4 mb-4 text-[#3d0275]">
              CORE COMPETENCIES
            </h2>

            <motion.ul
              className="text-gray-600 mb-6 space-y-1 overflow-hidden"
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {["Banking", "IT", "Finance", "Healthcare"].map((item, i) => (
                <motion.li key={i} variants={listItem}>
                  • {item}
                </motion.li>
              ))}
            </motion.ul>
        </motion.div>



        

        {/* IMAGE → FROM RIGHT */}
    <motion.div 
      variants={fadeRight}
      className="flex justify-center"
    >
      <img 
        src={aboutImg2} 
        className="rounded-xl w-90  md:-ml-0 md:-mr-40"  
          
        />
    </motion.div>

  </div>
</motion.section>

    

      {/* ================= SERVICES ================= */}
<section className="py-20 px-16 bg-gray-50 text-center">
  <span className="bg-gradient-to-r from-purple-900 to-purple-500  text-yellow-400 px-3 py-2 rounded-full text-sm">
    OUR SERVICES
  </span>

 
    <h2 className="text-4xl font-bold mt-4 mb-10 text-[#531192] ">
    OUR RECRUITMENT SOLUTIONS
    </h2>
 

 

<motion.div
  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-50px" }}
>
  {[
    {
      title: "Permanent Recruitment",
      desc: "We leverage proven recruitment strategies to identify and deliver highly skilled professionals across multiple industries, ensuring the right long-term fit for your organisation.",
    },
    {
      title: "Executive Search",
      desc: "Our retained and executive search services prioritise your hiring needs, enabling access to top-tier and hard-to-reach talent through targeted headhunting expertise.",
    },
    {
      title: "Contract Hiring",
      desc: "We provide flexible contract hiring solutions, both inside and outside IR35, helping you scale your workforce efficiently based on project requirements.",
    },
    {
      title: "RPO Consultancy",
      desc: "From supporting your internal team to fully managing your recruitment process, we deliver strategic insights, improved efficiency, and cost-effective hiring solutions.",
    },
    {
      title: "Bespoke Solutions",
      desc: "Every organisation is unique. We design customised recruitment solutions tailored to your specific hiring challenges and business objectives.",
    },
    {
      title: "Talent Advisory",
      desc: "Our experts provide market insights, talent trends, and strategic guidance to help you make informed hiring decisions and stay ahead of the competition.",
    },
  ].map((item, i) => (
    <motion.div
      key={i}
      variants={cardAnimation}
      whileHover={{
        scale: 1.04,
        y: -8,
        boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
      }}
      className="bg-white p-6 rounded-xl shadow text-left transition-all"
    >
      <h3 className="font-semibold mb-3 text-[#0b2c5a]">
        {item.title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        {item.desc}
      </p>
    </motion.div>
  ))}
</motion.div>
</section>

{/* ================= CTA ================= */}
<motion.section
  className="relative py-20 px-6 md:px-16
  bg-gradient-to-r from-[#1f0638] via-[#5b2c91] to-[#9b5de5]
  text-white overflow-hidden"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1 }}
>

{/* TEXTURE */}
<div className="absolute inset-0 pointer-events-none z-[1]">
  <div
    className="w-full h-full"
    style={{
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 2px, transparent 2px),
        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.10) 3px, transparent 3px),
        radial-gradient(circle at 60% 20%, rgba(255,255,255,0.08) 2px, transparent 2px),
        conic-gradient(from 45deg at 30% 40%, rgba(255,255,255,0.06), transparent 60%),
        conic-gradient(from 120deg at 70% 60%, rgba(255,255,255,0.05), transparent 70%)
      `,
      backgroundSize: "120px 120px, 150px 150px, 180px 180px, 300px 300px, 400px 400px",
    }}
  />
</div>

{/* CONTENT */}
<div className="
  relative z-10 
  w-full max-w-[1200px] mx-auto
  flex flex-col md:flex-row
  md:items-center md:justify-between
  gap-8 md:gap-12
">

  {/* TEXT */}
  <div className="max-w-[650px] text-left">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
      Meet Your HR Needs with India's Leading Recruitment Agency
    </h2>
    <p className="text-gray-200 mt-3">
      Discover end-to-end HR solutions.
    </p>
  </div>

  {/* BUTTON */}
  <motion.button
    onClick={() => navigate("/about")}
    whileHover={{ scale: 1.05 }}
    className="bg-white text-black px-6 py-3 rounded-full w-fit md:shrink-0"
  >
    Explore More →
  </motion.button>

</div>
</motion.section>

      {/* ================= INVESTORS ================= */}
      <motion.section
        className="py-20 px-16 grid md:grid-cols-2 gap-10 items-center"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp}>
          <span className="bg-gradient-to-r from-purple-900 to-purple-500  text-yellow-400 px-3 py-2 rounded-full text-sm">
            INVESTORS
          </span>

          <h2 className="text-4xl font-bold mt-4 mb-4 text-[#531192]">
            GLOBAL TALENT SOLUTIONS
          </h2>

          <p className="text-gray-600">
            We are a young company with a proven track record of commitment to long-term value creation. Our approach is rooted in commitment, innovation, and a deep understanding of evolving business needs.
            <br/><br/>
            By leveraging advanced technology and data-driven insights, we are strategically positioned to create sustainable value for our clients and partners. As the Indian economy continues to grow, the demand for skilled talent is expected to rise significantly—presenting a strong opportunity for us to expand our capabilities and deliver impactful recruitment solutions.
            <br/><br/>
            At Candid Resourcing Partners Ltd, we are focused on connecting the right talent with the right opportunities, enabling organizations to scale, innovate, and succeed in an increasingly competitive landscape.

          </p>

          
        </motion.div>

        <motion.img variants={fadeUp} src={hero4} />
      </motion.section>

      
            {/* 🔵 LEADERS SECTION */}
            <div className="relative min-h-[50vh] flex items-center justify-center 
            bg-gradient-to-br from-[#0b1a3a] via-[#3b0a6b] to-[#6d28d9] 
            text-white overflow-hidden py-10">     {/* Background Lighting */}
                  {/* BACKGROUND PREVIEW BELT: Moving in the background layer */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 overflow-hidden">
                    <div className="flex gap-4 px-4 grayscale brightness-100">
                      {getBeltIndices().map((item) => (
                        <div key={item.key} className="w-48 h-64 flex-shrink-0">
                          <img src={item.image} className="w-full h-full object-cover" alt="" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* UI LAYER: Content that needs to be positioned precisely */}
            <div className="relative w-full max-w-[1600px] px-12 mx-auto flex items-center justify-center">       
                    {/* TEXT CONTENT: Positioned on the left, independent of the box */}
              <div className="
                relative md:absolute
                mt-6 md:mt-0
                md:top-1/2 
                md:left-24 
                md:-translate-y-1/2 
                z-50 
                w-full md:w-fit 
                text-center md:text-left
                pointer-events-none
              ">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-gray-400 text-sm sm:text-lg md:text-3xl font-semibold uppercase">
                {currentSlide.title}
              </h2>
              <h1 className="text-3xl sm:text-4xl md:text-8xl font-bold tracking-tighter mt-2 leading-[1.1] flex flex-col">
                {currentSlide.subtitle.split(' ').map((word, i) => (
                  <span key={i}>{word}</span>
                ))}
              </h1>
              <p className="mt-4 text-gray-300 max-w-full md:max-w-xs text-xs sm:text-sm leading-relaxed">
                Focused on delivering an unparalleled, personalized experience.
              </p>
              <div 
  onClick={() => navigate("/team")}
className="mt-4 flex items-center justify-center md:justify-start gap-2 group cursor-pointer pointer-events-auto"
>
  <span className="text-blue-500 text-xs font-bold tracking-[0.2em] uppercase group-hover:text-purple-400 transition-colors">
    View all leaders
  </span>
  <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
    →
  </span>
</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* THE CENTER BOX: Fixed in the center of the viewport */}
      <div className="relative z-40 flex justify-center items-center w-full">  
       <div className="p-1 border-2 border-dotted border-white/20 rounded-sm">
            <div className="relative w-[200px] h-[280px] sm:w-[260px] sm:h-[360px] md:w-[360px] md:h-[500px] bg-transparent overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.9)]">
              
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={currentSlide.id}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentSlide.image}
                    className="w-full h-full object-cover brightness-100 grayscale-0"
                    alt={currentSlide.subtitle}
                  />
                  {/* Subtle color grading overlay */}
                  <div className="absolute inset-0 bg-purple-900/5 mix-blend-overlay pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* BOTTOM PROMPT BAR: Anchored to bottom of image box */}
              <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-6 bg-black p-4 flex items-center justify-between border border-white/5 shadow-2xl z-50">
                <div className="flex-1 mr-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={`prompt-${currentSlide.id}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] font-bold tracking-wider uppercase text-center"
                    >
                      <span className="text-white/40">HEY</span>{" "}
                      <span className="text-blue-500">@TEAM</span>,{" "}
                      {currentSlide.prompt.split('@TEAM,')[1]}
                    </motion.p>
                  </AnimatePresence>
                </div>
                
              </div>
            </div>
          </div>
        </div>

      </div>

      

      {/* Film Grain Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div> 

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 px-16 bg-gray-50">
  <h2 className="text-4xl font-bold mb-10 text-[#531192]">
    OUR LATEST CLIENT'S FEEDBACK
  </h2>

  <motion.div
    className="grid md:grid-cols-3 gap-8"
    variants={stagger}
    initial="hidden"
    animate="show"
  >
    {[
      {
        text: "Candid Resourcing Partners is a highly reliable partner who successfully fills critical positions in record time. They have a thorough understanding of the talent landscape and are a great recruitment partner.",
      },
      {
        text: "CANDID has provided us with excellent service over the years. Whenever there is an urgent requirement, we rely on them, knowing they will deliver without fail.",
      },
      {
        text: "The team at Candidrp truly understands our recruitment needs and process flow. Their professional and friendly approach consistently delivers quality results.",
      },
    ].map((item, i) => (
      <motion.div
        key={i}
        variants={fadeUp}
        whileHover={{ scale: 1.05 }}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
      >
        {/* Quote Icon */}
        <div className="text-purple-700 text-3xl mb-3">❝</div>

        {/* Feedback */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {item.text}
        </p>

        {/* Client Name */}
        
      </motion.div>
    ))}
  </motion.div>
</section>

      
     

    </div>
  );
}
















