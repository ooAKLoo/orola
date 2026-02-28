import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { formatDistance } from "../lib/geo";

interface SoundOrbProps {
  id: string;
  title: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  distance: number;
  unlocked: boolean;
}

export default function SoundOrb({
  id,
  title,
  x,
  y,
  size,
  opacity,
  distance,
  unlocked,
}: SoundOrbProps) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const showLabel = distance < 500;

  return (
    <motion.button
      onClick={() => navigate(`/spot/${id}`)}
      className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 500, damping: 35 }
      }
      whileTap={{ scale: 0.9 }}
    >
      {/* Unlock pulse ring */}
      {unlocked && !prefersReduced && (
        <motion.div
          className="absolute rounded-full bg-orola-gold/30"
          style={{ width: size * 2.2, height: size * 2.2 }}
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Orb body */}
      <motion.div
        className={`rounded-full ${
          unlocked ? "bg-orola-gold" : "bg-orola-sage"
        }`}
        style={{ width: size, height: size, opacity }}
        animate={
          !prefersReduced && distance < 500
            ? { scale: [1, 1.15, 1] }
            : undefined
        }
        transition={
          !prefersReduced && distance < 500
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />

      {/* Label */}
      {showLabel && (
        <div className="mt-1 flex flex-col items-center pointer-events-none">
          <span className="text-[8px] font-medium text-orola-cream/80 whitespace-nowrap max-w-[80px] truncate">
            {title}
          </span>
          <span className="text-[8px] text-orola-cream/50">
            {unlocked ? "可听" : formatDistance(distance)}
          </span>
        </div>
      )}
    </motion.button>
  );
}
