import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";

const reactionEmojis = ["❤️", "😂", "🔥", "😮", "😢", "👏"];

const MessageReactions = ({ reactions, onReact }) => {
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = useCallback(() => {
    setShowPicker((prev) => !prev);
  }, []);

  const handleSelectEmoji = useCallback((emoji) => {
    if (onReact) onReact(emoji);
    setShowPicker(false);
  }, [onReact]);

  const activeReactions = useMemo(() => {
    return Object.entries(reactions || {}).filter(([_, count]) => count > 0);
  }, [reactions]);

  return (
    <div className="relative">
      <div className="flex items-center gap-1 mt-1">
        {activeReactions.map(([emoji, count]) => (
          <motion.button
            key={emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => handleSelectEmoji(emoji)}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted/60 text-xs hover:bg-muted"
          >
            <span>{emoji}</span>
            {count > 1 && (
              <span className="text-muted-foreground text-[10px]">
                {count}
              </span>
            )}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePicker}
          className="w-5 h-5 rounded-full bg-muted/40 flex items-center justify-center text-[10px] text-muted-foreground hover:bg-muted"
        >
          +
        </motion.button>
      </div>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full mb-1 left-0 flex gap-0.5 p-1.5 rounded-xl glass-panel shadow-lg z-20 bg-background/80 backdrop-blur-sm border border-white/10"
          >
            {reactionEmojis.map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => handleSelectEmoji(emoji)}
                className="p-1 text-sm hover:bg-muted/40 rounded transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageReactions;