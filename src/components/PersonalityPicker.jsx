import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";

const modes = [
  { key: "tsundere", emoji: "😤", label: "Tsundere", desc: "It's not like I care..." },
  { key: "soft", emoji: "🥺", label: "Soft & Caring", desc: "You're doing great~" },
  { key: "chaotic", emoji: "😂", label: "Funny Chaotic", desc: "LMAOOO no way!!" },
  { key: "senpai", emoji: "😎", label: "Serious Senpai", desc: "Indeed, interesting." },
];

const PersonalityPicker = ({ current, onChange, open, onClose }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const handleSelect = useCallback((key) => {
    if (onChange) onChange(key);
    if (onClose) onClose();
  }, [onChange, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          className="absolute top-full mt-2 right-0 glass-panel rounded-2xl p-1.5 shadow-2xl z-[80] w-52 bg-background/90 backdrop-blur-md border border-white/10 overflow-hidden"
        >
          {modes.map((m) => {
            const isSelected = current === m.key;
            return (
              <motion.button
                key={m.key}
                whileHover={{ x: 4, backgroundColor: "rgba(var(--muted), 0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(m.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all mb-0.5 last:mb-0 ${
                  isSelected
                    ? "bg-primary/20 text-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-base filter drop-shadow-sm">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-heading font-bold tracking-tight truncate">
                    {m.label}
                  </p>
                  <p className="text-[9px] font-body opacity-60 truncate leading-normal">
                    {m.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalityPicker;