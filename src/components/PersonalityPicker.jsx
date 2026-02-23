import { motion, AnimatePresence } from "framer-motion";

const modes = [
  { key: "tsundere", emoji: "😤", label: "Tsundere", desc: "It's not like I care..." },
  { key: "soft", emoji: "🥺", label: "Soft & Caring", desc: "You're doing great~" },
  { key: "chaotic", emoji: "😂", label: "Funny Chaotic", desc: "LMAOOO no way!!" },
  { key: "senpai", emoji: "😎", label: "Serious Senpai", desc: "Indeed, interesting." },
];

const PersonalityPicker = ({ current, onChange, open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-full mt-1 right-0 glass-panel rounded-xl p-2 shadow-xl z-30 w-52"
        >
          {modes.map((m) => (
            <motion.button
              key={m.key}
              whileHover={{ x: 4 }}
              onClick={() => {
                onChange(m.key);
                onClose();
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                current === m.key
                  ? "bg-primary/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <span className="text-lg">{m.emoji}</span>
              <div>
                <p className="text-xs font-heading font-bold">{m.label}</p>
                <p className="text-[10px] opacity-70">{m.desc}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalityPicker;