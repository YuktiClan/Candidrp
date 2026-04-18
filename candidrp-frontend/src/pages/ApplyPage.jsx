import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ApplyPage() {
  const locationData = useLocation();

  const jobTitle = locationData.state?.jobTitle || "Job Position";
  const jobLocation = locationData.state?.location || "Not specified";
  const jobDescription =
    locationData.state?.description || "No description available";

  // const applyLink = locationData.state?.apply_link || "";

  // 🔥 EXTRA DATA
  const experience = locationData.state?.experience || "N/A";
  const vacancy = locationData.state?.vacancy || "N/A";
  const industry = locationData.state?.industry || "N/A";
  const department = locationData.state?.department || "N/A";
  const ctc = locationData.state?.ctc || "Not disclosed";
  const education = locationData.state?.education || "N/A";

  const navigate = useNavigate();



  
  

const handleApply = () => {
  navigate("/contact", {
    state: {
      jobTitle,
      location: jobLocation,
      description: jobDescription,
      experience,
      company: industry, // or pass company separately if exists
      apply_link: locationData.state?.apply_link || ""
    }
  });
};












  return (
    <>
      <Navbar />

      {/* 🔥 HERO */}
      <section className="bg-gradient-to-r from-[#2c0b5a] via-[#4b1d82] to-[#a55eea] text-white px-6 md:px-20 py-16 overflow-hidden text-center flex justify-center">
        <br /><br />

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <br /><br />
          <h1 className="text-4xl font-bold">Apply Now</h1>

          <p className="mt-3 text-gray-200">
            Applying for: <span className="font-semibold">{jobTitle}</span>
          </p>
        </motion.div>

      </section>


      {/* 🔥 MAIN */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          {/* 🔹 LEFT: JOB DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 bg-white p-8 rounded-2xl shadow-md"
          >
            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-gray-800">
              {jobTitle}
            </h2>

            {/* LOCATION */}
            <p className="text-sm text-gray-500 mt-1">
              {jobLocation}
            </p>

            {/* 🔥 META INFO (PRO STYLE) */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-4">
              <span>Exp: {experience} yrs</span>
              <span>|</span>
              <span>Industry: {industry}</span>
              <span>|</span>
              <span>Dept: {department}</span>
              <span>|</span>
              <span>Edu: {education}</span>
              <span>|</span>
              <span>Openings: {vacancy}</span>
              <span>|</span>
              <span>CTC: {ctc}</span>
            </div>

            <div className="h-[1px] bg-gray-200 my-6"></div>

            {/* DESCRIPTION */}
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Job Description
            </h3>

            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {jobDescription}
            </div>

          </motion.div>

          {/* 🔹 RIGHT: APPLY CARD */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-6 rounded-2xl shadow-lg h-fit"
          >
            <h2 className="text-xl font-semibold mb-4">
              Apply for this Job
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Submit your application securely. Your details will be shared
              directly with the recruiter.
            </p>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p>Easy Apply</p>
              <p>Resume Upload Supported</p>
              <p>Quick Response</p>
            </div>

            <button
              onClick={handleApply}
              className="w-full bg-gradient-to-r from-[#2c0b5a] via-[#4b1d82] to-[#a55eea] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
            >
              Apply Now
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              {/* Powered by Google Forms */}
              Powered by Candidrp
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </>
  );
}