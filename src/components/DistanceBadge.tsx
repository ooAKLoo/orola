import { motion } from "framer-motion";
import { formatDistance } from "../lib/geo";

interface DistanceBadgeProps {
  meters: number;
  unlockRadius: number;
}

export default function DistanceBadge({ meters, unlockRadius }: DistanceBadgeProps) {
  const unlocked = meters <= unlockRadius;

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-orola-gold/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className={`relative px-2.5 py-1 rounded-lg text-[10px] font-medium ${
          unlocked
            ? "bg-orola-gold/15 text-orola-gold"
            : "bg-orola-l2 text-orola-bark/60"
        }`}
      >
        {unlocked ? "可收听" : formatDistance(meters)}
      </div>
    </div>
  );
}
