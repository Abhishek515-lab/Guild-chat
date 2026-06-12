import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import AnimeAvatar from "./AnimeAvatar";

const ChatListItem = ({ chat, index, isActive = false, isOnline = false }) => {
  const navigate = useNavigate();

  const displayName = chat?.name || "Nakama";
  const displayAvatar = chat?.avatar || "";
  const unreadCount = Number(chat?.unread) || 0;

  const handleItemClick = useCallback(() => {
    if (chat?.id) {
      navigate(`/chat/${chat.id}`);
    }
  }, [chat?.id, navigate]);

  const animationProps = useMemo(() => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: index * 0.03 }
  }), [index]);

  return (
    <motion.button
      {...animationProps}
      onClick={handleItemClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${
        isActive ? "bg-muted/60 ring-1 ring-primary/20" : "hover:bg-muted/30"
      }`}
    >
      <div className="relative flex-shrink-0">
        <AnimeAvatar
          src={displayAvatar}
          name={displayName}
          status={isOnline ? "online" : "offline"}
          size="md"
        />
        
        <AnimatePresence mode="wait">
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 bg-pink-500 text-white min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg z-20 animate-bounce"
            >
              {unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-heading font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {displayName}
          </h3>
          <span className="text-[10px] text-muted-foreground ml-2 flex-shrink-0">
            {chat?.time || "Now"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted-foreground truncate italic pr-2">
            {chat?.lastMessage || "No messages yet"}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

export default ChatListItem;