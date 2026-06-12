import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, Users, MessageCircle, Shield, Gamepad2 } from "lucide-react";

import AnimeAvatar from "./components/AnimeAvatar";
import ChatListItem from "./components/ChatListItem";
import ThemePicker from "./components/ThemePicker";
import FABMenu from "./components/FABMenu";
import { currentUser, chats } from "../data/mockData";

const TABS = [
  { key: "chats", icon: MessageCircle, label: "Chats" },
  { key: "guild", icon: Shield, label: "Guild" },
  { key: "friends", icon: Users, label: "Friends" },
  { key: "games", icon: Gamepad2, label: "Games" },
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("chats");

  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      let matchesTab = false;
      if (tab === "chats") matchesTab = !c.isGroup && !c.isGuild;
      else if (tab === "guild") matchesTab = !!c.isGuild;
      else if (tab === "friends") matchesTab = !!c.isFriend;
      else if (tab === "games") matchesTab = false;

      if (!matchesTab) return false;
      if (!search) return true;

      return (c.name || "").toLowerCase().includes(search.toLowerCase());
    });
  }, [search, tab]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative z-10">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 pt-6 pb-3"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AnimeAvatar
              src={currentUser.avatar}
              name={currentUser.name}
              status={currentUser.status}
              emotion={currentUser.emotion}
              size="sm"
            />
            <div>
              <h1 className="text-lg font-heading font-extrabold text-foreground">
                GuildChat
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Welcome back, {currentUser.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ThemePicker />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-foreground"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-muted/40 overflow-x-auto custom-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
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
      </motion.header>

      <div className="flex-1 overflow-y-auto px-2 pb-20">
        {tab === "games" ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Games section loaded.
          </div>
        ) : (
          filteredChats.map((chat, i) => (
            <ChatListItem key={chat.id} chat={chat} index={i} />
          ))
        )}

        {tab !== "games" && filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <span className="text-4xl mb-2">🔍</span>
            <p className="text-sm">No chats found</p>
          </div>
        )}
      </div>

      <FABMenu />
    </div>
  );
};

export default Index;