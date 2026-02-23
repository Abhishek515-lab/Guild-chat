import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="absolute bottom-full mb-2 left-0 right-0 mx-3 glass-panel rounded-2xl p-3 shadow-xl z-20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold text-foreground">
              Anime Stickers
            </span>

            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
            {animeStickers.map((s) => (
              <motion.button
                key={s.label}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSelect(s.emoji)}
                className="p-2 rounded-lg hover:bg-muted/50 text-xl flex items-center justify-center"
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