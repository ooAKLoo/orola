import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Sound } from "../lib/supabase";
import { getPublicUrl } from "../lib/audio";
import { useGeolocation } from "../hooks/useGeolocation";
import { getDistance, formatDistance } from "../lib/geo";
import Player from "../components/Player";
import DistanceBadge from "../components/DistanceBadge";

export default function SpotPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { latitude, longitude } = useGeolocation();
  const [sound, setSound] = useState<Sound | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("sounds")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setSound(data as Sound);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-orola-sage/30 animate-pulse" />
      </div>
    );
  }

  if (!sound) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[11px] text-orola-bark/60">声音不存在</p>
      </div>
    );
  }

  const distance =
    latitude !== null && longitude !== null
      ? getDistance(latitude, longitude, sound.latitude, sound.longitude)
      : Infinity;
  const unlocked = distance <= sound.unlock_radius;
  const audioUrl = getPublicUrl(sound.audio_url);

  return (
    <div className="h-full flex flex-col bg-orola-cream">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg bg-orola-l2 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-orola-bark/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[13px] font-medium text-orola-bark truncate">
            {sound.title}
          </h1>
        </div>
        <DistanceBadge meters={distance} unlockRadius={sound.unlock_radius} />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6">
        {/* Description */}
        {sound.description && (
          <div className="bg-orola-l1 rounded-2xl p-4 mb-3">
            <div className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide mb-2">
              描述
            </div>
            <p className="text-[11px] text-orola-bark/70 leading-relaxed">
              {sound.description}
            </p>
          </div>
        )}

        {/* Location */}
        {sound.address && (
          <div className="bg-orola-l1 rounded-2xl p-4 mb-3">
            <div className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide mb-2">
              位置
            </div>
            <p className="text-[11px] text-orola-bark/70">{sound.address}</p>
          </div>
        )}

        {/* Player or lock state */}
        <AnimatePresence mode="wait">
          {unlocked ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Player url={audioUrl} title={sound.title} />
            </motion.div>
          ) : (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-orola-l1 rounded-2xl p-6 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-orola-l2 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-orola-bark/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </motion.div>
              <p className="text-[13px] font-medium text-orola-bark mb-1">
                走近才能听
              </p>
              <p className="text-[11px] text-orola-bark/50">
                距离还有 {formatDistance(distance - sound.unlock_radius)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meta */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[8px] text-orola-bark/30">
            {new Date(sound.created_at).toLocaleDateString("zh-CN")}
          </span>
          <span className="text-[8px] text-orola-bark/30">
            解锁半径 {sound.unlock_radius}m
          </span>
        </div>
      </div>
    </div>
  );
}
