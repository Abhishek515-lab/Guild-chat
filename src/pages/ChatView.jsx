import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, Video, Smile, Send, Sparkles, MoreVertical, Mic } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

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
  const { messages, fetchMessages, sendNewMessage, setSelectedUser } = useChat();

  // States
  const [input, setInput] = useState("");
  const [otherEmotion, setOtherEmotion] = useState("neutral");
  const [showStickers, setShowStickers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const selectedFriend = useMemo(() => {
    return friends?.find(f => f._id === userId);
  }, [userId, friends]);

  // 1. Context Sync (Refresh Fix)
  useEffect(() => {
    if (userId && selectedFriend) {
      setSelectedUser(selectedFriend);
      fetchMessages(userId);
    }
    return () => setSelectedUser(null);
  }, [userId, selectedFriend, setSelectedUser, fetchMessages]);

  // 2. Auto Scroll to Bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Socket Listeners (Typing only - Messages handled by Context)
  useEffect(() => {
    if (!socket || !userId) return;

    socket.on("displayTyping", ({ senderId }) => {
      if (senderId === userId) setIsTyping(true);
    });
    socket.on("hideTyping", ({ senderId }) => {
      if (senderId === userId) setIsTyping(false);
    });

    return () => {
      socket.off("displayTyping");
      socket.off("hideTyping");
    };
  }, [socket, userId]);

  // --- Helpers & Handlers ---
  const detectEmotion = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("!") || lower.includes("haha") || lower.includes("love")) return "happy";
    if (lower.includes("sad") || lower.includes("sorry") || lower.includes("😭")) return "sad";
    if (lower.includes("angry") || lower.includes("baka") || lower.includes("stfu")) return "angry";
    return "neutral";
  };

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    const messageText = input.trim();
    const emotion = detectEmotion(messageText);

    // 1. Input pehle hi saaf kar do (Optimistic)
    setInput("");

    try {
      // 2. Message bhejo
      await sendNewMessage(userId, {
        text: messageText,
        emotion: emotion || "neutral",
        type: "text"
      });

      // 3. ⚡ ASLI TRICK: Manual Scroll trigger karo message bhejte hi
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
      console.error("Failed to send:", err);
      // Error aaye toh input wapas dikha sakte ho (Optional)
      // setInput(messageText); 
    }
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

  const isOnline = onlineUsers?.includes(userId);
  return (
    <div className="flex flex-col h-screen bg-background/50 relative overflow-hidden">
      <header className="glass-panel px-4 py-3 flex items-center justify-between z-20 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <AnimeAvatar
            src={selectedFriend?.avatar || null}
            name={selectedFriend?.username || "Ninja"}
            status={isOnline ? "online" : "offline"}
            emotion={otherEmotion}
            size="sm"
          />

          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-none mb-1">
              {selectedFriend?.username || "Loading..."}
            </h2>
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

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        <ChatMascot emotion={otherEmotion} />
        {messages.map((msg) => (
          <ChatBubble
            key={msg._id || msg.id}
            message={msg}
            isMine={msg.senderId === user?._id}
          />
        ))}
        <div ref={bottomRef} className="h-2" />
      </div>

      <footer className="p-4 bg-background/80 backdrop-blur-md border-t border-white/5">
        <StickerPanel
          open={showStickers}
          onClose={() => setShowStickers(false)}
          onSelect={(s) => sendNewMessage(userId, { text: s, type: 'sticker', emotion: 'playful' })}
        />

        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-3 py-1 flex-1 border border-white/5 focus-within:border-primary/30 transition-all">
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
            <Mic className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 rounded-xl anime-gradient text-white shadow-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;