import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Palette, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

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
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);
  const handleClose = useCallback(() => setOpen(false), []);
  
  const handleSelectTheme = useCallback((themeName) => {
    if (setTheme) setTheme(themeName);
    setOpen(false);
  }, [setTheme]);

  return (
    <div className="relative" ref={panelRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="p-2 rounded-full glass-panel text-foreground cursor-pointer"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute right-0 top-12 glass-panel rounded-2xl p-3 w-56 z-[90] shadow-2xl bg-background/95 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5">
              <span className="text-xs font-heading font-black text-foreground tracking-wider uppercase">
                Themes
              </span>
              <button onClick={handleClose} className="p-0.5 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-0.5">
              {themes.map((t) => {
                const isSelected = theme === t.name;
                return (
                  <motion.button
                    key={t.name}
                    whileHover={{ x: 4, backgroundColor: "rgba(var(--muted), 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectTheme(t.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-primary/20 text-primary font-bold shadow-sm"
                        : "text-foreground"
                    }`}
                  >
                    <span className="text-base filter drop-shadow-sm">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-heading font-bold tracking-tight truncate">
                        {t.label}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate opacity-80">
                        {t.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemePicker;