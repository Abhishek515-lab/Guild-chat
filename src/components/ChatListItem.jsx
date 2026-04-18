import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimeAvatar from "./AnimeAvatar";

const ChatListItem = ({ chat, index, isActive = false }) => {
  const navigate = useNavigate();

  const displayName = chat?.name; 
  const displayAvatar = chat?.avatar;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/chat/${chat?.id}`)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
        isActive ? "bg-muted/60 ring-1 ring-primary/20" : "hover:bg-muted/30"
      }`}
    >
      <div className="relative">
        <AnimeAvatar
          src={displayAvatar || ""}
          name={displayName || "Nakama"}
          status="online"
          size="md"
        />
        
        {/* 🔥 FIX 1: Avatar ke upar "!" wala badge */}
        <AnimatePresence>
  {chat?.unread > 0 && (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute -top-1 -right-1 bg-pink-500 text-white min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg z-20 animate-bounce"
    >
      {chat.unread}
    </motion.div>
  )}
</AnimatePresence>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-heading font-bold text-foreground truncate">
            {displayName}
          </h3>
          <span className="text-[10px] text-muted-foreground ml-2">
            {chat?.time || "Now"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted-foreground truncate italic">
            {chat?.lastMessage}
          </p>
          
          {/* Pehle wala dot hata diya kyunki ab upar "!" dikh raha hai */}
        </div>
      </div>
    </motion.button>
  );
};

export default ChatListItem;