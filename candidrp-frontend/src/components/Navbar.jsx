import { useEffect, useState } from "react";
import logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Navbar() {
    const [active, setActive] = useState("home");
    const [open, setOpen] = useState(false);
    const location = useLocation();

   useEffect(() => {
        const path = location.pathname;

        if (path === "/") setActive("home");
        else if (path === "/services") setActive("services");
        else if (path === "/about") setActive("about");
        else if (path === "/team") setActive("team");
        else if (path === "/contact") setActive("contact");
        else if (path === "/news") setActive("news");
        else if (path === "/jobs") setActive("jobs");

    }, [location.pathname]);

    const linkClass = (section) =>
    `relative cursor-pointer transition-colors duration-300 
     ${active === section ? "text-purple-600" : "text-gray-700 hover:text-purple-500"}`;

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl bg-white/70 shadow-md z-50 rounded-xl border border-gray-200 backdrop-blur-md">

            <div className="flex justify-between items-center px-6 h-16">
                <img src={logo} className="h-12 object-contain" />

                <div className="hidden md:flex space-x-8 font-medium">

                    <Link to="/" className={linkClass("home")}>
                        <span className="relative group">
                            Home
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>

                    <Link to="/services" className={linkClass("services")}>
                        <span className="relative group">
                            Services
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>

                    <Link to="/about" className={linkClass("about")}>
                        <span className="relative group">
                            About
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>

                    <Link to="/team" className={linkClass("team")}>
                        <span className="relative group">
                            Team
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>

                    <Link to="/contact" className={linkClass("contact")}>
                        <span className="relative group">
                            Contact
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>
                    <Link to="/news" className={linkClass("news")}>
                        <span className="relative group">
                            Articles & Events
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>
                    <Link to="/jobs" className={linkClass("jobs")}>
                        <span className="relative group">
                            Jobs
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>

                </div>

                <button
                  onClick={() => setOpen(!open)}
                  className="md:hidden text-2xl text-gray-700 transition-all duration-300"
                >
                  {open ? "✕" : "☰"}
                </button>
            </div>





 
{/* MOBILE MENU */}
<div
  className={`overflow-hidden transition-all duration-300 ease-in-out 
  ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
>
  <div className="bg-white border-t shadow-sm rounded-b-xl overflow-hidden">

    {[
      { name: "home", label: "Home", path: "/" },
      
      { name: "services", label: "Services", path: "/services" },
      { name: "about", label: "About", path: "/about" },
      { name: "team", label: "Team", path: "/team" },
      { name: "contact", label: "Contact", path: "/contact" },
      { name: "news", label: "Articles & Events", path: "/news" },
      { name: "jobs", label: "Jobs", path: "/jobs" },
    ].map((item, index, arr) => (
      <Link
        key={item.name}
        to={item.path}
        onClick={() => setOpen(false)}
        className={`block px-5 py-3 transition-all duration-200
        ${
          active === item.name
            ? "text-purple-600 font-semibold bg-purple-50"
            : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
        }
        ${index !== arr.length - 1 ? "border-b" : ""}
        `}
      >
        {item.label}
      </Link>
    ))}

  </div>
</div>
          
        </nav>
    );
}