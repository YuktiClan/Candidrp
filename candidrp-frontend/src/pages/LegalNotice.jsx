import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import hero from "../assets/privacy.jpg"; // ✅ ADD YOUR IMAGE PATH

export default function LegalNotice() {
    return (
        <>
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative w-full h-[300px] md:h-[350px] flex items-center justify-center text-center text-white">

                {/* BACKGROUND IMAGE */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${hero})`,
                    }}
                ></div>

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* CONTENT */}
                <div className="relative z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Legal Notice
                    </h1>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="max-w-5xl mx-auto px-6 py-20 text-gray-700 leading-relaxed">

                <p className="mb-6 text-lg">
                    This website is owned and operated by <strong>Candid Resourcing Partners Ltd</strong>.
                    The information provided on this website is intended for general informational purposes only.
                </p>

                <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1f3b73] mb-3">
                        Company Information
                    </h2>
                    <p>
                        We provide recruitment and manpower solutions across multiple industries globally,
                        helping organizations connect with the right talent and individuals find suitable opportunities.
                    </p>
                </div>

                <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1f3b73] mb-3">
                        Intellectual Property
                    </h2>
                    <p>
                        All content on this website, including text, graphics, logos, and design elements,
                        is the property of Candid Resourcing Partners Ltd and may not be reproduced, distributed,
                        or used without prior written permission.
                    </p>
                </div>

                <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1f3b73] mb-3">
                        Liability
                    </h2>
                    <p>
                        We are not liable for any direct, indirect, or consequential damages arising from the use
                        of this website or reliance on its content. Users are advised to verify information independently
                        before making decisions.
                    </p>
                </div>

            </div>

            {/* CONTACT SECTION */}
            <div className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    {/* LEFT */}
                    <div>
                        <h2 className="text-4xl font-bold mb-6 text-[#1f3b73]">
                            Contact
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions or need assistance, feel free to reach out to us.
                            Our team is always ready to help you with the best solutions.
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-4 text-gray-700">
                        <p>🌐 <span className="font-medium">Website:</span> www.candidrp.com</p>
                        <p>👤 <span className="font-medium">Contact Person:</span> Avinash Chander</p>
                        <p>📍 <span className="font-medium">Address:</span> Street, WATFORD WD17 1JJ</p>
                        <p>📧 <span className="font-medium">Email:</span> contact@candidrp.com</p>
                        <p>📞 <span className="font-medium">Phone:</span> +44 7770133330</p>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}