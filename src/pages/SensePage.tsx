import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSounds } from "../hooks/useSounds";
import { getDistance } from "../lib/geo";
import {
  soundToScreen,
  distanceToOrbSize,
  distanceToOpacity,
} from "../lib/radar";
import SoundOrb from "../components/SoundOrb";

export default function SensePage() {
  const { latitude, longitude, loading: geoLoading, error } = useGeolocation();
  const { sounds } = useSounds(latitude, longitude);
  const prefersReduced = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // ResizeObserver for responsive canvas
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      setSize({
        w: containerRef.current.clientWidth,
        h: containerRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateSize]);

  // Compute orb positions
  const orbs =
    latitude !== null && longitude !== null && size.w > 0
      ? sounds.map((s) => {
          const dist = getDistance(latitude, longitude, s.latitude, s.longitude);
          const pos = soundToScreen(
            latitude,
            longitude,
            s.latitude,
            s.longitude,
            dist,
            size.w,
            size.h
          );
          return {
            ...s,
            dist,
            x: pos.x,
            y: pos.y,
            orbSize: distanceToOrbSize(dist),
            opacity: distanceToOpacity(dist),
            unlocked: dist <= s.unlock_radius,
          };
        })
      : [];

  // Ring radii as percentages of the smaller dimension
  const ringPcts = [25, 50, 75];

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#0A1A10]"
    >
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #132A1A 0%, #0A1A10 70%)",
        }}
      />

      {/* Concentric reference rings */}
      {ringPcts.map((pct) => (
        <div
          key={pct}
          className="absolute rounded-full border border-orola-sage/10"
          style={{
            width: `${pct}%`,
            height: `${pct}%`,
            left: `${(100 - pct) / 2}%`,
            top: `${(100 - pct) / 2}%`,
          }}
        />
      ))}

      {/* Center user dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-3 h-3 rounded-full bg-orola-sage"
          animate={
            !prefersReduced ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : undefined
          }
          transition={
            !prefersReduced
              ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        />
      </div>

      {/* Sound orbs */}
      <AnimatePresence>
        {orbs.map((o) => (
          <SoundOrb
            key={o.id}
            id={o.id}
            colorKey={o.title}
            x={o.x}
            y={o.y}
            size={o.orbSize}
            opacity={o.opacity}
            distance={o.dist}
            unlocked={o.unlocked}
          />
        ))}
      </AnimatePresence>

      {/* Top brand + coordinates */}
      <div className="absolute top-0 left-0 right-0 pt-[calc(env(safe-area-inset-top)+12px)] px-4 pointer-events-none flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-orola-cream/60 tracking-wide">
          Orola
        </span>
        {latitude !== null && longitude !== null && (
          <span className="text-[9px] text-orola-cream/30 tabular-nums">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        )}
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-0 left-0 right-0 pb-[calc(env(safe-area-inset-bottom)+64px)] text-center pointer-events-none">
        {geoLoading ? (
          <span className="text-[10px] text-orola-sage/50">正在定位...</span>
        ) : error ? (
          <span className="text-[10px] text-orola-gold/60">需要位置权限</span>
        ) : (
          <span className="text-[10px] text-orola-cream/30">
            走近光点，聆听声音
          </span>
        )}
      </div>
    </div>
  );
}
