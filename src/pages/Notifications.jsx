import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, UserPlus, Gamepad2, Gift, Star, Heart, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "../contexts/FriendContext"; 
import { useSocket } from "../contexts/SocketContext"; // useSocket use karo
import { toast } from "sonner";

const typeConfig = {
  friend_request: { icon: UserPlus, color: "text-primary", bg: "bg-primary/10" },
  game: { icon: Gamepad2, color: "text-accent", bg: "bg-accent/10" },
  reward: { icon: Gift, color: "text-anime-gold", bg: "bg-anime-gold/10" },
  achievement: { icon: Star, color: "text-anime-sakura", bg: "bg-anime-sakura/10" },
  like: { icon: Heart, color: "text-destructive", bg: "bg-destructive/10" },
  system: { icon: Bell, color: "text-muted-foreground", bg: "bg-muted/60" },
};

const Notifications = () => {
  const navigate = useNavigate();
  const { socket } = useSocket(); // SocketContext se socket lo
  const { acceptRequest, pendingRequests, fetchPendingRequests, setPendingRequests } = useFriends(); 
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  // 1. Initial Load & Socket Listen
  useEffect(() => {
    fetchPendingRequests(); // API se purana data lao

    if (socket) {
      const handleNewRequest = (data) => {
        // FriendContext ki state update karo taaki formatted list apne aap update ho jaye
        setPendingRequests((prev) => [data, ...prev]);
        toast.success(`New request from ${data.senderName || "someone"}! 🌸`);
      };

      socket.on("newFriendRequest", handleNewRequest);
      return () => socket.off("newFriendRequest", handleNewRequest);
    }
  }, [socket]); // Context functions dependecy mein dalne ki zarurat nahi agar wo useCallback nahi hain

  // 2. Sync Real Data to Notification State
  useEffect(() => {
    if (pendingRequests && pendingRequests.length > 0) {
      const formattedReqs = pendingRequests.map(req => ({
        id: req._id || Math.random(),
        senderId: req._id,
        type: "friend_request",
        title: `${req.username || "Someone"} sent you a friend request`,
        description: "Tap to accept or decline",
        time: "New",
        read: false,
        avatar: req.avatar
      }));
      setNotifications(formattedReqs);
    } else {
      setNotifications([]); // Agar khali hai toh khali karo
    }
  }, [pendingRequests]);

  const handleAccept = async (notifId, senderId) => {
    try {
      await acceptRequest(senderId);
      toast.success("Accepted! Now you are Nakama! 🌸");
      // Note: setPendingRequests context ke andar hi filter ho jayega toh yahan zarurat nahi
    } catch (err) {
      toast.error("Failed to accept");
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="flex flex-col h-screen relative z-10 bg-background overflow-hidden">
      {/* Header */}
      <motion.header className="glass-panel px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate("/")} />
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px]">{unreadCount}</span>
            )}
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="px-4 py-3 shrink-0">
        <div className="flex gap-2 p-1 rounded-2xl bg-muted/30">
          {["all", "unread"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {f === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((notif) => {
              const config = typeConfig[notif.type] || typeConfig.system;
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/80 backdrop-blur-md p-4 rounded-3xl mb-4 border border-white shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    {notif.avatar ? (
                      <img src={notif.avatar} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{notif.title}</p>
                      <p className="text-[11px] text-muted-foreground">{notif.description}</p>
                    </div>

                    <button onClick={() => removeNotification(notif.id)} className="text-muted-foreground/20 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {notif.type === "friend_request" && (
                    <div className="flex gap-2 pl-12">
                      <button
                        onClick={() => handleAccept(notif.id, notif.senderId)}
                        className="bg-primary text-muted-foreground  px-6 py-2 rounded-2xl text-[11px] font-bold shadow-md hover:brightness-110 active:scale-95 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="bg-primary text-muted-foreground px-6 py-2 rounded-2xl text-[11px] font-bold hover:bg-muted/80 transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center">
              <Bell className="w-16 h-16 mb-4" />
              <p className="text-sm font-medium italic font-heading">All quiet in the guild... 🌸</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;