import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/Job.png";

export default function JobsPage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");



  // 🔥 Fetch Jobs
  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
    fetch(`${import.meta.env.VITE_API_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  // 🔥 FILTER LOGIC (correct place)
  useEffect(() => {
    let result = jobs;

    if (search) {
      result = result.filter((job) =>
        job.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter((job) =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      result = result.filter((job) =>
        job.type?.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [search, locationFilter, typeFilter, jobs]);

  const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

  return (
    <>
      <Navbar />

      {/* 🔥 HERO */}
      <section className="relative text-white overflow-hidden">

        {/* 🔹 BACKGROUND IMAGE */}
        <div
          className="h-[500px] flex items-center px-10 text-white relative"
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

        {/* 🔹 OVERLAY (FADED GRADIENT) */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#1f0638]/90 via-[#5b2c91]/40 to-transparent"></div> */}
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

        {/* 🔹 CONTENT */}
        <div className="relative z-10 w-full px-6 md:px-1 flex justify-start">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl text-left"
          >
         
          
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] max-w-3xl">
                Join Our {" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Team
                </span>
            </h1>

            <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
                We don’t just offer jobs — we build careers. 
                <br></br>
                Work with passionate professionals,
              grow your skills and be part of something meaningful.
            </p>
          </motion.div>
          
          

        </div>
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
</div>
      </section>
      

      {/* 🔥 ABOUT SECTION */}
      <section className="py-20 px-6 md:px-10 bg-[#f8fafc]">
      <motion.p
        variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-gray-600 leading-relaxed text-center mx-auto max-w-5xl"
        >
        We foster a dynamic and collaborative environment where innovation thrives, ideas are valued, 
        and every individual is empowered to grow. Whether you are just starting your journey or looking 
        to take the next big step, we provide the support, mentorship, and opportunities you need to succeed.
      </motion.p>

<br/><br/><br/>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* 🔹 LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}   // 👈 from bottom
            animate={{ opacity: 1, y: 0 }}    // 👈 move up
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >

            

            <h2 className="text-4xl font-bold text-purple-900">
              Why Work With Us?
            </h2>

            <p className="text-gray-600 leading-relaxed">
              At CandidrP, we believe in innovation, collaboration, and growth.
              Our team is driven by solving real-world problems and delivering impactful solutions.
            </p>

            <p className="text-gray-600 leading-relaxed">
              We provide an environment where your ideas matter and your growth is a priority.
              Whether you're a fresher or experienced, we help you succeed.
            </p>

            {/* 🔹 FEATURES */}
            <div className="grid grid-cols-2 gap-4 mt-6">

              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg hover:shadow-md transition">
                🚀 <span className="font-medium">Career Growth</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg hover:shadow-md transition">
                💻 <span className="font-medium">Remote Flexibility</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg hover:shadow-md transition">
                🎯 <span className="font-medium">Skill Development</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg hover:shadow-md transition">
                🤝 <span className="font-medium">Great Culture</span>
              </div>

            </div>
          </motion.div>

          {/* 🔹 RIGHT CARD */}
          <motion.div

            className="bg-gradient-to-r from-[#2c0b5a] via-[#4b1d82] to-[#a55eea] text-white px-6 md:px-20 py-16 rounded-2xl "
          >
            <h3 className="text-4xl font-semibold mb-4 text-center">
              Our Mission
            </h3>

            <p className="text-gray-200  text-center">
              To connect talented individuals with the right opportunities and empower organizations with skilled professionals.
            </p>


            <div className="mt-6 space-y-2 text-sm text-gray-200">
              <p>🌍 Serving clients across India</p>
              <p>📈 Growing startup environment</p>
              <p>💡 Innovation-driven culture</p>
            </div>
          </motion.div>

        </div>
      </section>
      {/* 🔥 JOB SECTION WITH FILTERS */}
      <section className="p-10 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 items-stretch">

          {/* 🔹 LEFT SIDE (FILTER + NOTE) */}
        <div className="flex flex-col gap-6">

          {/* 🔹 FILTERS */}
          <div className="bg-white p-6 rounded-md shadow-lg h-fit border border-gray-100">

            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Filter Jobs
            </h2>

            {/* 🔹 SEARCH */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-600">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* 🔹 LOCATION */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-600">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Delhi / Remote"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* 🔹 TYPE */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-600">
                Job Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
          
              </select>
            </div>

            {/* 🔹 BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSearch("");
                  setLocationFilter("");
                  setTypeFilter("");
                }}
                className="w-1/2 bg-gray-100 py-2 rounded-lg text-purple-800 text-sm hover:bg-gray-200 transition"
              >
                Clear
              </button>

              <button className="w-1/2 bg-gradient-to-r from-[#2c0b5a] via-[#4b1d82] to-[#a55eea] text-white py-2 rounded-lg text-sm hover:opacity-90 transition">
                Apply
              </button>
            </div>

          </div>


          {/* 🔹 NOTE BOX */}
        <div className="bg-gradient-to-r from-[#2c0b5a] via-[#4b1d82] to-[#a55eea] text-white p-5 rounded-xl shadow-md">
        <br></br>
          <h3 className="text-3xl font-semibold mb-4 text-center">
            CandidRP
          </h3>
        <br></br>
          <p className="text-sm text-gray-200 leading-relaxed">
          We connect talented individuals with meaningful career opportunities. 
          <br></br><br></br>
          Ensuring the right fit for both candidates and organizations.
          </p>
        <br></br>
          <ul className="mt-3 space-y-1 text-sm text-gray-200">
            <li>🌐Multiple openings across IT, Finance, Healthcare & emerging sectors</li>
          </ul>
          <br></br><br></br>
          <h3 className="text-xs font-semibold mb-4 text-center text-white/60">
            Powered by Candidrp.com
          </h3>

        </div>

        </div>
                  


{/* 🔹 JOB LIST */}
<div className="md:col-span-3">

  <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-lg border border-gray-100 
                  max-h-[850px] overflow-y-auto">

    <div className="flex flex-col gap-4 sm:gap-6">
  {loading ? (
    <div className="flex flex-col items-center justify-center h-[112vh] text-center">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mb-4"></div>

      <h2 className="text-xl font-semibold text-blue-900">
        Loading Jobs...
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        Please wait while we fetch the latest opportunities.
      </p>
    </div>
  ) : filteredJobs.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-[112vh] text-center">
      <div className="text-5xl mb-4">😕</div>

      <h2 className="text-2xl font-bold text-gray-800">
        No Jobs Found
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        Try adjusting your filters or check back later.
      </p>
    </div>
      ) : (
        filteredJobs.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            whileHover={{ 
              y: -2,
              scale: 1.005,
              transition: { duration: 0.08, ease: "easeOut" }
            }}


            className="group relative bg-blue-50 p-5 sm:p-6 rounded-2xl border border-blue-200/60
                      flex flex-col sm:flex-row 
                      sm:justify-between sm:items-center 
                      gap-5 sm:gap-6 hover:shadow-[0_15px_30px_rgba(30,64,175,0.15)] transition-all duration-75 overflow-visible 
                      shadow-[inset_0_4px_12px_rgba(0,0,0,0.06),inset_0_-4px_12px_rgba(255,255,255,0.9)]"
          >
            {/* High-Visibility Engraved Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-white rounded-2xl -z-10 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]" />
            
            {/* 🔹 LEFT CONTENT */}
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  {job.type}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-green-100 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
                  </span>
                  <span className="text-[10px] text-green-700 font-bold uppercase tracking-tight">
                    Active
                  </span>
                </div>
              </div>

              {/* Title - Bold & Sharp */}
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 tracking-tight leading-tight font-sans">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 font-sans">
                  <span className="text-purple-500">📍</span> {job.location}
                </span>
              </div>

              {/* Metadata Chips - Updated Format & Added CTC */}
              <div className="flex flex-wrap gap-2 text-[11px] sm:text-[12px] mt-4 font-sans">
                {[
                  { label: "Exp", value: `${job.experience_from}-${job.experience_to}y` },
                  { label: "CTC", value: `${job.ctc} LPA` },
                  { label: "Dept", value: job.department },
                  { label: "Industry", value: job.industry },
                  { label: "Edu", value: job.education },
                  { label: "Slots", value: job.vacancy },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-purple-300 transition"
                  >
                    <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wide">
                      {item.label}:
                    </span>
                    <span className="font-bold text-gray-900 text-[12px]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative mt-5">
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed font-semibold pl-4 border-l-2 border-purple-200 group-hover:border-purple-500 transition-colors duration-100 font-sans">
                  {job.description || "Premium opportunity for elite talent to join our specialized department."}
                </p>
              </div>
            </div>

            {/* 🔹 BUTTON SECTION */}
            <div className="flex sm:flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto relative z-10">
              <button
                  onClick={() =>
                    navigate("/apply", {
                      state: {
                        jobTitle: job.title,
                        location: job.location,
                        description: job.description,
                        experience: `${job.experience_from}-${job.experience_to}`,
                        vacancy: job.vacancy,
                        industry: job.industry,
                        department: job.department,
                        education: job.education,
                        ctc: job.ctc,
                      },
                    })
                  }
                  className="group relative w-full sm:w-auto px-8 py-3 rounded-lg text-white text-sm font-semibold tracking-wide font-sans
                            bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900
                            overflow-hidden transition-all duration-300 ease-out
                            hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {/* Glow Layer */}
                  <span className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition duration-300"></span>

                  {/* Shine Animation */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>

                  {/* Content */}
                  <span className="relative z-10">Apply Now</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
                              
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest font-sans">Urgent Opening</span>
                <div className="h-1 w-8 bg-purple-100 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
                  <div className="h-full w-full bg-purple-800 rounded-full" />
                </div>
              </div>
            </div>

            <style>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}</style>
          </motion.div>
        ))
      )}
    </div>

  </div>

</div>
        </div>
      </section>

      <Footer />
    </>
  );
}