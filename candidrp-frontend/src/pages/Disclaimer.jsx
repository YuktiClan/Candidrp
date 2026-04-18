import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Disclaimer() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#350662] via-[#7b2cbf] to-[#c77dff] text-white py-16 text-center">
        <br/><br/>
        <h1 className="text-4xl md:text-5xl font-bold">Disclaimer</h1>
        <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
          Important information regarding the use of our website, services, and content.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-gray-700 leading-relaxed">

        {/* INTRO */}
        <p className="mb-6 text-lg">
          The information provided on this website is for general informational purposes only. 
          While <strong>Candid Resourcing Partners Ltd</strong> strives to ensure that all content 
          is accurate, up-to-date, and reliable, we make no representations or warranties of any kind, 
          express or implied, about the completeness, accuracy, reliability, suitability, or availability 
          of the information, products, services, or related graphics contained on this website.
        </p>

        {/* NO GUARANTEES */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            No Guarantees
          </h2>
          <p>
            Any reliance you place on such information is therefore strictly at your own risk. 
            We do not guarantee that the website will always be available, uninterrupted, or free 
            from errors or omissions. Under no circumstances shall we be held liable for any loss 
            or damage, including without limitation indirect or consequential loss or damage, 
            arising from the use of this website.
          </p>
        </div>

        {/* EXTERNAL LINKS */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            External Links
          </h2>
          <p>
            This website may contain links to third-party websites for your convenience. 
            These links are provided solely for informational purposes. We have no control over 
            the content, nature, or availability of those sites and do not endorse or accept 
            responsibility for any information, products, or services offered by third parties.
          </p>
        </div>

        {/* PROFESSIONAL ADVICE */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            No Professional Advice
          </h2>
          <p>
            The content on this website does not constitute legal, financial, or professional advice. 
            Users are encouraged to seek independent professional guidance tailored to their specific 
            circumstances before making any decisions based on the information provided here.
          </p>
        </div>

        {/* LIABILITY */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-[#7b2cbf] mb-3">
            Limitation of Liability
          </h2>
          <p>
            In no event shall Candid Resourcing Partners Ltd be liable for any direct, indirect, 
            incidental, special, or consequential damages arising out of or in connection with 
            the use of this website or reliance on any information provided herein.
          </p>
        </div>

        {/* FINAL NOTE */}
        <p className="text-sm text-gray-500 mt-12">
          By using this website, you hereby consent to this disclaimer and agree to its terms.
        </p>

      </div>

      <Footer />
    </>
  );
}