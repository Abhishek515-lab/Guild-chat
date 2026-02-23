import { motion } from "framer-motion";
import { Search, MoreVertical, Users, MessageCircle } from "lucide-react";
import { useState } from "react";

import AnimeAvatar from "./components/AnimeAvatar";
import ChatListItem from "./components/ChatListItem";
import ThemePicker from "./components/ThemePicker";
import FABMenu from "./components/FABMenu";
import { currentUser, chats } from "../data/mockData";

const Index = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("chats");

  const filtered = chats.filter((c) => {
    const matchesTab = tab === "groups" ? c.isGroup : !c.isGroup;

    if (!search) return matchesTab;

    const name = c.name || "";
    return (
      matchesTab &&
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const tabs = [
    { key: "chats", icon: MessageCircle, label: "Chats" },
    { key: "groups", icon: Users, label: "Groups" },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative z-10">
      {/* Header */}
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
                AnimeChat
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Your anime world awaits ✨
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

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/40">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
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
      </motion.header>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        {filtered.map((chat, i) => (
          <ChatListItem key={chat.id} chat={chat} index={i} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <span className="text-4xl mb-2">🔍</span>
            <p className="text-sm">No chats found</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <FABMenu />
    </div>
  );
};

export default Index;