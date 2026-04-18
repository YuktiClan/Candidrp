import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#350662] via-[#7b2cbf] to-[#c77dff] text-white py-16 text-center">
        <br/><br/>
        <h1 className="text-4xl md:text-5xl font-bold">
          Terms & Conditions
        </h1>
        <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
          Please read these terms carefully before using our website and services.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-gray-700 leading-relaxed">

        {/* INTRO */}
        <p className="mb-6 text-lg">
          By accessing and using this website, you agree to comply with and be bound by the following 
          terms and conditions. These terms govern your use of our website and services provided by 
          <strong> Candid Resourcing Partners Ltd</strong>. If you do not agree with any part of these terms, 
          you must not use this website.
        </p>

        {/* USE OF WEBSITE */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            Use of Website
          </h2>
          <p>
            This website is intended for informational purposes related to recruitment and staffing services. 
            You agree to use this website only for lawful purposes and in a way that does not infringe the rights 
            of, restrict, or inhibit anyone else’s use and enjoyment of the website. Unauthorized use, including 
            attempts to gain access to restricted areas or misuse of data, is strictly prohibited.
          </p>
        </div>

        {/* SERVICES */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            Services
          </h2>
          <p>
            We provide recruitment and manpower solutions across various industries. While we strive to connect 
            candidates with suitable opportunities and employers with qualified talent, we do not guarantee job 
            placement, hiring outcomes, or business results. All decisions made based on our services remain the 
            responsibility of the user.
          </p>
        </div>

        {/* INTELLECTUAL PROPERTY */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            Intellectual Property
          </h2>
          <p>
            All content on this website, including text, graphics, logos, and design, is the property of 
            Candid Resourcing Partners Ltd unless otherwise stated. Unauthorized reproduction, distribution, 
            or use of any material without prior written consent is strictly prohibited.
          </p>
        </div>

        {/* LIMITATION OF LIABILITY */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            Limitation of Liability
          </h2>
          <p>
            We shall not be held liable for any direct, indirect, incidental, or consequential damages arising 
            from the use of this website or reliance on any information provided. This includes, but is not 
            limited to, loss of data, business interruption, or loss of profits.
          </p>
        </div>

        {/* MODIFICATIONS */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            Changes to Terms
          </h2>
          <p>
            We reserve the right to update or modify these terms at any time without prior notice. 
            Continued use of the website after any changes constitutes acceptance of the revised terms.
          </p>
        </div>

        {/* GOVERNING LAW */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            Governing Law
          </h2>
          <p>
            These terms shall be governed and interpreted in accordance with applicable laws. 
            Any disputes arising in connection with these terms shall be subject to the jurisdiction 
            of the appropriate courts.
          </p>
        </div>

        {/* FINAL NOTE */}
        <p className="text-sm text-gray-500 mt-12">
          By continuing to use this website, you acknowledge that you have read, understood, 
          and agreed to these Terms & Conditions.
        </p>

      </div>

      <Footer />
    </>
  );
}