import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Edit2,
  Shield,
  Bell,
  Palette,
  Star,
  Trophy,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimeAvatar from "@/components/AnimeAvatar";
import { currentUser } from "@/data/mockData";

const xpData = {
  level: 12,
  currentXP: 2450,
  nextLevelXP: 3000,
  title: "Sakura Warrior",
  badges: ["🌸", "⚔️", "🎭", "✨", "🔥"],
  streak: 7,
};

const stats = [
  { label: "Messages", value: "4.2K", icon: "💬" },
  { label: "Stickers", value: "312", icon: "🎨" },
  { label: "Friends", value: "28", icon: "👥" },
  { label: "Groups", value: "6", icon: "🏠" },
];

const menuItems = [
  { icon: Edit2, label: "Edit Profile", desc: "Name, bio, avatar", color: "text-primary" },
  { icon: Palette, label: "Themes & Style", desc: "Colors, effects, outfits", color: "text-accent" },
  { icon: Bell, label: "Notifications", desc: "Sounds, anime SFX", color: "text-anime-gold" },
  { icon: Shield, label: "Privacy", desc: "Online status, chat lock", color: "text-anime-teal" },
  { icon: Star, label: "Achievements", desc: "Badges & unlocks", color: "text-anime-sakura" },
];

const Profile = () => {
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState("happy");

  const xpPercent = xpData.nextLevelXP
    ? (xpData.currentXP / xpData.nextLevelXP) * 100
    : 0;

  const cleanName = currentUser.name.replace(/^You \(|\)$/g, "");

  return (
    <div className="flex flex-col h-screen relative z-10">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel px-4 py-3 flex items-center gap-3 md:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="p-1 text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="text-sm font-heading font-bold text-foreground">
            My Profile
          </h2>
        </motion.header>

        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-6 pt-8 pb-6 flex flex-col items-center"
        >
          <div className="absolute inset-0 anime-gradient opacity-10 rounded-b-3xl" />

          <div className="relative mb-4">
            <AnimeAvatar
              src={currentUser.avatar}
              name={currentUser.name}
              status="online"
              emotion={emotion}
              size="xl"
              showStatus={false}
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full anime-gradient flex items-center justify-center text-primary-foreground shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </motion.button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-anime-gold flex items-center justify-center text-xs font-bold text-foreground shadow-lg"
            >
              {xpData.level}
            </motion.div>
          </div>

          <h1 className="text-xl font-heading font-extrabold text-foreground">
            {cleanName}
          </h1>

          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {xpData.title}
          </p>

          {/* Mood Selector */}
          <div className="flex gap-2 mt-3">
            {["happy", "playful", "neutral", "sad", "surprised"].map((e) => (
              <motion.button
                key={e}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEmotion(e)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                  emotion === e
                    ? "anime-gradient shadow-md scale-110"
                    : "bg-muted/60 hover:bg-muted"
                }`}
              >
                {e === "happy"
                  ? "😄"
                  : e === "playful"
                  ? "😜"
                  : e === "neutral"
                  ? "😐"
                  : e === "sad"
                  ? "😢"
                  : "😲"}
              </motion.button>
            ))}
          </div>

          {/* Badges */}
          <div className="flex gap-1.5 mt-3">
            {xpData.badges.map((badge, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-lg"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-6 mb-6 glass-panel rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold text-foreground">
              Level {xpData.level}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {xpData.currentXP} / {xpData.nextLevelXP} XP
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-muted/60 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full anime-gradient"
            />
          </div>
        </motion.div>

        {/* Logout */}
        <div className="mx-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-heading font-bold transition-all hover:bg-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Profile;