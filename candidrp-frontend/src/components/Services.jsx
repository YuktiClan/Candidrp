import hero from "../assets/Services.png";
import ContactSection from "../components/ContactSection";
import { motion } from "framer-motion";

// ✅ ANIMATIONS
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Services() {
  return (
    <div className="bg-white">

      {/* 🔵 HERO */}
      <section
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
    Customised Solutions Which{" "}
    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
    Address Those Specific Needs
  </span>
</h1>

  <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
        Your Strategic Partner in Exceptional Talent Acquisition
  </p>
  

 
  
</motion.div>
{/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* 🔵 INTRO */}
      <motion.section
        className="px-10 py-16 max-w-6xl mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-bold text-[#531192] mb-6 text-center mx-auto max-w-3xl"
            >
            Your Strategic Partner in Exceptional Talent Acquisition
        </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 leading-relaxed mb-6 text-center mx-auto max-w-6xl"
          >
            At Candid Resourcing Partners Ltd, we don’t just fill roles — we solve hiring challenges. Our approach is built on deep industry understanding, strategic thinking, and a commitment to delivering measurable results. We connect organisations with high-calibre professionals who drive innovation, enhance productivity, and create long-term business value.
        </motion.p>
         <br/><br/>

        <motion.h3 variants={fadeUp} className="text-1xl font-semibold text-[#3d0275] mb-3">
          Industry-Led Expertise. Precision-Driven Results.
        </motion.h3>

        <motion.p variants={fadeUp} className="text-gray-600 mb-6">
          With strong expertise across banking, finance, IT, and healthcare, we understand the nuances of each industry. Our recruitment specialists leverage powerful regional networks, advanced sourcing tools, and real-time market insights to identify top-tier candidates with unmatched accuracy.
        </motion.p>

        <motion.h3 variants={fadeUp} className="text-1xl font-semibold text-[#3d0275] mb-3">
          Insight-Backed Recruitment for a Competitive Edge
        </motion.h3>

        <motion.p variants={fadeUp} className="text-gray-600 mb-6">
          We continuously track talent trends, skill availability, and industry movements. This allows us to craft intelligent hiring strategies that reduce hiring time, minimise attrition, and improve workforce quality — giving your organisation a competitive advantage.
        </motion.p>

        <motion.h3 variants={fadeUp} className="text-1xl font-semibold text-[#3d0275] mb-3">
          Talent That Elevates Your Organisation
        </motion.h3>

        <motion.p variants={fadeUp} className="text-gray-600">
          From entry-level professionals to senior leadership roles, we source, assess, and place candidates who align with your company’s culture, vision, and long-term goals. Our mission is to help both organisations and candidates succeed and grow together.
        </motion.p>
      </motion.section>

      {/* 🔵 CORE COMPETENCIES */}
      <motion.section
        className="bg-gray-50 py-16 px-10"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold text-center text-[#531192] mb-10">
          Core Competencies
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6">
          {["Banking", "Information Technology", "Finance", "Healthcare"].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.08 }}
              className="px-6 py-3 bg-white rounded-full shadow border text-gray-700 font-medium"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 🔵 SERVICES CARDS */}
      <motion.section
        className="px-10 py-16 max-w-6xl mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.h2 variants={fadeUp} className="text-4xl font-bold text-[#531192] mb-10">
          Customised Recruitment Solutions
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {[
            {
              title: "Permanent Recruitment",
              desc: "Our proven recruitment methodologies enable us to identify, attract, and place highly skilled professionals across diverse industries. We ensure long-term success by matching candidates not only with job requirements but also with organisational culture.",
            },
            {
              title: "Executive Search",
              desc: "Our executive and retained search services are designed to deliver top leadership talent. Through targeted headhunting and deep market intelligence, we help you access exclusive, high-impact professionals.",
            },
            {
              title: "Contract Hiring",
              desc: "We provide flexible workforce solutions tailored to your business needs. Whether inside or outside IR35, we ensure rapid deployment of skilled professionals for short-term and project-based roles.",
            },
            {
              title: "RPO Consultancy",
              desc: "We partner with organisations to optimise their recruitment process. From strategic advisory to full-cycle recruitment outsourcing, we enhance efficiency while reducing hiring costs.",
            },
            {
              title: "Bespoke Solutions",
              desc: "Every organisation has unique hiring challenges. We design tailored recruitment strategies that align with your business goals, ensuring precise and effective talent acquisition.",
            },
            {
              title: "Talent Advisory",
              desc: "Our experts provide actionable insights on market trends, salary benchmarks, and workforce planning. This enables smarter hiring decisions and long-term workforce success.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{
                scale: 1.05,
                y: -8,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
              }}
              className="bg-white p-6 rounded-xl border shadow-sm text-left"
            >
              <h3 className="font-semibold mb-3 text-[#0b2c5a]">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>

        <motion.p
          variants={fadeUp}
          className="mt-10 text-purple-700 font-semibold"
        >
          Let’s talk more about your needs when you speak with Sandra or Avinash.
        </motion.p>
      </motion.section>

      {/* 🔵 CONTACT */}
      <ContactSection />

    </div>
  );
}