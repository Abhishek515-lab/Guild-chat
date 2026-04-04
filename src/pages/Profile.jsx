

// export default Profile;
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Trophy,
  LogOut,
  Edit2,
  Palette,
  Bell,
  Shield,
  Star,
  ChevronRight,
  User as UserIcon 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AnimeAvatar from "../components/AnimeAvatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";


import avatarSakura from "../assets/avatar-sakura.png";
import avatarKai from "../assets/avatar-kai.png";
import avatarLuna from "../assets/avatar-luna.png";
import avatarHaru from "../assets/avatar-haru.png";
import avatarYuki from "../assets/avatar-yuki.png";

const avatars = [avatarSakura, avatarKai, avatarLuna, avatarHaru, avatarYuki];

const xpData = {
  level: 12,
  currentXP: 2450,
  nextLevelXP: 3000,
  title: "Sakura Warrior",
  badges: ["🌸", "⚔️", "🎭", "✨", "🔥"],
  streak: 7,
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [emotion, setEmotion] = useState("happy");
  const [avatar, setAvatar] = useState(user?.avatar);
  
  // Real Friends Data State
  const [friendsList, setFriendsList] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
    
// fatch friend list
    const fetchFriends = async () => {
      setLoadingFriends(true);
      try {
       
        const data = user?.friends || []; 
        setFriendsList(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [user]);

  const xpPercent = (xpData.currentXP / xpData.nextLevelXP) * 100;

  const handleAvatarSelect = (img) => {
    setAvatar(img);
  };

 
  const otherStats = [
    { label: "Messages", value: user?.stats?.messages || "4.2K", icon: "💬" },
    { label: "Stickers", value: user?.stats?.stickers || "312", icon: "🎨" },
    { label: "Groups", value: user?.stats?.groups || "6", icon: "🏠" },
  ];

  const menuItems = [
    { icon: Edit2, label: "Edit Profile", desc: "Name, bio, avatar", color: "text-primary" },
    { icon: Palette, label: "Themes & Style", desc: "Colors, effects, outfits", color: "text-accent" },
    { icon: Bell, label: "Notifications", desc: "Sounds, anime SFX", color: "text-yellow-500" },
    { icon: Shield, label: "Privacy", desc: "Online status, chat lock", color: "text-teal-500" },
    { icon: Star, label: "Achievements", desc: "Badges & unlocks", color: "text-pink-500" },
  ];

  return (
    <div className="flex flex-col h-screen relative z-10">
      <div className="flex-1 overflow-y-auto">
        
        {/* HEADER */}
        <motion.header
          className="glass-panel px-4 py-3 flex items-center gap-3 md:hidden"
        >
          <button onClick={() => navigate("/")} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold">My Profile</h2>
        </motion.header>

        {/* PROFILE HERO */}
        <motion.div className="relative px-6 pt-8 pb-6 flex flex-col items-center">
          <div className="absolute inset-0 anime-gradient opacity-10 rounded-b-3xl" />
          <div className="relative mb-4">
            <AnimeAvatar src={avatar || user?.avatar} name={user?.username} status="online" emotion={emotion} size="xl" showStatus={false} />
            
            <Dialog>
              <DialogTrigger asChild>
                <motion.button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full anime-gradient flex items-center justify-center text-white shadow-lg">
                  <Camera className="w-4 h-4" />
                </motion.button>
              </DialogTrigger>
              <DialogContent className="max-w-sm bg-white">
                <DialogTitle className="text-center">Choose Anime Avatar</DialogTitle>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {avatars.map((img, index) => (
                    <img key={index} src={img} alt="avatar" className="w-16 h-16 rounded-full cursor-pointer hover:scale-110 transition" onClick={() => handleAvatarSelect(img)} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-black">
              {xpData.level}
            </div>
          </div>

          <h1 className="text-xl font-bold">{user?.username || "Guest User"}</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Trophy className="w-3 h-3" /> {xpData.title}
          </p>

          <div className="flex gap-2 mt-3">
            {["happy", "playful", "neutral", "sad", "surprised"].map((e) => (
              <button key={e} onClick={() => setEmotion(e)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${emotion === e ? "anime-gradient shadow-md scale-110" : "bg-muted/60"}`}>{e === "happy" ? "😄" : e === "playful" ? "😜" : e === "neutral" ? "😐" : e === "sad" ? "😢" : "😲"}</button>
            ))}
          </div>
        </motion.div>

        {/* STATS GRID WITH REAL FRIENDS DIALOG */}
        <div className="grid grid-cols-4 gap-2 mx-6 mb-6">
          {/* Friends Stat with Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.div className="glass-panel rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
                <span className="text-lg">👥</span>
                <span className="text-sm font-bold">{friendsList.length || user?.friendsCount || 0}</span>
                <span className="text-[9px] text-muted-foreground">Friends</span>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-[70vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle>Friends List ({friendsList.length})</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {loadingFriends ? (
                  <p className="text-center text-sm">Loading friends...</p>
                ) : friendsList.length > 0 ? (
                  friendsList.map((friend, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100">
                      <img src={friend.avatar || avatarSakura} className="w-10 h-10 rounded-full border-2 border-primary/20" alt={friend.username} />
                      <div className="flex-1">
                        <p className="text-sm font-bold">{friend.username}</p>
                        <p className="text-[10px] text-green-500">{friend.status || "Online"}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-4">No friends found yet. 🌸</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Other Stats */}
          {otherStats.map((stat, i) => (
            <div key={stat.label} className="glass-panel rounded-xl p-3 flex flex-col items-center gap-1">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-sm font-bold">{stat.value}</span>
              <span className="text-[9px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* MENU & LOGOUT (Same as before) */}
        <div className="mx-6 mb-6 space-y-2">
          {menuItems.map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left">
              <div className={`w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center ${item.color}`}><item.icon className="w-4 h-4" /></div>
              <div className="flex-1"><p className="text-sm font-bold">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <div className="mx-6 mb-8">
          <motion.button onClick={() => { logout(); navigate("/auth"); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all">
            <LogOut className="w-4 h-4" /> Log Out
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Profile;