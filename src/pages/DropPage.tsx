import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useGeolocation } from "../hooks/useGeolocation";

export default function DropPage() {
  const { latitude, longitude, loading: geoLoading, error } = useGeolocation();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !file || latitude === null || longitude === null) return;
    setUploading(true);
    setUploadError("");

    try {
      // Upload audio file
      const ext = file.name.split(".").pop() || "mp3";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("sounds")
        .upload(path, file, { contentType: file.type });

      if (uploadErr) throw uploadErr;

      // Insert sound record
      const { error: insertErr } = await supabase.from("sounds").insert({
        title: title.trim(),
        description: description.trim() || null,
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
          <p className="text-[13px] font-medium text-orola-bark mb-2">需要位置权限</p>
          <p className="text-[11px] text-orola-bark/60">留声功能需要获取您的当前位置</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-orola-cream">
      {/* Header */}
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3">
        <h1 className="text-[14px] font-medium text-orola-bark">在此留声</h1>
        <p className="text-[10px] text-orola-bark/50 mt-0.5">
          声音将留在您当前的位置
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

        {/* Title input */}
        <div className="bg-orola-l1 rounded-2xl p-4 mb-3">
          <label className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide block mb-2">
            标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给这段声音起个名字"
            className="w-full bg-orola-l3 rounded-lg px-3 py-2 text-[11px] text-orola-bark placeholder:text-orola-bark/30 outline-none"
          />
        </div>

        {/* Description */}
        <div className="bg-orola-l1 rounded-2xl p-4 mb-3">
          <label className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide block mb-2">
            描述（可选）
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述这段声音的故事..."
            rows={3}
            className="w-full bg-orola-l3 rounded-lg px-3 py-2 text-[11px] text-orola-bark placeholder:text-orola-bark/30 outline-none resize-none"
          />
        </div>

        {/* File picker */}
        <div className="bg-orola-l1 rounded-2xl p-4 mb-4">
          <label className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide block mb-2">
            音频文件
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => fileRef.current?.click()}
            className="w-full bg-orola-l3 rounded-lg px-3 py-3 text-[11px] text-orola-bark/60 text-center"
          >
            {file ? file.name : "点击选择音频文件"}
          </motion.button>
        </div>

        {/* Error */}
        {uploadError && (
          <p className="text-[10px] text-red-500 mb-3 px-1">{uploadError}</p>
        )}

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!title.trim() || !file || uploading}
          className={`w-full py-3 rounded-xl text-[11px] font-medium transition-colors duration-200 ${
            !title.trim() || !file || uploading
              ? "bg-orola-l3 text-orola-bark/30"
              : "bg-orola-green text-white"
          }`}
        >
          {uploading ? "上传中..." : "留下声音"}
        </motion.button>
      </div>
    </div>
  );
}
