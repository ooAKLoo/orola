import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "感知", icon: RadarIcon },
  { path: "/drop", label: "留声", icon: MicIcon },
];

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on spot detail page
  if (location.pathname.startsWith("/spot")) return null;

  const activeIdx = tabs.findIndex((t) => t.path === location.pathname);
  const isDark = location.pathname === "/";

  return (
    <nav
      className={`pb-[env(safe-area-inset-bottom)] transition-colors duration-300 ${
        isDark ? "bg-[#0A1A10]" : "bg-orola-l1"
      }`}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab, i) => {
          const active = i === activeIdx;
          return (
            <motion.button
              key={tab.path}
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-6 py-1"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className={`absolute -top-0.5 w-5 h-0.5 rounded-full ${
                    isDark ? "bg-orola-sage" : "bg-orola-green"
                  }`}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  active
                    ? isDark
                      ? "text-orola-sage"
                      : "text-orola-green"
                    : isDark
                      ? "text-orola-cream/30"
                      : "text-orola-bark/40"
                }`}
              />
              <span
                className={`text-[9px] font-medium transition-colors duration-200 ${
                  active
                    ? isDark
                      ? "text-orola-sage"
                      : "text-orola-green"
                    : isDark
                      ? "text-orola-cream/30"
                      : "text-orola-bark/40"
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

function RadarIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
      <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
    </svg>
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
