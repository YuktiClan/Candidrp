import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/About.png";
import { Link } from "react-router-dom";
import ContactSection from "../components/ContactSection";
import img1 from "../assets/AvinashChander.png";
import img2 from "../assets/MerlynChander.png";
import img3 from "../assets/SandraShantanu.png";
import img4 from "../assets/RishabhShantanu.png";
import img5 from "../assets/SatishKumar.png"; 



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

export default function About() {

  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES[currentIndex];


    const getBeltIndices = () => {
    const indices = [];
    for (let i = -5; i <= 5; i++) {
      let idx = (currentIndex + i) % SLIDES.length;
      if (idx < 0) idx = SLIDES.length + idx;
      indices.push({ key: `${idx}-${i}`, image: SLIDES[idx].image });
    }
    return indices;
  };

  
  return (
    <div className="bg-white">

      {/* 🔵 HERO SECTION */}
      <div
        className="h-[500px] flex items-center px-10 text-white relative"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#1f0638]/90 via-[#5b2c91]/40 to-[]/70"></div> */}
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
        <motion.div
  initial={{ opacity: 0, x: -80 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  className="relative z-10 max-w-5xl"
>
  
  
  <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] max-w-3xl">
    About {" "}
    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
    Us
  </span>
</h1>

  <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
        Helping our clients build meaningful partnerships that drive long term success
  </p>

  
</motion.div>
{/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* 🔵 CONTENT SECTION (YOUR TEXT) */}
      <motion.div
      className="max-w-6xl mx-auto px-6 py-16 text-gray-700 space-y-6"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >

        

        <motion.p
          variants={fadeUp}
          className="leading-relaxed text-center mx-auto max-w-6xl"
        >
        At <strong>Candid Resourcing Partners Ltd</strong>, we don’t just fill roles — 
        we solve hiring challenges. With deep sector expertise and a clear understanding 
        of your business landscape, we deliver measurable results by connecting you with 
        high-calibre professionals who drive growth, innovation, and long-term success.
        </motion.p>

        <motion.p
            variants={fadeUp}
            className="leading-relaxed text-center mx-auto max-w-5xl"
          >
        We believe recruitment is more than matching skills to job descriptions — 
        it’s about building meaningful partnerships that create lasting value.
         </motion.p>

        <br/> <br/> <br/>

        <motion.p variants={fadeUp} className="leading-relaxed">
            <strong>Industry‑Led Expertise. Precision‑Driven Results</strong><br/>

            Our team brings extensive knowledge of your specific talent requirements across banking, finance, IT, and healthcare. Leveraging powerful regional networks and market intelligence, we identify exceptional candidates faster and with unmatched accuracy — ensuring every hire aligns with your goals and culture.
        </motion.p>
       
        <motion.p variants={fadeUp} className="leading-relaxed">
            <strong>Insight‑Backed Recruitment for a Competitive Edge</strong><br/>

           We continuously monitor talent availability, skill trends, and industry shifts to craft tailored recruitment strategies that reduce turnover and strengthen organisational performance. Whether you’re scaling rapidly or hiring for niche, business‑critical roles, our specialists deliver solutions that keep you ahead.
         </motion.p>
       
        <motion.p variants={fadeUp} className="leading-relaxed">
            <strong>Talent That Elevates Your Organisation</strong><br/>

            From entry‑level professionals to senior leadership, our experts source and secure the best talent at every level. With our proven methodology and commitment to excellence, we help organisations and candidates thrive — fostering innovation, stability, and sustainable success.
         </motion.p>

        <br/><br/><br/>

        <div>
          <h3 className="font-semibold text-lg mb-1">Who We Are</h3>
         <motion.p variants={fadeUp} className="leading-relaxed">
            We are a specialist recruitment partner with deep expertise across <strong>banking, finance, IT, and healthcare</strong>. Our team brings years of hands‑on experience, strong regional networks, and a clear understanding of the evolving talent landscape. This allows us to deliver recruitment solutions that are fast, accurate, and aligned with your strategic goals.
         </motion.p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-1">What We Do</h3>
          <motion.p variants={fadeUp} className="leading-relaxed">
            We connect businesses with exceptional professionals — from emerging talent to senior leadership. By combining market intelligence with a personalised approach, we ensure every placement strengthens your organisation’s performance and culture. Our commitment to quality means we focus on long‑term fit, not short‑term fixes.
          </motion.p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-1">How We Work</h3>
          <motion.p variants={fadeUp} className="leading-relaxed">
            We monitor industry trends, talent availability, and skill-market shifts to stay ahead of your hiring needs. Our tailored recruitment strategies reduce turnover, enhance workforce stability, and give you a competitive edge. Whether you’re scaling rapidly or hiring for niche, business‑critical roles, we deliver solutions that work.
          </motion.p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-1">Our Promise</h3>
          <p>
            We are dedicated to creating value for both clients and candidates. With our unmatched experience and people‑first approach, we help organisations thrive and professionals build meaningful careers. At Candid Resourcing Partners Ltd, we don’t just recruit — we empower growth.
          </p>
        </div>
      </motion.div>
    
    <motion.section
  className="py-20 px-16 bg-gray-50"
  initial="hidden"
  animate="show"
  variants={stagger}
>
  <div className="max-w-6xl mx-auto text-center">

    {/* HEADING */}
    <motion.h2
      variants={fadeUp}
      className="text-3xl md:text-4xl font-bold text-[#2f1475] mb-4"
    >
      How We Deliver the Perfect Fit
    </motion.h2>

    <motion.p
      variants={fadeUp}
      className="text-gray-600 max-w-3xl mx-auto mb-12"
    >
      Our approach combines deep business understanding with candidate insights 
      to ensure every placement creates long-term value for both organisations and professionals.
    </motion.p>

    {/* CARDS */}
    <motion.div
      variants={stagger}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
    >
      {[
        {
          title: "Understanding Goals & Potential",
          desc: "We fully understand organisational goals and candidate potential to ensure the best placement decisions and the ideal fit for both parties.",
        },
        {
          title: "Precise Role Matching",
          desc: "We analyse role responsibilities in depth to accurately match candidate qualifications with client requirements.",
        },
        {
          title: "Beyond Technical Skills",
          desc: "We value social and interpersonal abilities alongside technical expertise, recognising their impact on productivity, satisfaction, and team dynamics.",
        },
        {
          title: "Social Intelligence Evaluation",
          desc: "By assessing a candidate’s social intelligence, we make informed decisions that benefit both the organisation and the individual.",
        },
        {
          title: "Long-Term Alignment",
          desc: "Our approach goes beyond initial placement—we focus on sustained success and alignment between employer and employee.",
        },
        {
          title: "Global Network Strength",
          desc: "Our UK office collaborates seamlessly with global teams, leveraging international expertise to deliver locally implemented recruitment solutions worldwide.",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <h3 className="font-semibold text-lg text-[#0b2c5a] mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </motion.div>

  </div>
</motion.section>




      

      {/* 🔵 DNA SECTION */}
{/* 🔵 DNA SECTION - PREMIUM STYLE */}
<section className="py-24 px-6 bg-gradient-to-r from-[#2a084d] via-[#4c1d95] to-[#7c3aed] text-white">

  <div className="max-w-6xl mx-auto text-center">

    {/* HEADING */}
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      Our DNA
    </h2>

    <p className="text-purple-200 max-w-2xl mx-auto mb-16">
      The foundation of our success lies in our values, vision, and commitment 
      to delivering exceptional recruitment solutions globally.
    </p>

    {/* CARDS */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      {[
        {
          title: "Vision",
          text: "To be a trusted global recruitment partner, delivering exceptional talent solutions that drive long-term business success.",
        },
        {
          title: "Mission",
          text: "To connect organisations with the right talent through insight-driven recruitment, ensuring the perfect fit for both clients and candidates.",
        },
        {
          title: "Values",
          text: "Integrity, client-centricity, collaboration, and a commitment to excellence guide everything we do.",
        },
        {
          title: "Who We Are",
          text: "A specialist recruitment partner with deep expertise across banking, finance, IT, and healthcare.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 text-left 
          hover:scale-105 hover:bg-white/20 transition-all duration-300 shadow-lg"
        >
          {/* NUMBER */}
          <div className="text-sm text-purple-300 mb-2">
            0{i + 1}
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-semibold mb-3">
            {item.title}
          </h3>

          {/* TEXT */}
          <p className="text-purple-100 text-sm leading-relaxed">
            {item.text}
          </p>
        </div>
      ))}

    </div>
  </div>
</section>

      {/* 🔵 LEADERS SECTION */}


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




<ContactSection />

    </div>
  );
}