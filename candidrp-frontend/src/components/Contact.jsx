import hero from "../assets/Contact.png";
import ContactSection from "../components/ContactSection";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import GoogleMap from "../components/GoogleMap";
import PhoneInputImport from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocation } from "react-router-dom";
import img1 from "../assets/AvinashChander.png";
import img2 from "../assets/MerlynChander.png";
import img3 from "../assets/SandraShantanu.png";
import img4 from "../assets/RishabhShantanu.png";
import img5 from "../assets/SatishKumar.png";

import { Globe, Clock, ArrowRight, Building2, MapPin, Compass } from 'lucide-react';


 

const PhoneInput = PhoneInputImport.default || PhoneInputImport;

export default function Contact() {

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const mapRef = useRef(null);
    const teamImages = [img1, img2, img3, img4, img5];
    const location = useLocation();
    const formRef = useRef(null);
    const [fileError, setFileError] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");

    const [applyData, setApplyData] = useState({
        jobTitle: location.state?.jobTitle || "",
        jobLocation: location.state?.location || ""
    });


    const jobTitle = applyData.jobTitle;
    const jobLocation = applyData.jobLocation;

    const isFromApply = !!jobTitle;

     const [times, setTimes] = useState({ uk: '', india: '' });

  useEffect(() => {
    const updateTimes = () => {
      const ukTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date());

      const indiaTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date());

      setTimes({ uk: ukTime, india: indiaTime });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  const locations = [
    {
      country: "UNITED KINGDOM",
      city: "Watford UK",
      office: "Candid Resourcing Partners Ltd",
      localTime: times.uk,
      address: ["18, Chiltern Court", "1 Marri Street, Watford", "WD24 5FZ"],
      vibe: "Where heritage meets the future of technology.",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
      accent: "text-indigo-600",
      themeColor: "indigo",
      flagColors: "from-[#00247D] via-[#CF142B] to-[#00247D]"
    },
    {
      country: "INDIA",
      city: "New Delhi",
      office: "Candid Resourcing Partners Ltd",
      localTime: times.india,
      address: ["130, Nimri Colony", "Ashok Vihar, Phase 4", "New Delhi"],
      vibe: "The pulse of innovation in the capital city.",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800",
      accent: "text-purple-600",
      themeColor: "purple",
      flagColors: "from-[#FF9933] via-[#FFFFFF] to-[#128807]"
    }
  ];




    const [formData, setFormData] = useState({
        email: "",
        name: "",
        company: "",
        phone: "",
        countryCode: "+91",
        message: ""
    });

    useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);

    const shouldScroll =
        jobTitle || location.state?.scrollToForm;

    if (shouldScroll && formRef.current) {
        setTimeout(() => {
            const yOffset = -100; // navbar height adjust
            const y =
                formRef.current.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;

            window.scrollTo({
                top: y,
                behavior: "smooth",
            });

            // ✅ clear state (prevents repeat scroll on refresh)
            window.history.replaceState({}, document.title);
        }, 400); // increased delay for reliability
    }
}, [jobTitle, location.state]);

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setSelectedFileName(selectedFile.name);

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        // ❌ Invalid file type
        if (!allowedTypes.includes(selectedFile.type)) {
            setFile(null);
            setFileError("Only PDF or Word files are allowed");
            e.target.value = "";
            return;
        }

        // ❌ File too large (5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setFile(null);
            setFileError("File size must be less than 5MB");
            e.target.value = "";
            return;
        }

        // ✅ Valid file
        setFile(selectedFile);
        setFileError("");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔥 VALIDATION

        if (!formData.email || !formData.name || !formData.message) {
            alert("Please fill all required fields (Email, Name, Message)");
            return;
        }


        // 🔥 EMAIL VALIDATION
        if (!validateEmail(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        // 🔥 PHONE VALIDATION (only if entered)
        if (formData.phone && !validatePhone(formData.phone, formData.countryCode)) {
            alert("Please enter a valid phone number");
            return;
        }

        // file  VALIDATION
        if (fileError) {
            return;
        }


        // ✅ NEW: Resume mandatory ONLY for job apply
        if (isFromApply && !file) {
            setFileError("Resume is required for job application");
            return;

        }

        setLoading(true);

        const data = new FormData();
        data.append("email", formData.email);
        data.append("name", formData.name);
        data.append("company", formData.company);
        data.append("phone", formData.phone);
        // data.append("message", formData.message);
        const finalMessage = isFromApply
            ? `Applying for: ${jobTitle}\nLocation: ${jobLocation}\n\n${formData.message}`
            : formData.message;

        data.append("message", finalMessage);

        if (file) {
            data.append("file", file);
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
                method: "POST",
                body: data
            });

            const result = await res.json();

            // ❗ IMPORTANT FIX
            if (!res.ok) {
                throw new Error(result.message || "Submission failed");
            }

            // ✅ SUCCESS ONLY IF OK
            setSuccess(true);

            setApplyData({
                jobTitle: "",
                jobLocation: ""
            });

            // 🔥 CLEAR FORM
            setFormData({
                email: "",
                name: "",
                company: "",
                phone: "",
                countryCode: "+91",
                message: ""
            });



            setFile(null);

            setSelectedFileName("");
            setFileError("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (err) {
            alert(err.message || "Something went wrong ❌");
        }

        setLoading(false);
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [success]);

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };



    // ✅ EMAIL VALIDATION (RFC basic)
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // ✅ PHONE VALIDATION (country-wise basic length check)
    const validatePhone = (phone, countryCode) => {
        if (!phone) return false;

        // remove country code from number
        const number = phone.replace(countryCode.replace("+", ""), "");

        // basic rules (you can expand later)
        if (countryCode === "+91") {
            return number.length === 10; // India
        }

        if (countryCode === "+44") {
            return number.length >= 10 && number.length <= 11; // UK
        }

        // fallback for other countries
        return number.length >= 6 && number.length <= 14;
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
                        Contact {" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Us
                        </span>
                    </h1>

                    <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
                        We would love to hear from you. Choose one of the options.
                    </p>
                </motion.div>
                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* 🔵 LOCATIONS */}
            <div className="bg-gray-50 px-10 pt-10 pb-24 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="leading-relaxed text-center mx-auto max-w-6xl text-gray-600 text-lg mb-6"
        >
          Bridging talent and opportunity across our global offices, we create meaningful connections that drive organisational success and empower professionals worldwide.
        </motion.p>

        {/* LinkedIn Connection Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-center items-center"
        >
          <a
            href="https://www.linkedin.com/company/candid-resourcing-partners-ltd/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0077B5] font-semibold rounded-full border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#0077B5] hover:-translate-y-1 overflow-hidden"
          >
            {/* Subtle Background Glow on Hover */}
            <div className="absolute inset-0 bg-[#0077B5] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"></div>
            
            {/* LinkedIn Icon SVG */}
            <svg 
              className="w-6 h-6 fill-current" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            
            <span className="relative z-10">Follow us on LinkedIn</span>
            
            {/* Arrow Animation */}
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </div>

            {/* 🔵 FORM */}
            <div ref={formRef} className="px-4 sm:px-6 md:px-10 py-10 md:py-16 max-w-5xl mx-auto">
                
                <h2 className="text-3xl md:text-5xl font-black text-[#1a0633] tracking-tight leading-tight md:leading-none mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        Let's
                    </span> Connect
                    </h2>

                <p className="text-gray-600 mb-10">
                    Please fill out the form below and someone from our team will get back to you shortly.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <input name="email" className="border p-3 rounded" value={formData.email} placeholder="Email" onChange={handleChange} />
                        <input name="name" className="border p-3 rounded" value={formData.name} placeholder="Name" onChange={handleChange} />
                        <input name="company" className="border p-3 rounded" value={formData.company} placeholder="Company" onChange={handleChange} />
                    </div>

                    <div className="w-full">
                        <PhoneInput
                            country={"in"} // default

                            value={formData.phone || "91"}
                            // ✅ THIS IS THE REAL FIX

                            onChange={(value, country) => {
                                setFormData({
                                    ...formData,
                                    phone: value,
                                    countryCode: "+" + country.dialCode
                                });
                            }}

                            disableDropdown={false}
                            countryCodeEditable={false}
                            enableSearch={true}

                            inputClass="!w-full !h-[48px] !rounded !border !border-gray-300 !pl-14"
                            containerClass="w-full"
                            buttonClass="!border-gray-300"

                            placeholder="Enter phone number"
                        />
                    </div>

                    <textarea
                        name="message"
                        rows="5"
                        className="border p-3 rounded w-full"
                        value={formData.message}
                        placeholder="Briefly explain your requirement"
                        onChange={handleChange}
                    />

                    {isFromApply && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-purple-700 mb-2">
                                Applying For
                            </h3>

                            <div className="text-sm text-gray-700 space-y-1">
                                <p><strong>Job:</strong> {jobTitle}</p>
                                <p><strong>Location:</strong> {jobLocation}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">

                        {/* LEFT SIDE → FILE */}
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 min-w-0">

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileUpload"
                            />

                            <label
                                htmlFor="fileUpload"
                                className="cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Choose File {isFromApply && <span className="text-red-500">*</span>}
                            </label>

                            <span className="text-xs md:text-sm text-gray-600 truncate max-w-[120px] md:max-w-none">
                                {/* {file ? file.name : "No file chosen"} */}
                                {selectedFileName || "No file chosen"}
                            </span>

                            {selectedFileName && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        setSelectedFileName("");
                                        setFileError("");
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    }}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                            {/* ✅ ADD ERROR HERE 👇 */}
                            {fileError && (
                                <p className="text-red-500 text-sm mt-1 ">
                                    {fileError}
                                </p>
                            )}

                            

                        </div>
                        




                        {/* RIGHT SIDE → SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading || fileError}
                            className={`
                            px-8 py-3 rounded text-white flex items-center gap-2 justify-center
                            transition-all duration-300 ease-in-out
                            ${loading
                                    ? "bg-gray-400 cursor-not-allowed scale-95"
                                    : fileError
                                        ? "bg-red-300 cursor-not-allowed opacity-70"
                                        : "bg-gradient-to-r from-purple-800 to-indigo-600 hover:scale-105 active:scale-95"}
                        `}
                        >
                            {loading ? (
                                <>
                                    {/* Spinner */}
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                                    {/* Animated dots */}
                                    <span className="flex gap-1">
                                        <span className="animate-bounce [animation-delay:0ms]">.</span>
                                        <span className="animate-bounce [animation-delay:150ms]">.</span>
                                        <span className="animate-bounce [animation-delay:300ms]">.</span>
                                    </span>

                                    <span>Sending</span>
                                </>
                            ) : (
                                fileError ? "Fix file to submit" : "SUBMIT"
                            )}
                        </button>

                        

                    </div>
                </form>
                
<div className="max-w-[1200px] mx-auto px-6 mt-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 
    rounded-2xl overflow-hidden 
    bg-white shadow-lg border border-purple-100">

    {/* Item 1 */}
    <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r border-purple-100 hover:bg-purple-50 transition">
      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7c3aed"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="block"
  >
          <path d="M12 2L4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
        </svg>
      </div>
      <span className="text-gray-800 text-sm font-medium">
        Employer-Focused Support
      </span>
    </div>

    {/* Item 2 */}
    <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r border-purple-100 hover:bg-purple-50 transition">
      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7c3aed"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="block"
  >
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
        </svg>
      </div>
      <span className="text-gray-800 text-sm font-medium">
        UK-Wide Hiring Coverage
      </span>
    </div>

    {/* Item 3 */}
    <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r border-purple-100 hover:bg-purple-50 transition">
     <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7c3aed"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="block"
  >
          <circle cx="9" cy="7" r="4"/>
          <path d="M17 11v6M21 21v-2a4 4 0 0 0-3-3.87"/>
        </svg>
      </div>
      <span className="text-gray-800 text-sm font-medium">
        Permanent & Contract Expertise
      </span>
    </div>

    {/* Item 4 */}
    <div className="flex items-center gap-4 p-6 hover:bg-purple-50 transition">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7c3aed"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="block"
  >
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 3h-8v4h8V3z"/>
        </svg>
      </div>
      <span className="text-gray-800 text-sm font-medium">
        Bespoke Recruitment Solutions
      </span>
    </div>

  </div>
</div>
                {success && (
                    <div className="fixed top-6 right-6 z-50">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-[#4e0f89] to-[#6c2bd9] text-white px-6 py-4 rounded-xl shadow-lg animate-slideIn">

                            {/* ✅ Icon */}
                            <div className="bg-white/20 p-2 rounded-full">
                                ✓
                            </div>

                            {/* ✅ Text */}
                            <div>
                                <p className="font-semibold text-sm">
                                    Message Sent Successfully
                                </p>
                                <p className="text-xs text-white/80">
                                    Our team will contact you soon
                                </p>
                            </div>

                        </div>
                    </div>
                )}
            </div>

           <section className="bg-white py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-100/50 rounded-full blur-[80px] md:blur-[140px]"></div>
        <div className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-indigo-50/50 rounded-full blur-[60px] md:blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-4 md:mb-6 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-purple-900/60 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em]">Our Global Footprint</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#1a0633] tracking-tight leading-tight md:leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Our</span> Locations
          </h2>
        </div>

        {/* Side-by-Side Row (Responsive Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {locations.map((loc, idx) => (
            <div 
              key={idx}
              className="group relative flex flex-col bg-white rounded-[2rem] md:rounded-[2.5rem] border border-purple-100 overflow-hidden transition-all duration-700 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-200/40"
            >
              {/* Media Section */}
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img 
                  src={loc.image} 
                  alt={loc.city} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
                
                {/* Cultural Badge */}
                <div className="absolute top-4 md:top-6 left-4 md:left-6 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-white/95 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white shadow-lg shadow-purple-900/10">
                  <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-gradient-to-r ${loc.flagColors} shadow-sm`}></div>
                  <span className="text-[#1a0633] font-black text-[9px] md:text-[11px] tracking-wider md:tracking-widest">{loc.country}</span>
                </div>

                {/* Clock Badge - Positioned for Mobile visibility */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-[#1a0633] rounded-xl md:rounded-2xl border border-white/20 shadow-2xl">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-full h-full bg-purple-500 blur-sm opacity-50 animate-pulse"></div>
                    <Clock className="w-3 md:w-4 h-3 md:h-4 text-purple-300 relative z-10" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[7px] md:text-[8px] font-black uppercase leading-none mb-0.5">Local Time</span>
                    <span className="text-white text-[10px] md:text-xs font-mono font-bold leading-none tracking-wider">{loc.localTime}</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-10 lg:p-12 pt-4 bg-white">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <Building2 className={`w-3 md:w-4 h-3 md:h-4 ${loc.accent}`} />
                  <span className={`${loc.accent} text-[9px] md:text-[10px] font-black uppercase tracking-widest`}>{loc.office}</span>
                </div>

                <h3 className="text-2xl md:text-4xl font-bold text-[#1a0633] mb-3 md:mb-4 group-hover:text-purple-700 transition-colors">
                  {loc.city}
                </h3>

                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8 italic opacity-90 group-hover:opacity-100 transition-opacity">
                  "{loc.vibe}"
                </p>

                {/* Address & People */}
                <div className="space-y-6 md:space-y-8 mb-8 md:mb-10 pt-6 md:pt-8 border-t border-purple-50">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 md:w-5 h-4 md:h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mb-1">Address</h4>
                      {loc.address.map((line, i) => (
                        <p key={i} className="text-[#1a0633] text-xs md:text-sm font-semibold">{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                    

                        <div className="flex -space-x-2 items-center">
                        {teamImages.slice(0, 3).map((img, i) => (
                            <img
                            key={i}
                            src={img}
                            alt="Team"
                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        ))}

                        {/* +X badge */}
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold border-2 border-white">
                            +{teamImages.length - 3}
                        </div>
                        </div>
                      <span className="text-slate-500 text-[9px] md:text-[11px] font-semibold whitespace-nowrap">+5 Experts on ground</span>
                    </div>
                    <Compass className="hidden md:block w-5 h-5 text-purple-200 group-hover:rotate-45 group-hover:text-purple-500 transition-all duration-700" />
                  </div>
                </div>

                {/* Call to Action */}
                <button
  onClick={() => {
    setSelectedCountry(loc.country === "INDIA" ? "india" : "uk");

    mapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }}
  className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl bg-[#1a0633] hover:bg-purple-700 text-white font-black text-xs md:text-sm tracking-widest flex items-center justify-center gap-2 md:gap-3 transition-all duration-500 shadow-xl shadow-purple-900/10 active:scale-[0.98]"
>
  VISIT OFFICE <ArrowRight className="w-3.5 md:w-4 h-3.5 md:h-4" />
</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
            

            

            {/* 🔵 MAP SECTION */}
            <div ref={mapRef} className="px-10 py-16 bg-white">
                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="text-4xl md:text-6xl font-black text-[#1a0633] tracking-tight leading-tight md:leading-none">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Global</span> Presence
                    </h2>
                    
<br />
                   <GoogleMap selectedCountry={selectedCountry} />

                </div>
            </div>




        </div>
);
}
