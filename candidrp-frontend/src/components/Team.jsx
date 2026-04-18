import { motion, AnimatePresence } from "framer-motion";
import hero from "../assets/Team.png";
import { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import ContactSection from "../components/ContactSection";
import img1 from "../assets/AvinashChander.png";
import img2 from "../assets/MerlynChander.png";
import img3 from "../assets/SandraShantanu.png";
import img4 from "../assets/RishabhShantanu.png";
import img5 from "../assets/SatishKumar.png";

const team = [
    {
        name: "Avinash Chander",
        role: "Director - United Kingdom",
        img: img1,
        linkedin: "https://www.linkedin.com/in/avinashchander-epicconsultant/",
        desc: "Avinash Chander is a distinguished digital transformation leader with 16+ years of global healthcare experience. With a clinical foundation in physiotherapy and deep expertise in digital innovation, he has spent his career optimising systems, workflows, and operational performance across complex healthcare environments. This rare blend of clinical, technical, and managerial insight enables him to understand organisational needs with exceptional clarity — translating them into highly accurate talent assessments and precision‑driven recruitment outcomes.His strong business development acumen further strengthens his impact, allowing him to build trusted client partnerships, identify emerging talent needs, and deliver solutions that align seamlessly with organisational goals. By combining domain expertise with strategic relationship‑building, Avinash consistently drives both recruitment excellence and sustainable business growth.",
    },
    {
        name: "Merlyn Chander",
        role: "Director - United Kingdom",
        img: img2,
        linkedin: "https://www.linkedin.com/in/merlyn-chander-27194819/",
        desc: "Merlyn Chander  is a distinguished nursing leader and a gold medallist in both BSc and MSc Nursing, celebrated for her academic excellence and strategic influence across the healthcare sector. As a former Chief Nursing Officer and Quality Leader, she has shaped clinical standards, strengthened patient safety frameworks, and driven transformative quality improvement initiatives across diverse care settings.Now serving within the NHS and enrolled in the prestigious NHS Chief Nurse Program, she brings a powerful blend of clinical authority, operational insight, and leadership experience into healthcare recruitment. Her deep understanding of frontline realities, workforce dynamics, and organisational needs enables her to identify, assess, and elevate top nursing talent with unmatched precision. Her business development strengths further enhance her impact—allowing her to build trusted client partnerships, anticipate evolving workforce requirements, and deliver recruitment solutions that align seamlessly with service quality, regulatory expectations, and long‑term organisational goals.",
    },
    {
        name: "Sandra Shantanu",
        role: "Business Manager Global Operations",
        img: img3,
        linkedin: "https://www.linkedin.com/in/sandra-shantanu-b12b9418/",
        desc: "Sandra Shantanu is a seasoned finance and fintech professional with 16 years of expertise in credit risk, financial analysis, and technology‑driven solutions. Over the course of her career, she has led high‑impact risk initiatives, strengthened credit frameworks, and enabled strategic growth across competitive markets. Her deep understanding of financial systems, risk dynamics, and tech‑enabled processes gives her an exceptional ability to interpret organisational needs with accuracy and foresight. Leveraging this domain expertise—combined with her recruitment capability and strong business‑development drive—she now builds trusted client partnerships and delivers precision hiring across finance, fintech, and risk domains. Her ability to align talent strategy with business objectives makes her a powerful catalyst for both organisational performance and long‑term client success.",
    },
    {
        name: "Rishabh Shantanu",
        role: "Partner - India",
        img: img4,
        linkedin: "https://www.linkedin.com/in/rishabh-shantanu-05300597/",
        desc: "Rishabh Shantanu is an accomplished banking professional with 17+ years of experience across UK and Indian financial institutions, specialising in forex operations, retail banking, and financial crime compliance. His career reflects a strong blend of operational leadership, regulatory expertise, and analytical capability—enabling him to navigate complex banking environments with precision and confidence. By leveraging this deep domain knowledge, he brings valuable insight into recruitment for banking and financial‑services roles. His understanding of compliance standards, operational workflows, and risk controls allows him to identify and assess talent with exceptional accuracy. Combined with his business‑development strengths, he builds trusted client relationships and delivers recruitment solutions that align seamlessly with organisational needs and regulatory expectations.",
    },
    {
        name: "Satish Kumar",
        role: "Partner - India",
        img: img5,
        linkedin: "https://www.linkedin.com/company/candid-resourcing-partners-ltd/",
        desc: "Satish Kumar is a seasoned Accounts and Finance professional with over four decades of distinguished experience across major public‑sector undertakings. His career reflects deep expertise in financial management, compliance, budgeting, audit coordination, and strategic fiscal planning—consistently driving operational efficiency and governance excellence within large, complex environments. Leveraging this extensive domain knowledge, he brings exceptional insight into recruitment for finance, accounts, and public‑sector‑aligned roles. His understanding of regulatory frameworks, financial controls, and organisational structures enables him to identify and evaluate talent with unmatched accuracy. Combined with his strong business‑development acumen, he builds trusted client relationships and delivers recruitment solutions that align seamlessly with institutional needs, compliance expectations, and long‑term organisational goals.",
    },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Team() {
    const [active, setActive] = useState(null);

    return (
        <div className="bg-white">

            {/* HERO */}
            <div
                className="h-[500px] flex items-center px-10 text-white relative"
                style={{
                    backgroundImage: `url(${hero})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 30%",
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
                    Our {" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Leaders
                  </span>
                </h1>

                  <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
                        Focused on providing an unparalleled, personalized client experience
                  </p>
                </motion.div>
                {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        
            </div>

            {/* 🔵 LEADER INTRO SECTION */}
              <motion.div
                className="max-w-6xl mx-auto px-6 py-16 text-gray-700 space-y-6"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >

                {/* LEADER STATEMENT */}
                <motion.p
                  variants={fadeUp}
                  className="leading-relaxed text-center mx-auto max-w-5xl"
                >
                  <strong>
                    Our leaders are driven by a commitment to excellence, offering a truly personalised approach that goes beyond recruitment.
                  </strong>
                </motion.p>

                {/* DESCRIPTION */}
                <motion.p
                  variants={fadeUp}
                  className="leading-relaxed text-center mx-auto max-w-3xl"
                >
                  With a clear vision and deep market insight, they ensure every engagement delivers impact, precision, and long-term growth for our clients.
                </motion.p>

              </motion.div>

            

            

            
{/* TEAM GRID */}
<div className="w-full px-4 md:px-10 py-20">
  

  {/*
    STEP 1:
    First 3 members → normal grid
  */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-20 max-w-6xl mx-auto">

    {team.slice(0, 3).map((member, i) => (
      <div key={i} className="w-full max-w-[320px] mx-auto">

        {/* IMAGE */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <motion.img
              src={member.img}
              alt={member.name}
              whileHover={{ scale: 1.05 }}
              className="w-full h-[340px] object-cover"
            />
          </div>

          {/* CARD */}
          <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 bg-[#e3c05a] px-5 py-4 w-[92%] rounded-lg shadow-xl min-h-[130px] flex flex-col justify-between">

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-semibold text-[#1f3b73]">
                  {member.name}
                </h3>
                <p className="text-xs text-gray-800">
                  {member.role}
                </p>
              </div>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1f3b73] w-8 h-8 flex items-center justify-center rounded-sm text-white"
              >
                <FaLinkedin size={14} />
              </a>
            </div>

            <button
              onClick={() => setActive(member)}
              className="w-full bg-[#1f3b73] text-white text-sm py-2 rounded hover:bg-[#16337a] transition"
            >
              About {member.name.split(" ")[0]}
            </button>

          </div>
        </div>

      </div>
    ))}

  </div>

  {/*
    STEP 2:
    Remaining members → centered row
  */}
  <div className="flex justify-center gap-10 mt-20 flex-wrap">

    {team.slice(3).map((member, i) => (
      <div key={i} className="w-full max-w-[320px]">

        {/* IMAGE */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <motion.img
              src={member.img}
              alt={member.name}
              whileHover={{ scale: 1.05 }}
              className="w-full h-[340px] object-cover"
            />
          </div>

          {/* CARD */}
          <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 bg-[#e3c05a] px-5 py-4 w-[92%] rounded-lg shadow-xl min-h-[130px] flex flex-col justify-between">

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-semibold text-[#1f3b73]">
                  {member.name}
                </h3>
                <p className="text-xs text-gray-800">
                  {member.role}
                </p>
              </div>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1f3b73] w-8 h-8 flex items-center justify-center rounded-sm text-white"
              >
                <FaLinkedin size={14} />
              </a>
            </div>

            <button
              onClick={() => setActive(member)}
              className="w-full bg-[#1f3b73] text-white text-sm py-2 rounded hover:bg-[#16337a] transition"
            >
              About {member.name.split(" ")[0]}
            </button>

          </div>
        </div>

      </div>
    ))}

  </div>

</div>


            {/* MODAL */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActive(null)}
                    >
                        <motion.div
                            className="bg-white max-w-2xl w-full rounded-2xl p-8 relative shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* CLOSE */}
                            <button
                                onClick={() => setActive(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
                            >
                                ✕
                            </button>

                            {/* IMAGE */}
                            <img
                                src={active.img}
                                alt={active.name}
                                className="w-28 h-28 rounded-full object-cover mx-auto mb-4"
                            />

                            {/* NAME */}
                            <h2 className="text-2xl font-bold text-center text-[#1f3b73]">
                                {active.name}
                            </h2>

                            {/* ROLE */}
                            <p className="text-center text-gray-500 mb-4">
                                {active.role}
                            </p>

                            {/* LINKEDIN */}
                            <div className="flex justify-center mb-4">
                                <a
                                    href={active.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#1f3b73] text-white px-4 py-2 rounded-md flex items-center gap-2"
                                >
                                    <FaLinkedin /> LinkedIn
                                </a>
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-gray-600 text-sm leading-relaxed text-center">
                                {active.desc}
                            </p>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ContactSection />
        </div>
    );
}