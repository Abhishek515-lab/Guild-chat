import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimeAvatar from "./AnimeAvatar";
import { users } from "../data/mockData";

const ChatListItem = ({ chat, index, isActive = false }) => {
  const navigate = useNavigate();

  const otherUserId =
    chat?.participants?.find((p) => p !== "me") || "kai";

  const otherUser = users?.[otherUserId];

  const displayName = chat?.isGroup
    ? chat?.name
    : otherUser?.name;

  const displayAvatar = chat?.isGroup
    ? users?.[chat?.participants?.[1]]?.avatar
    : otherUser?.avatar;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (index || 0) * 0.05 }}
      whileHover={{ x: 4, backgroundColor: "hsl(var(--muted) / 0.5)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/chat/${chat?.id}`)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
        isActive ? "bg-muted/60 ring-1 ring-primary/20" : ""
      }`}
    >
      <AnimeAvatar
        src={displayAvatar || ""}
        name={displayName || ""}
        status={chat?.isGroup ? "online" : otherUser?.status || "offline"}
        emotion={chat?.isGroup ? "happy" : otherUser?.emotion || "neutral"}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-heading font-bold text-foreground truncate">
            {displayName}
            {chat?.isGroup && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({chat?.participants?.length})
              </span>
            )}
          </h3>

          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
            {chat?.lastMessage?.timestamp}
          </span>
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted-foreground truncate">
            {chat?.lastMessage?.text}
          </p>

          {chat?.unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 flex-shrink-0 w-5 h-5 rounded-full anime-gradient flex items-center justify-center text-[10px] font-bold text-primary-foreground"
            >
              {chat?.unreadCount}
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default ChatListItem;