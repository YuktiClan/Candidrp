import { useState, useEffect } from "react";

export default function GoogleMap({ selectedCountry }) {
  const [step, setStep] = useState("world");
  const [zooming, setZooming] = useState(false);

  // 🌍 MAP STATES
  const maps = {
    world: "https://www.google.com/maps?ll=20,0&z=2&output=embed",

    indiaStart: "https://www.google.com/maps?ll=22,78&z=4&output=embed",
    ukStart: "https://www.google.com/maps?ll=55,-3&z=5&output=embed",

    indiaFinal:
      "https://www.google.com/maps?q=Nimri Colony Ashok Vihar Delhi 110052&z=15&output=embed",
    ukFinal:
      "https://www.google.com/maps?q=51.6636,-0.3960&z=15&output=embed",
  };

  // 🔥 MAIN HANDLER
  const handleClick = (country) => {
    if (!country) return;

    setZooming(true);
    setStep(country + "Start");

    setTimeout(() => {
      setStep(country + "Final");

      setTimeout(() => {
        setZooming(false);
      }, 400);
    }, 1300);
  };

  // ✅ AUTO TRIGGER (from Visit Office button)
  useEffect(() => {
    if (!selectedCountry) return;

    handleClick(selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="w-full">

      {/* 🔘 BUTTONS */}
      <div className="flex justify-center gap-4 mb-6">

  {/* UK */}
  <button
    onClick={() => handleClick("uk")}
    className="px-5 py-2 rounded-full border bg-white hover:bg-gray-100"
  >
    🇬🇧 UK
  </button>

  {/* INDIA */}
  <button
    onClick={() => handleClick("india")}
    className="px-5 py-2 rounded-full border bg-white hover:bg-gray-100"
  >
    🇮🇳 India
  </button>

  {/* RESET */}
  <button
    onClick={() => setStep("world")}
    className="px-5 py-2 rounded-full border bg-white hover:bg-gray-100"
  >
    🌍 Reset
  </button>

</div>

      {/* 🗺 MAP */}
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-lg">
        <iframe
          key={step}
          src={maps[step]}
          className={`w-full h-full transition-all duration-1000 ${
            zooming ? "scale-110 opacity-90" : "scale-100 opacity-100"
          }`}
          loading="lazy"
        />
      </div>

    </div>
  );
}
