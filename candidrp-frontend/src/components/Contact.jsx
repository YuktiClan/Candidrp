import hero from "../assets/Contact.png";
import ContactSection from "../components/ContactSection";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import GoogleMap from "../components/GoogleMap";
import PhoneInputImport from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocation } from "react-router-dom";



const PhoneInput = PhoneInputImport.default || PhoneInputImport;

export default function Contact() {

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
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
        if (jobTitle) {

            // ✅ Prefill message (ONLY job title + location)
            // setFormData(prev => ({
            //     ...prev,
            //     message: `Applying for: ${jobTitle}\nLocation: ${jobLocation}`
            // }));

            // ✅ Scroll to form
            if (formRef.current) {
                setTimeout(() => {
                    formRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 200);
            }
        }
    }, [jobTitle]);

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
            <div className="bg-gray-50 px-10 py-24">
                <div className="max-w-6xl mx-auto text-center">


                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="leading-relaxed text-center mx-auto max-w-6xl"
                    >
                        Bridging talent and opportunity across our global offices, we create meaningful connections that drive organisational success and empower professionals worldwide.
                    </motion.p>


                    <br /><br /><br /><br />

                    <h2 className="text-4xl md:text-5xl font-bold text-[#4e0f89] mb-4">
                        Our Locations
                    </h2>

                    <br /><br /><br />


                    <div className="relative flex flex-col md:flex-row">

                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2"></div>

                        {/* UK */}
                        <div className="md:w-1/2 md:pr-16 mb-12 md:mb-0 text-left">
                            <p className="text-sm text-purple-500 font-medium mb-2 tracking-wide">
                                UNITED KINGDOM
                            </p>

                            <h3 className="text-2xl font-semibold text-[#32055e] mb-4">
                                UK Office
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                18, Chiltern Court <br />
                                1 Marri Street, Watford
                                WD24 5FZ <br />
                                United Kingdom
                            </p>
                        </div>

                        {/* INDIA */}
                        <div className="md:w-1/2 md:pl-16 text-left">
                            <p className="text-sm text-purple-500 font-medium mb-2 tracking-wide">
                                INDIA
                            </p>

                            <h3 className="text-2xl font-semibold text-[#32055e] mb-4">
                                India Office
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                130, Nimri Colony Ashok Vihar, Phase 4, New Delhi <br />
                                India
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* 🔵 FORM */}
            <div ref={formRef} className="px-4 sm:px-6 md:px-10 py-10 md:py-16 max-w-5xl mx-auto">
                <h2 className="text-4xl font-semibold text-[#4e0f89] mb-3">
                    Let's Connect
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

            <ContactSection />

            {/* 🔵 MAP SECTION */}
            <div className="px-10 py-16 bg-white">
                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="text-3xl font-semibold text-[#4e0f89] mb-10">
                        Our Global Presence
                    </h2>

                    <GoogleMap />

                </div>
            </div>




        </div>
    );
}