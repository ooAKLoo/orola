import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useGeolocation } from "../hooks/useGeolocation";
import { useRecorder } from "../hooks/useRecorder";
import { PRESETS, paletteBg } from "../lib/palette";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DropPage() {
  const { latitude, longitude, loading: geoLoading, error } = useGeolocation();
  const navigate = useNavigate();
  const recorder = useRecorder();

  const [selected, setSelected] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("#6E56CF");
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isCustom = selected === "custom";
  const storedValue = isCustom ? customColor : selected;

  const previewUrl = useMemo(
    () => (recorder.blob ? URL.createObjectURL(recorder.blob) : null),
    [recorder.blob]
  );

  const canSubmit = storedValue && recorder.blob && agreed && !uploading;

  const handleSubmit = async () => {
    if (!canSubmit || latitude === null || longitude === null) return;
    setUploading(true);
    setUploadError("");

    try {
      const ext = recorder.blob!.type.includes("webm") ? "webm" : "ogg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("sounds")
        .upload(path, recorder.blob!, { contentType: recorder.blob!.type });

      if (uploadErr) throw uploadErr;

      const { error: insertErr } = await supabase.from("sounds").insert({
        title: storedValue,
        description: null,
        audio_url: path,
        latitude,
        longitude,
        unlock_radius: 50,
      });

      if (insertErr) throw insertErr;

      navigate("/");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  if (geoLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[11px] text-orola-bark/60">正在获取位置...</p>
      </div>
    );
  }

  if (error || latitude === null || longitude === null) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-orola-l1 rounded-2xl p-6 text-center">
          <p className="text-[13px] font-medium text-orola-bark mb-2">
            需要位置权限
          </p>
          <p className="text-[11px] text-orola-bark/60">
            留声功能需要获取您的当前位置
          </p>
        </div>
      </div>
    );
  }

  // Ring color for the selected item
  const ringBg = isCustom
    ? customColor
    : PRESETS.find((p) => p.key === selected)?.colors[0] ?? "transparent";

  return (
    <div className="h-full flex flex-col bg-orola-cream">
      {/* Header */}
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3">
        <h1 className="text-[14px] font-medium text-orola-bark">在此留声</h1>
        <p className="text-[10px] text-orola-bark/50 mt-0.5">
          录下此刻此地的声音，最长 60 秒
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6">
        {/* Location preview */}
        <div className="bg-orola-l1 rounded-2xl p-4 mb-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orola-green" />
          <div>
            <span className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide block mb-0.5">
              当前位置
            </span>
            <span className="text-[11px] font-medium text-orola-bark tabular-nums">
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Recorder */}
        <div className="bg-orola-l1 rounded-2xl p-4 mb-3">
          <label className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide block mb-3">
            录音
          </label>

          <div className="flex flex-col items-center gap-3">
            {/* Record button */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={
                recorder.status === "recording"
                  ? recorder.stop
                  : recorder.status === "done"
                    ? recorder.reset
                    : recorder.start
              }
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${
                recorder.status === "recording"
                  ? "bg-red-500/15"
                  : "bg-orola-l3"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {recorder.status === "recording" ? (
                  <motion.div
                    key="stop"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-5 h-5 rounded-sm bg-red-500"
                  />
                ) : recorder.status === "done" ? (
                  <motion.div
                    key="reset"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ResetIcon className="w-5 h-5 text-orola-bark/50" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mic"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <MicIcon className="w-5 h-5 text-orola-green" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Timer / status */}
            <div className="text-center">
              {recorder.status === "recording" && (
                <div>
                  <span className="text-[13px] font-medium text-orola-bark tabular-nums">
                    {formatTime(recorder.duration)}
                  </span>
                  <span className="text-[10px] text-orola-bark/30 ml-1">
                    / {formatTime(recorder.maxDuration)}
                  </span>
                </div>
              )}
              {recorder.status === "idle" && (
                <span className="text-[10px] text-orola-bark/40">
                  点击开始录音
                </span>
              )}
              {recorder.status === "done" && (
                <span className="text-[10px] text-orola-green">
                  录制完成 · {formatTime(recorder.duration)}
                </span>
              )}
              {recorder.status === "error" && (
                <span className="text-[10px] text-red-500">
                  {recorder.error}
                </span>
              )}
            </div>

            {/* Progress bar during recording */}
            {recorder.status === "recording" && (
              <div className="w-full h-1 bg-orola-l3 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-400 rounded-full"
                  style={{
                    width: `${(recorder.duration / recorder.maxDuration) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Audio preview */}
            {recorder.status === "done" && previewUrl && (
              <audio
                src={previewUrl}
                controls
                className="w-full h-8 mt-1"
                style={{ filter: "sepia(0.3)" }}
              />
            )}
          </div>
        </div>

        {/* Color picker */}
        <div className="bg-orola-l1 rounded-2xl p-4 mb-3">
          <div className="flex flex-wrap justify-center gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setSelected(p.key)}
                className="relative w-9 h-9 flex items-center justify-center"
              >
                {selected === p.key && (
                  <motion.div
                    layoutId="color-ring"
                    className="absolute inset-[-3px] rounded-full"
                    style={{ border: `2px solid ${p.colors[0]}` }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <div
                  className="w-9 h-9 rounded-full"
                  style={{ background: paletteBg(p.colors) }}
                />
              </button>
            ))}

            {/* Custom color */}
            <button
              type="button"
              onClick={() => {
                setSelected("custom");
                colorInputRef.current?.click();
              }}
              className="relative w-9 h-9 flex items-center justify-center"
            >
              {isCustom && (
                <motion.div
                  layoutId="color-ring"
                  className="absolute inset-[-3px] rounded-full"
                  style={{ border: `2px solid ${customColor}` }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <div
                className="w-9 h-9 rounded-full"
                style={{
                  background: isCustom
                    ? customColor
                    : `conic-gradient(#E8A838, #D4704F, #9B8EC4, #7B9EC4, #8FAE8B, #D4899B, #E8A838)`,
                }}
              />
              <input
                ref={colorInputRef}
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setSelected("custom");
                }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </button>
          </div>
        </div>

        {/* User agreement checkbox */}
        <div className="mb-4 px-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed((v) => !v)}
              className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center transition-colors duration-200 ${
                agreed ? "bg-orola-green" : "bg-orola-l3"
              }`}
            >
              {agreed && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
            <span className="text-[10px] text-orola-bark/50 leading-relaxed">
              我确认录音内容为本人原创或环境声音，不包含受版权保护的音乐作品。
              如因内容侵权产生纠纷，由我本人承担相关责任。
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/terms");
                }}
                className="text-orola-green ml-0.5 underline underline-offset-2"
              >
                用户协议
              </button>
            </span>
          </label>
        </div>

        {/* Error */}
        {uploadError && (
          <p className="text-[10px] text-red-500 mb-3 px-1">{uploadError}</p>
        )}

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl text-[11px] font-medium transition-colors duration-200 ${
            canSubmit
              ? "bg-orola-green text-white"
              : "bg-orola-l3 text-orola-bark/30"
          }`}
        >
          {uploading ? "上传中..." : "留下声音"}
        </motion.button>
      </div>
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
