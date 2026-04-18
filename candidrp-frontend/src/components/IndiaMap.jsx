import { motion } from "framer-motion";
import indiaMap from "../assets/india-dots-map.png";
const locations = [
  { top: "25%", left: "35%" },
  { top: "35%", left: "50%" },
  { top: "55%", left: "50%" },
  { top: "35%", left: "30%" },
  { top: "55%", left: "30%" },
  { top: "50%", left: "55%" },
  { top: "75%", left: "30%" },
];

export default function IndiaMap() {
  return (
    <div className="relative w-full max-w-md mx-auto">

      {/* INDIA MAP IMAGE */}
      <img
        src={indiaMap}
        alt="India Map"
        className="w-full opacity-70"
        />
      {/* ANIMATED DOTS */}
      {locations.map((loc, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-orange-500 rounded-full"
          style={{ top: loc.top, left: loc.left }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
}