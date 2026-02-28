import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { playAudio, pauseAudio } from "../lib/audio";

interface PlayerProps {
  url: string;
  title: string;
}

export default function Player({ url, title }: PlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);

  const updateProgress = () => {
    const audio = audioRef.current;
    if (audio && playing) {
      setProgress(audio.currentTime);
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const toggle = () => {
    if (playing) {
      pauseAudio();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    } else {
      const audio = playAudio(url);
      audioRef.current = audio;
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.onended = () => {
        setPlaying(false);
        setProgress(0);
      };
      setPlaying(true);
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      pauseAudio();
    };
  }, []);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="bg-orola-l1 rounded-2xl p-4">
      <div className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide mb-3">
        播放器
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="w-10 h-10 rounded-xl bg-orola-green flex items-center justify-center flex-shrink-0"
        >
          {playing ? (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </motion.button>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-orola-bark truncate mb-1.5">
            {title}
          </div>
          <div className="h-1 bg-orola-l3 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orola-green rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-orola-bark/40 tabular-nums">
              {formatTime(progress)}
            </span>
            <span className="text-[8px] text-orola-bark/40 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
