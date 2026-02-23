import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Palette, X } from "lucide-react";
import { useState } from "react";

const themes = [
  { name: "sakura", label: "Cherry Blossom", icon: "🌸", desc: "Warm & peaceful" },
  { name: "neon", label: "Neon City", icon: "🌃", desc: "Cool & electric" },
  { name: "rainy", label: "Rainy Evening", icon: "🌧️", desc: "Calm & moody" },
  { name: "light", label: "Clean Light", icon: "☀️", desc: "Simple & bright" },
  { name: "hacker", label: "Hacker Mode", icon: "💀", desc: "Dark & terminal" },
  { name: "game", label: "Game World", icon: "🎮", desc: "Bold & playful" },
  { name: "futuristic", label: "Futuristic", icon: "🚀", desc: "Sleek & sci-fi" },
];

const ThemePicker = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full glass-panel text-foreground"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute right-0 top-12 glass-panel rounded-xl p-3 w-56 z-50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-bold text-foreground">
                Themes
              </span>
              <button onClick={() => setOpen(false)}>
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-1.5">
              {themes.map((t) => (
                <motion.button
                  key={t.name}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setTheme(t.name);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                    theme === t.name
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <p className="text-sm font-semibold font-heading">
                      {t.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemePicker;