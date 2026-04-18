import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import hero from "../assets/privacy.jpg";
export default function PrivacyPolicy() {
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
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
  ></div>

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* CONTENT */}
  <div className="relative z-10 px-4">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Privacy Policy
    </h1>

    <p className="text-sm md:text-base text-gray-300">
      CANDID RESOURCING PARTNERS <span className="mx-2">›</span> Privacy Policy
    </p>
  </div>
</section>

      <div className="max-w-5xl mx-auto px-6 py-20 text-gray-700 leading-relaxed">
        <br/>
        

        {/* INTRO */}
        <h2 className="text-3xl font-semibold mb-3">An Overview of Data Protection</h2>
        <p className="mb-4">
          The following provides a simple overview of what happens to your personal data when you visit our website. 
          Personal data is any information by which you can be personally identified.
        </p>

        {/* GENERAL */}
        <h2 className="text-2xl font-semibold mt-10 mb-3">General Information</h2>
        <p className="mb-4">
          We collect, process, and use your personal data in accordance with applicable data protection laws. 
          Detailed information can be found in the sections below.
        </p>

        {/* DATA COLLECTION */}
        <h2 className="text-2xl font-semibold mt-10 mb-3">Data Collection on Our Website</h2>

        <h3 className="text-lg font-semibold mt-6 mb-2">Who is responsible?</h3>
        <p className="mb-4">
          The data collected on this website is processed by the website operator. 
          Contact details can be found in the legal notice.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">How do we collect your data?</h3>
        <p className="mb-4">
          Some data is collected when you provide it to us (e.g., via forms). 
          Other data is collected automatically by our IT systems (e.g., browser, OS, time of access). These data are primarily technical data such as the browser and operating system you are using or when you accessed the website. These data are collected automatically as soon as you enter our website.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Why do we use your data?</h3>
        <p className="mb-4">
          Data is collected to ensure proper website functionality and to analyze user behavior.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Your rights</h3>
        <p className="mb-4">
          You have the right to request access, correction, blocking, or deletion of your data. 
          You may also file complaints with regulatory authorities.
        </p>

        {/* ANALYTICS */}
        <h2 className="text-2xl font-semibold mt-10 mb-3">Analytics & Third-Party Tools</h2>
        <p className="mb-4">
          When visiting our website, statistical analyses may be made of your surfing behavior. This happens primarily using cookies and analytics. The analysis of your surfing behavior is usually anonymous, encrypted, and pseudonimized, meaning that we will not be able to identify you through this data. You can object to this analysis or prevent it by not using certain tools. Detailed information can be found in the following privacy policy.
        </p>
        <br/>

        {/* DATA PROTECTION */}
        <h2 className="text-3xl font-semibold mt-10 mb-3">General information and mandatory information</h2>



        {/* DATA PROTECTION */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Data Protection</h2>
<p className="mb-4">
  The operators of this website take the protection of your personal data very seriously. 
  We treat your personal data as confidential and in accordance with the statutory data protection regulations and this privacy policy.
</p>
<p className="mb-4">
  If you use this website, various kinds of personal data will be collected. Personal information is any data with which you could be personally identified. 
  This privacy policy explains what information we collect and what we use it for. It also explains how and for what purpose this happens.
</p>
<p className="mb-4">
  Please note that data transmitted via the internet (e.g. via email communication) may be subject to security breaches. 
  Complete protection of your data from third-party access is not possible.
</p>

{/* RESPONSIBLE PARTY */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Responsible Party</h2>
<p className="mb-4">
  The party responsible for processing data on this website is:
</p>
<p className="mb-4">
  The responsible party is the natural or legal person who alone or jointly with others decides on the purposes and means of processing personal data (names, email addresses, etc.).
</p>

{/* CONSENT */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Consent Withdrawal</h2>
<p className="mb-4">
  Many data processing operations are only possible with your express consent. 
  You may revoke your consent at any time with future effect. An informal email making this request is sufficient.
</p>
<p className="mb-4">
  Please note that data processed before we receive your request may still be legally processed.
</p>

{/* COMPLAINTS */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Right to File Complaints</h2>
<p className="mb-4">
  If there has been a breach of data protection legislation, the affected person may file a complaint with the competent regulatory authorities.
</p>

{/* DATA PORTABILITY */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Data Portability</h2>
<p className="mb-4">
  You have the right to have data which we process based on your consent or in fulfillment of a contract automatically delivered to yourself or to a third party in a standard, machine-readable format.
</p>
<p className="mb-4">
  If you require the direct transfer of data to another responsible party, this will only be done to the extent technically feasible.
</p>

{/* PAYMENTS */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Encrypted Payments</h2>
<p className="mb-4">
  If you enter into a contract which requires you to send us your payment information (e.g. account number for direct debits), we will require this data to process your payment.
</p>
<p className="mb-4">
  Payment transactions using common means of payment (Visa/MasterCard, direct debit) are only made via encrypted SSL or TLS connections.
</p>
<p className="mb-4">
  You can recognize an encrypted connection in your browser's address line when it changes from "http://" to "https://" and the lock icon is visible.
</p>
<p className="mb-4">
  In the case of encrypted communication, any payment details you submit to us cannot be read by third parties.
</p>

{/* USER RIGHTS */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Information, Blocking, Deletion</h2>
<p className="mb-4">
  As permitted by law, you have the right to be provided at any time with information free of charge about any of your personal data that is stored as well as its origin, the recipient and the purpose for which it has been processed.
</p>
<p className="mb-4">
  You also have the right to have your data be corrected, blocked or deleted. 
  You can contact us at any time using the address given in our legal notice if you have further questions on the topic of personal data.
</p>

{/* EMAIL POLICY */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Opposition to Promotional Emails</h2>
<p className="mb-4">
  We hereby expressly prohibit the use of contact data published in the context of website legal notice requirements with regard to sending promotional and informational materials not expressly requested.
</p>
<p className="mb-4">
  The website operator reserves the right to take specific legal action if unsolicited advertising material, such as email spam, is received.
</p>

        {/* COOKIES */}
         <h2 className="text-3xl font-semibold mt-10 mb-3">Data collection on our website</h2>


        {/* COOKIES */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Cookies</h2>
<p className="mb-4">
  Some of our web pages use cookies. Cookies do not harm your computer and do not contain any viruses. 
  Cookies help make our website more user-friendly, efficient, and secure.
</p>
<p className="mb-4">
  Cookies are small text files that are stored on your computer and saved by your browser.
</p>
<p className="mb-4">
  Most of the cookies we use are "session cookies." They are automatically deleted after your visit. 
  Other cookies remain in your device's memory until you delete them. These cookies make it possible 
  to recognize your browser when you next visit the site.
</p>
<p className="mb-4">
  You can configure your browser to inform you about the use of cookies so that you can decide on a case-by-case basis 
  whether to accept or reject a cookie. You can also configure your browser to automatically accept or reject cookies 
  or delete them when closing your browser. Disabling cookies may limit the functionality of this website.
</p>
<p className="mb-4">
  Cookies necessary for electronic communication or certain functions (such as shopping carts) are stored based on 
  legitimate interest under Art. 6 (1) (f) of the EU GDPR. Other cookies (such as analytics) are treated separately in this policy.
</p>

{/* SERVER LOG FILES */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Server Log Files</h2>
<p className="mb-4">
  The website provider automatically collects and stores information that your browser automatically transmits to us in server log files. These include:
</p>
<ul className="list-disc pl-6 mb-4 space-y-1">
  <li>Browser type and browser version</li>
  <li>Operating system used</li>
  <li>Referrer URL</li>
  <li>Hostname of the accessing computer</li>
  <li>Time of server request</li>
  <li>IP address</li>
</ul>
<p className="mb-4">
  These data will not be combined with data from other sources.
</p>
<p className="mb-4">
  The basis for data processing is Art. 6 (1) (f) GDPR, which allows processing for legitimate interests.
</p>

{/* DATA PROCESSING */}
<h2 className="text-2xl font-semibold mt-10 mb-3">Processing of Data (Customer and Contract Data)</h2>
<p className="mb-4">
  We collect, process, and use personal data only insofar as it is necessary to establish or modify legal relationships (master data).
</p>
<p className="mb-4">
  This is done based on Art. 6 (1) (b) GDPR, which allows data processing to fulfill a contract or for measures preliminary to a contract.
</p>
<p className="mb-4">
  We collect, process, and use your personal data when accessing our website (usage data) only to the extent required to enable you to use our service or to bill you.
</p>
<p className="mb-4">
  Collected customer data shall be deleted after completion of the order or termination of the business relationship. Legal retention periods remain unaffected.
</p>

{/* CONTRACT DATA TRANSFER */}
<h2 className="text-2xl font-semibold mt-10 mb-3">
  Data Transmitted When Entering Into a Contract
</h2>
<p className="mb-4">
  We transmit personally identifiable data to third parties only to the extent required to fulfill your contract, 
  such as delivery companies or payment processors.
</p>
<p className="mb-4">
  Your data will not be transmitted for any other purpose unless you have given your express permission.
</p>
<p className="mb-4">
  Your data will not be disclosed to third parties for advertising purposes without your explicit consent.
</p>
<p className="mb-4">
  The basis for data processing is Art. 6 (1) (b) GDPR.
</p>

{/* DIGITAL SERVICES */}
<h2 className="text-2xl font-semibold mt-10 mb-3">
  Data Transferred for Services and Digital Content
</h2>
<p className="mb-4">
  We transmit personal data to third parties only when necessary to fulfill contractual obligations, 
  such as payment processing through banks.
</p>
<p className="mb-4">
  Your data will not be used for any other purpose without your consent and will not be shared for advertising purposes.
</p>
<p className="mb-4">
  The basis for processing is Art. 6 (1) (b) GDPR.
</p>

{/* ANALYTICS & ADVERTISING */}
<h2 className="text-3xl font-semibold mt-10 mb-3">Analytics and Advertising</h2>

{/* MATOMO */}
<h3 className="text-xl font-semibold mt-6 mb-3">Matomo (formerly Piwik)</h3>

<p className="mb-4">
  This website uses the open source web analytics service Matomo. Matomo uses so-called "cookies". 
  These are text files that are stored on your computer and that allow an analysis of the use of the website by you.
</p>

<p className="mb-4">
  For this purpose, the information generated by the cookie about the use of this website is stored on our server. 
  The IP address is anonymized before it is stored.
</p>

<p className="mb-4">
  Matomo cookies remain on your device until you delete them.
</p>

<p className="mb-4">
  The storage of Matomo cookies is based on Art. 6 (1) (f) of the EU DSGVO/GDPR. 
  The website operator has a legitimate interest in analyzing user behavior in order to optimize both its website and its advertising.
</p>

<p className="mb-4">
  The information generated by the cookies about your use of this website will not be disclosed to third parties.
</p>

<p className="mb-4">
  You can prevent these cookies being stored by selecting the appropriate settings in your browser. 
  However, we wish to point out that doing so may mean you will not be able to enjoy the full functionality of this website.
</p>

<p className="mb-4">
  If you do not agree with the storage and use of your data, you can disable this feature here. 
  In this case, an opt-out cookie will be stored in your browser to prevent Matomo from storing your usage data.
</p>

<p className="mb-4">
  If you delete your cookies, this will mean that the opt-out cookie will also be deleted. 
  You will then need to reactivate it when you return to our site if you wish your activity not to be tracked.
</p>
      </div>

      <Footer />
    </>
  );
}