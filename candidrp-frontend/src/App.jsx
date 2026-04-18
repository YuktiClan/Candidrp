import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import TeamPage from "./pages/TeamPage";

import News from "./pages/News";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import JobsPage from "./pages/JobsPage";
import ApplyPage from "./pages/ApplyPage";
import NewsDetail from "./pages/NewsDetail";

function App() {

  


  return (
    <BrowserRouter>
     <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;