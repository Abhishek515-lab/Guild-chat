import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

const animeStickers = [
  { emoji: "🌸", label: "Sakura" },
  { emoji: "⚔️", label: "Battle" },
  { emoji: "💫", label: "Sparkle" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "❄️", label: "Ice" },
  { emoji: "⚡", label: "Thunder" },
  { emoji: "🌙", label: "Moon" },
  { emoji: "🎌", label: "Flag" },
  { emoji: "🍡", label: "Dango" },
  { emoji: "🍜", label: "Ramen" },
  { emoji: "🎎", label: "Dolls" },
  { emoji: "🏯", label: "Castle" },
  { emoji: "👺", label: "Oni" },
  { emoji: "🐉", label: "Dragon" },
  { emoji: "🦊", label: "Kitsune" },
  { emoji: "🐱", label: "Neko" },
  { emoji: "💕", label: "Love" },
  { emoji: "😤", label: "Angry" },
  { emoji: "🥺", label: "Pleading" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "🤯", label: "Mind Blown" },
  { emoji: "😎", label: "Cool" },
  { emoji: "🥰", label: "Adore" },
  { emoji: "💀", label: "Dead" },
];

const StickerPanel = ({ open, onClose, onSelect }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const handleSelectSticker = useCallback((emoji) => {
    if (onSelect) onSelect(emoji);
  }, [onSelect]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          className="absolute bottom-full mb-3 left-4 w-[280px] sm:w-[320px] glass-panel rounded-2xl p-3 shadow-2xl z-[70] bg-background/95 backdrop-blur-md border border-white/10"
        >
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5">
            <span className="text-xs font-heading font-black text-foreground tracking-wider uppercase">
              Anime Stickers
            </span>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto custom-scrollbar pr-0.5">
            {animeStickers.map((s) => (
              <motion.button
                key={s.label}
                whileHover={{ scale: 1.25, backgroundColor: "rgba(var(--muted), 0.3)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelectSticker(s.emoji)}
                className="p-2 rounded-xl text-xl flex items-center justify-center transition-colors border border-transparent hover:border-white/5"
                title={s.label}
              >
                {s.emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickerPanel;