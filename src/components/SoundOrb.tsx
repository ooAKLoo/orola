import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { formatDistance } from "../lib/geo";
import { getPalette, paletteBg, palettePrimary } from "../lib/palette";

interface SoundOrbProps {
  id: string;
  colorKey: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  distance: number;
  unlocked: boolean;
}

export default function SoundOrb({
  id,
  colorKey,
  x,
  y,
  size,
  opacity,
  distance,
  unlocked,
}: SoundOrbProps) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const { colors } = getPalette(colorKey);
  const primary = palettePrimary(colors);

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
          className="absolute rounded-full"
          style={{
            width: size * 2.2,
            height: size * 2.2,
            backgroundColor: `${primary}4D`,
          }}
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
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: paletteBg(colors),
          opacity: unlocked ? opacity : opacity * 0.4,
          boxShadow: unlocked ? `0 0 ${size}px ${primary}66` : "none",
        }}
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

      {/* Distance label only */}
      {showLabel && (
        <span className="mt-1 text-[8px] text-orola-cream/50 pointer-events-none">
          {unlocked ? "可听" : formatDistance(distance)}
        </span>
      )}
    </motion.button>
  );
}
