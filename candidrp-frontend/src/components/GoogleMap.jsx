import { useState } from "react";

export default function GoogleMap() {
  const [step, setStep] = useState("world");
  const [zooming, setZooming] = useState(false);

  // 🌍 MAP STATES (FIXED)
  const maps = {
    // ❌ before → q=20,0 (caused red marker)
    // ✅ now → ll=20,0 (clean world)
    world: "https://www.google.com/maps?ll=20,0&z=2&output=embed",

    // 🔹 Step 1 (country view WITHOUT marker)
    indiaStart: "https://www.google.com/maps?ll=22,78&z=4&output=embed",
    ukStart: "https://www.google.com/maps?ll=55,-3&z=5&output=embed",

    // 🔹 Step 2 (FINAL location WITH marker)
    indiaFinal: "https://www.google.com/maps?q=28.6290,77.2195&z=15&output=embed",
    ukFinal: "https://www.google.com/maps?q=51.6636,-0.3960&z=15&output=embed",
  };

  const handleClick = (country) => {
    setZooming(true);

    setStep(country + "Start");

    setTimeout(() => {
      setStep(country + "Final");

      setTimeout(() => {
        setZooming(false);
      }, 400);

    }, 1300);
  };

  return (
    <div className="w-full">

      {/* 🔘 BUTTONS */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleClick("india")}
          className="px-5 py-2 rounded-full border bg-white hover:bg-gray-100"
        >
          🇮🇳 India
        </button>

        <button
          onClick={() => handleClick("uk")}
          className="px-5 py-2 rounded-full border bg-white hover:bg-gray-100"
        >
          🇬🇧 UK
        </button>

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
            zooming
              ? "scale-110 opacity-90"
              : "scale-100 opacity-100"
          }`}
          loading="lazy"
        />

      </div>
    </div>
  );
}