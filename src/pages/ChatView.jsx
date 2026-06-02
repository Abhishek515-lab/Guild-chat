import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Phone, Video, Smile, Send,
  MoreVertical, Mic, Image, MapPin, UserPlus,
  Music, Trash2, Edit2, Copy, X, Plus
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";

// Contexts
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import { useSocket } from "../contexts/SocketContext";
import { useFriends } from "../contexts/FriendContext";

// Components
import AnimeAvatar from "../components/AnimeAvatar";
import ChatBubble from "../components/ChatBubble";
import ChatMascot from "../components/ChatMascot";
import StickerPanel from "../components/StickerPanel";

const ChatView = () => {
  const { chatId: userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const { friends } = useFriends();

  // Context functions
  const { messages, fetchMessages, sendNewMessage, setSelectedUser, setMessages } = useChat();

  // States
  const [input, setInput] = useState("");
  const [otherEmotion, setOtherEmotion] = useState("neutral");
  const [showStickers, setShowStickers] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const selectedFriend = useMemo(() => {
    return friends?.find(f => f._id === userId);
  }, [userId, friends]);

  // FIXED: Sync Context & Fetch (Dependency Array Cleaned up)
  useEffect(() => {
    if (userId && selectedFriend) {
      setSelectedUser(selectedFriend);
      fetchMessages(userId);
    }
    return () => {
      setSelectedUser(null);
      setMessages([]); // Cleanup on unmount
    };
    // केवल userId और selectedFriend बदलने पर ही दोबारा रन होगा
  }, [userId, selectedFriend]); 

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket Listeners
  useEffect(() => {
    if (!socket || !userId) return;
    
    const handleDisplayTyping = ({ senderId }) => senderId === userId && setIsTyping(true);
    const handleHideTyping = ({ senderId }) => senderId === userId && setIsTyping(false);

    socket.on("displayTyping", handleDisplayTyping);
    socket.on("hideTyping", handleHideTyping);
    
    return () => {
      socket.off("displayTyping", handleDisplayTyping);
      socket.off("hideTyping", handleHideTyping);
    };
  }, [socket, userId]);

  // --- Handlers ---
  const handleSend = async (customContent = null, type = "text") => {
    const messageText = customContent || input.trim();
    if (!messageText || !userId) return;

    const emotion = detectEmotion(messageText);
    if (!customContent) setInput("");
    setShowMediaMenu(false);

    try {
      await sendNewMessage(userId, {
        text: messageText,
        emotion: emotion || "neutral",
        type: type
      });
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const detectEmotion = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("!") || lower.includes("haha")) return "happy";
    if (lower.includes("sad") || lower.includes("😭")) return "sad";
    if (lower.includes("angry") || lower.includes("baka")) return "angry";
    return "neutral";
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socket && user?._id && userId) {
      socket.emit("typing", { senderId: user._id, receiverId: userId });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { senderId: user._id, receiverId: userId });
      }, 2000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
    setSelectedMsgId(null);
  };

  const isOnline = onlineUsers?.includes(userId);

  return (
    <div className="flex flex-col h-screen bg-background/50 relative overflow-hidden">
      {/* Header */}
      <header className="glass-panel px-4 py-3 flex items-center justify-between z-20 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <AnimeAvatar
            src={selectedFriend?.avatar}
            name={selectedFriend?.username || "Ninja"}
            status={isOnline ? "online" : "offline"}
            emotion={otherEmotion}
            size="sm"
          />
          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-none mb-1">{selectedFriend?.username || "Loading..."}</h2>
            <span className="text-[10px] flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
          <Video className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
          <MoreVertical className="w-4 h-4 cursor-pointer" />
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar overflow-x-hidden">
        <ChatMascot emotion={otherEmotion} />
        {messages.map((msg) => (
          <div key={msg._id} className="relative group max-w-full">
            <div
              onClick={() => setSelectedMsgId(selectedMsgId === msg._id ? null : msg._id)}
              className="cursor-pointer transition-transform active:scale-[0.98]"
            >
              <ChatBubble
                message={msg}
                isMine={msg.senderId === user?._id}
              />
            </div>

            {/* Message Actions (CRUD UI) */}
            <AnimatePresence>
              {selectedMsgId === msg._id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute z-30 -top-10 flex gap-1 bg-card/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-2xl ${msg.senderId === user?._id ? 'right-0' : 'left-0'}`}
                >
                  <button onClick={() => copyToClipboard(msg.text)} className="p-2 hover:bg-white/10 rounded-lg text-xs flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {msg.senderId === user?._id && (
                    <>
                      <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                  <button onClick={() => setSelectedMsgId(null)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-3.5 h-3.5" /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Footer with Media Menu */}
      <footer className="p-4 bg-background/80 backdrop-blur-md border-t border-white/5 relative">
        <StickerPanel
          open={showStickers}
          onClose={() => setShowStickers(false)}
          onSelect={(s) => handleSend(s, 'sticker')}
        />

        {/* Multimedia Menu */}
        <AnimatePresence>
          {showMediaMenu && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              className="absolute bottom-16 left-0 grid grid-cols-2 gap-3 p-3 glass-panel rounded-2xl z-30 shadow-2xl border border-primary/20 w-48"
            >
              {[
                { icon: Image, label: "Gallery", color: "text-blue-400" },
                { icon: Music, label: "Audio", color: "text-purple-400" },
                { icon: MapPin, label: "Location", color: "text-red-400" },
                { icon: UserPlus, label: "Contact", color: "text-green-400" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    toast.info(`${item.label} opened!`);
                    setShowMediaMenu(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-[11px] font-medium text-foreground/80">{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* FIXED: Removed duplicate nested button wrapper */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMediaMenu(!showMediaMenu)}
            className={`p-2 rounded-2xl transition-all duration-300 shadow-md ${showMediaMenu
              ? 'bg-primary text-white rotate-45'
              : 'bg-muted/80 text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
          >
            <Plus className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-3 py-1 flex-1 border border-white/5 focus-within:border-primary/30 transition-all shadow-inner">
            <Smile
              className={`w-5 h-5 cursor-pointer transition-colors ${showStickers ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setShowStickers(!showStickers)}
            />
            <input
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Message ${selectedFriend?.username || 'Nakama'}...`}
              className="w-full bg-transparent py-2 text-sm focus:outline-none placeholder:text-muted-foreground/50"
            />
            <Mic className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-3 rounded-xl anime-gradient text-white shadow-lg disabled:opacity-50 disabled:grayscale transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;