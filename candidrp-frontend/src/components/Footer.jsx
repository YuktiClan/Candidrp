import Logo from "../assets/Footer Logo.png";
import { Link } from "react-router-dom";

import {
    FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#2c0b5a] via-[#4b1d82] to-[#a55eea] text-white px-6 md:px-20 py-12">

            {/* MAIN GRID */}
            <div className="grid md:grid-cols-4 gap-12">

                {/* LEFT BRAND */}
                <div>
                    <img
                        src={Logo}
                        alt="CandidRP Logo"
                        className="w-85 mb-0 ml"
                    />

                    <h1 className="text-4xl font-bold text-yellow-500 leading-snug ml-4">
                        Bring the future into focus.
                    </h1>

                    {/* SOCIAL ICONS */}
                    

<div className="flex mt-5 ml-4">
  <a
    href="https://www.linkedin.com/company/candid-resourcing-partners-ltd/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 bg-[#0b1f4b] text-white px-4 py-2 rounded-md 
    hover:bg-[#16337a] transition"
  >
    <FaLinkedin size={18} />
    <span className="text-sm font-medium">LinkedIn</span>
  </a>
</div>
                </div>

                {/* INDUSTRIES */}
                

  {/* INDUSTRIES */}
  <div>
    <h3 className="text-yellow-500 font-semibold mb-4 tracking-[3px] border-b border-yellow-400 pb-2">
      INDUSTRIES WE SERVE
    </h3>

    <div className="grid grid-cols-2 gap-x-6">
      <ul className="space-y-3 text-gray-300 text-sm">
        <li>Banking & Financial Services</li>
        <li>Capital Markets</li>
        <li>Wealth & Asset Management</li>
        <li>Risk & Compliance</li>
        <li>Corporate Banking</li>
        <li>Retail Banking & Payments</li>
      </ul>

      <ul className="space-y-3 text-gray-300 text-sm">
        <li>Information Technology</li>
        <li>Healthcare</li>
        <li>Finance</li>
        <li>Life Sciences</li>
        <li>Manufacturing</li>
        <li>Logistics & Transportation</li>
      </ul>
    </div>
  </div>

  {/* SERVICES */}
  <div>
    <h3 className="text-yellow-500 font-semibold mb-4 tracking-[3px] border-b border-yellow-400 pb-2">
      OUR SERVICES
    </h3>

    <ul className="space-y-3 text-gray-300 text-sm">
      <li>Global Search & Selection</li>
      <li>Recruitment Process Outsourcing (RPO)</li>
      <li>General Staffing Solutions</li>
      <li>IT Staff Augmentation</li>
      <li>Payroll & Compliance Management</li>
      <li>Apprenticeship Solutions</li>
      <li>Managed Services</li>
    </ul>
  </div>



                {/* COMPANY */}
                <div>
                    <h3 className="text-yellow-500 font-semibold mb-4 tracking-[3px] border-b border-yellow-400 pb-2">
                        COMPANY
                    </h3>

                    <ul className="space-y-3 text-gray-300 text-sm">
                        <li>
                            <Link to="/services" className="hover:text-white transition">
                                Services
                            </Link>
                        </li>
                        
                        <li>
                            <Link to="/team" className="hover:text-white transition">
                                Team
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-white transition">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-white transition">
                                Contact Us
                            </Link>
                        </li>
                        
                        <li>
                            <Link to="/news" className="hover:text-white transition">
                            News & Events
                            </Link>
                        </li>
                        <li>
                            <Link to="/jobs" className="hover:text-white transition">
                            Jobs
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="mt-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-sm text-gray-300">

                {/* LEFT LINKS */}
                <div className="flex flex-wrap gap-6 text-gray-300 text-sm">

  <Link to="/privacy-policy" className="hover:text-white transition">
    Privacy Policy
  </Link>

  <Link to="/legal-notice" className="hover:text-white transition">
    Legal Notice
  </Link>

  <Link to="/terms" className="hover:text-white transition">
    Terms & Conditions
  </Link>

  <Link to="/disclaimer" className="hover:text-white transition">
    Disclaimer
  </Link>

</div>

                {/* RIGHT COPYRIGHT */}
                <div className="flex flex-col items-end text-yellow-500">
  <p className="whitespace-nowrap">
    Copyright © 2026 CandidRP. Powered by yuktic.com.
  </p>
  
</div>
            </div>
        </footer>
    );
}