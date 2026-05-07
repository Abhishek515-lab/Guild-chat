import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion ,AnimatePresence} from "framer-motion";
import { Search, MoreVertical, MessageCircle, Bell } from "lucide-react";

import AnimeAvatar from "../components/AnimeAvatar";
import ChatListItem from "../components/ChatListItem";
import ThemePicker from "../components/ThemePicker";
import FriendSearch from "../components/FriendSearch";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { useFriends } from "../contexts/FriendContext";
import { useSocket } from "../contexts/SocketContext";
const ChatSidebar = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const { friends } = useFriends();
  const { onlineUsers } = useSocket();
  const {
    conversations,
    setConversations, // 👈 Make sure ChatContext exports this
    setSelectedUser,
    fetchMessages,
    fetchConversations,
    loading
  } = useChat();
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("chats");

  useEffect(() => {
    if (fetchConversations) {
      fetchConversations();
    }
  }, []);

  const navigationTabs = [
    { key: "chats", label: "Chats" },
    { key: "Guild", label: "Guild" },
    { key: "friends", label: "Friends" },
    { key: "games", label: "Games" },
  ];

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];

    const filtered = conversations.filter((conv) => {
      const chatName = conv.username || conv.name || "Unknown User";
      return chatName.toLowerCase().includes(search.toLowerCase());
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.updatedAt || 0).getTime();
      const dateB = new Date(b.updatedAt || 0).getTime();
      return dateB - dateA;
    });
  }, [conversations, search]);

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header Section */}
      <header className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="cursor-pointer focus:outline-none"
            >
              <AnimeAvatar
                src={currentUser?.avatar}
                name={currentUser?.username}
                status="online"
                size="sm"
              />
            </motion.button>

            <div>
              <h1 className="text-lg font-heading font-extrabold text-foreground leading-tight">
                GuildChat
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Welcome back, {currentUser?.username || "Nakama"} ✨
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ThemePicker />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/notifications")}
              className="p-2 rounded-full text-foreground hover:bg-muted/50 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </motion.button>
            <MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer" />
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${tab}...`}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/60 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 border border-transparent"
          />
        </div>

        <nav className="flex gap-1 p-1 rounded-xl anime-gradient text-white">
          {navigationTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === "games") { navigate("/games"); return; }
                setTab(t.key);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-heading font-bold transition-all duration-200 ${tab === t.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted/20"
                }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* List Section */}
     <main className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tab === "friends" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FriendSearch />
            </motion.div>
          ) : (
            <div className="flex flex-col gap-0.5 py-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv, i) => {
                  const friendInfo = friends?.find((f) => f._id === conv._id);
                  const isOnline = onlineUsers?.includes(conv._id);
                  
                  return (
                    <ChatListItem
                      key={conv._id}
                      index={i}
                      isActive={chatId === conv._id}
                      onClick={() => handleSelectChat(conv)}
                      chat={{
                        id: conv._id,
                        name: conv.username || conv.name || "Unknown",
                        avatar: friendInfo?.avatar || conv.avatar,
                        lastMessage: conv.lastMessage,
                        time: conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                        unread: conv.unreadCount || 0,
                        status: isOnline ? "online" : "offline"
                      }}
                    />
                  );
                })
              ) : (
                !loading && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <MessageCircle className="w-12 h-12 mb-2" />
                    <p className="text-xs font-heading font-bold uppercase">No Missions Found</p>
                  </div>
                )
              )}

              {loading && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-heading font-black text-primary animate-pulse">LOADING DATA...</p>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ChatSidebar;