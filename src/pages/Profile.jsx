import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Camera, Trophy, LogOut, Edit2, Palette,
  Bell, Shield, Star, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AnimeAvatar from "../components/AnimeAvatar";
import { useFriends } from "../contexts/FriendContext";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "../components/ui/dialog";

const AVATARS = [
  "/uploads/avatar-sakura.png",
  "/uploads/avatar-kai.png",
  "/uploads/avatar-luna.png",
  "/uploads/avatar-haru.png",
  "/uploads/avatar-yuki.png"
];

const EMOTIONS = [
  { key: "happy", icon: "😄" },
  { key: "playful", icon: "😜" },
  { key: "neutral", icon: "😐" },
  { key: "sad", icon: "😢" },
  { key: "surprised", icon: "😲" }
];

const MENU_ITEMS = [
  { icon: Edit2, label: "Edit Profile", desc: "Name, bio, avatar", color: "text-primary" },
  { icon: Palette, label: "Themes & Style", desc: "Colors, effects, outfits", color: "text-accent" },
  { icon: Bell, label: "Notifications", desc: "Sounds, anime SFX", color: "text-yellow-500" },
  { icon: Shield, label: "Privacy", desc: "Online status, chat lock", color: "text-teal-500" },
  { icon: Star, label: "Achievements", desc: "Badges & unlocks", color: "text-pink-500" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { friends = [], loading = false } = useFriends() || {};

  const [emotion, setEmotion] = useState("happy");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [selectedInDialog, setSelectedInDialog] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [user?.avatar]);

  const handleSaveAvatar = async () => {
    if (!selectedInDialog) return;
    try {
      setIsUpdating(true);
      const { success, error } = await updateProfile({ avatar: selectedInDialog });
      if (success) {
        setAvatar(selectedInDialog);
      } else {
        console.error("UPDATE ERROR:", error?.response || error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const otherStats = useMemo(() => [
    { label: "Messages", value: user?.stats?.messages || "1.2K", icon: "💬" },
    { label: "Stickers", value: user?.stats?.stickers || "128", icon: "🎨" },
    { label: "Groups", value: user?.stats?.groups || "4", icon: "🏠" },
  ], [user?.stats]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="flex flex-col h-screen relative z-10">
      <div className="flex-1 overflow-y-auto">
        <motion.header className="glass-panel px-4 py-3 flex items-center gap-3 md:hidden">
          <button onClick={() => navigate("/")} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold">My Profile</h2>
        </motion.header>

        <motion.div className="relative px-6 pt-8 pb-6 flex flex-col items-center">
          <div className="absolute inset-0 anime-gradient opacity-10 rounded-b-3xl" />
          <div className="relative mb-4">
            <AnimeAvatar
              src={avatar || "/avatars/default-anime.png"}
              name={user?.username}
              status="online"
              emotion={emotion}
              size="xl"
              showStatus={false}
            />
            <Dialog>
              <DialogTrigger asChild>
                <motion.button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full anime-gradient flex items-center justify-center text-white shadow-lg">
                  <Camera className="w-4 h-4" />
                </motion.button>
              </DialogTrigger>

              <DialogContent className="max-w-sm bg-white">
                <DialogTitle className="text-center font-bold">Choose Your Avatar</DialogTitle>
                <DialogDescription className="text-center text-sm text-muted-foreground">
                  Select an avatar and save it to update your profile.
                </DialogDescription>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {AVATARS.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedInDialog(img)}
                      className={`relative p-1 rounded-full cursor-pointer transition-all ${
                        selectedInDialog === img ? 'ring-4 ring-pink-500 scale-105' : 'hover:scale-105'
                      }`}
                    >
                      <img src={img} alt="" className="w-16 h-16 rounded-full object-cover" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveAvatar}
                  disabled={isUpdating || !selectedInDialog}
                  className="w-full mt-6 py-3 rounded-xl anime-gradient text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Select & Save"
                  )}
                </button>
              </DialogContent>
            </Dialog>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-black">
              {user?.level || 1}
            </div>
          </div>

          <h1 className="text-xl font-bold">{user?.username}</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Trophy className="w-3 h-3" /> {user?.title || "Newcomer"}
          </p>

          <div className="flex gap-2 mt-3">
            {EMOTIONS.map((e) => (
              <button
                key={e.key}
                onClick={() => setEmotion(e.key)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  emotion === e.key ? "anime-gradient shadow-md scale-110" : "bg-muted/60"
                }`}
              >
                {e.icon}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-4 gap-2 mx-6 mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <motion.div className="glass-panel rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:bg-muted/50">
                <span className="text-lg">👥</span>
                <span className="text-sm font-bold">{friends.length}</span>
                <span className="text-[9px] text-muted-foreground">Friends</span>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-[70vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle>Friends List ({friends.length})</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {loading ? (
                  <p className="text-center text-sm italic">Summoning your nakamas...</p>
                ) : friends.length > 0 ? (
                  friends.map((friend) => (
                    <div key={friend._id} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100">
                      <AnimeAvatar src={friend.avatar} name={friend.username} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">{friend.username}</p>
                        <p className="text-[10px] text-green-500">Online</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-4">No friends found yet.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {otherStats.map((stat) => (
            <div key={stat.label} className="glass-panel rounded-xl p-3 flex flex-col items-center gap-1">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-sm font-bold">{stat.value}</span>
              <span className="text-[9px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="mx-6 mb-6 space-y-2">
          {MENU_ITEMS.map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left hover:bg-muted/30">
              <div className={`w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <div className="mx-6 mb-8">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Profile;