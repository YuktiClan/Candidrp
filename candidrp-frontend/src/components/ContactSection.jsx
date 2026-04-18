import { FaLinkedin } from "react-icons/fa";

export default function ContactSection() {
  return (
    <div className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT */}
        <div>
          <h2 className="text-4xl font-bold mb-4 text-[#470d7f]">
            Get in Touch
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Our team is here to help you find the right talent solutions for your business. 
            Reach out to us and let’s build something great together.
          </p>

          <div className="space-y-3 text-gray-700">
            <p>📧 contact@candidrp.com</p>
            <p>📞 +44 7770133330</p>
            <p>📍 India | UK</p>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <p className="mb-4 text-gray-600">
            Connect with us on LinkedIn
          </p>

          <a
            href="https://www.linkedin.com/company/candid-resourcing-partners-ltd/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#0b1f4b] text-white px-4 py-3 rounded-lg w-fit hover:bg-[#16337a] transition"
          >
            <FaLinkedin size={20} />
            <span>LinkedIn</span>
          </a>
        </div>

      </div>
    </div>
  );
}