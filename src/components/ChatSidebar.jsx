import { motion } from "framer-motion";
import { Search, MoreVertical, Users, MessageCircle, Bell, Gamepad2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimeAvatar from "../components/AnimeAvatar";
import ChatListItem from "../components/ChatListItem";
import ThemePicker from "../components/ThemePicker";
import FriendSearch from "../components/FriendSearch";
import { currentUser, chats } from "@/data/mockData";

const ChatSidebar = () => {
  const [search, setSearch] = useState("");
  // TypeScript ka type definition hata kar simple state rakha hai
  const [tab, setTab] = useState("chats"); 
  const navigate = useNavigate();
  const { chatId } = useParams();

  // Filter logic for chats/groups
  const filtered = chats.filter((c) => {
    const matchesTab = tab === "groups" ? c.isGroup : !c.isGroup;
    if (!search) return matchesTab;
    const name = c.name || "";
    return matchesTab && name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              <AnimeAvatar
                src={currentUser.avatar}
                name={currentUser.name}
                status={currentUser.status}
                emotion={currentUser.emotion}
                size="sm"
              />
            </motion.button>
            <div>
              <h1 className="text-lg font-heading font-extrabold text-foreground">AnimeChat</h1>
              <p className="text-[10px] text-muted-foreground">Your anime world awaits ✨</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <ThemePicker />
            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/notifications")}
              className="p-2 rounded-full text-foreground hover:bg-muted/50 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-full text-foreground">
              <MoreVertical className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/40">
          {[
            { key: "chats", icon: MessageCircle, label: "Chats" },
            { key: "groups", icon: Users, label: "Groups" },
            { key: "friends", icon: UserPlus, label: "Friends" },
            { key: "games", icon: Gamepad2, label: "Games" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === "games") {
                  navigate("/games");
                  return;
                }
                setTab(t.key);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                tab === t.key
                  ? "anime-gradient text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content List */}
      {tab === "friends" ? (
        <FriendSearch />
      ) : (
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filtered.map((chat, i) => (
            <ChatListItem key={chat.id} chat={chat} index={i} isActive={chat.id === chatId} />
          ))}
          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <span className="text-4xl mb-2">🔍</span>
              <p className="text-sm font-body">No chats found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;