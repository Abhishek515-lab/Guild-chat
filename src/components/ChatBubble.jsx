import { motion } from "framer-motion";
import { useState } from "react";
import MessageReactions from "./MessageReactions";

const ChatBubble = ({ message, isMine }) => {
  const [reactions, setReactions] = useState({});

  const handleReact = (emoji) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  const isSticker = message?.type === "sticker";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}
    >
      <div className="max-w-[75%]">
        {isSticker ? (
          <motion.div whileHover={{ scale: 1.1 }} className="text-5xl py-2">
            {message?.text}
          </motion.div>
        ) : message?.type === "voice" ? (
          <div
            className={`px-4 py-2.5 ${
              isMine ? "chat-bubble-sent" : "chat-bubble-received"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 rounded-full bg-destructive"
              />
              <div className="flex gap-0.5">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.08,
                    }}
                    className="w-1 h-4 rounded-full bg-primary/60"
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground ml-1">
                0:12
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 block text-right">
              {message?.timestamp}
            </span>
          </div>
        ) : (
          <div
            className={`px-4 py-2.5 ${
              isMine ? "chat-bubble-sent" : "chat-bubble-received"
            } shadow-sm`}
          >
            <p className="text-sm font-body leading-relaxed text-foreground">
              {message?.text}
            </p>
            <span className="text-[10px] text-muted-foreground mt-1 block text-right">
              {message?.timestamp}
            </span>
          </div>
        )}

        <MessageReactions
          reactions={reactions}
          onReact={handleReact}
        />
      </div>
    </motion.div>
  );
};

export default ChatBubble;