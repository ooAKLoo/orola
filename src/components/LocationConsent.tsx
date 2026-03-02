import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Props {
  onConsent: () => void;
}

export default function LocationConsent({ onConsent }: Props) {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0A1A10] px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-orola-deep flex items-center justify-center">
            <svg
              className="w-6 h-6 text-orola-sage"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[15px] font-medium text-orola-cream text-center mb-2">
          Orola 需要获取您的位置
        </h2>

        {/* Description */}
        <p className="text-[11px] text-orola-cream/50 text-center leading-relaxed mb-6">
          我们使用 GPS 坐标来发现您附近的声音，并让您在特定地点留下声音。
          位置数据仅用于距离计算，不会用于追踪或广告。
        </p>

        {/* What we collect */}
        <div className="bg-orola-deep rounded-xl p-4 mb-6">
          <p className="text-[9px] font-medium text-orola-sage/60 uppercase tracking-wide mb-3">
            我们收集什么
          </p>
          <div className="space-y-2.5">
            <InfoRow label="GPS 坐标" desc="用于发现附近声音、计算距离" />
            <InfoRow label="留声位置" desc="您录制声音时的经纬度，随声音一起保存" />
            <InfoRow label="现场录音" desc="您通过应用录制的音频内容（最长 60 秒）" />
          </div>
        </div>

        {/* Consent button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onConsent}
          className="w-full py-3 rounded-xl bg-orola-green text-white text-[12px] font-medium"
        >
          同意并继续
        </motion.button>

        {/* Privacy link */}
        <button
          onClick={() => navigate("/privacy")}
          className="w-full mt-3 py-2 text-[10px] text-orola-cream/30 text-center"
        >
          查看完整隐私政策
        </button>
      </motion.div>
    </div>
  );
}

function InfoRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-1 h-1 rounded-full bg-orola-sage/40 mt-1.5 shrink-0" />
      <div>
        <span className="text-[11px] font-medium text-orola-cream/70">
          {label}
        </span>
        <span className="text-[10px] text-orola-cream/35 ml-1.5">{desc}</span>
      </div>
    </div>
  );
}
