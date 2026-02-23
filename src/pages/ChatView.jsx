import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Send,
  Image,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

import AnimeAvatar from "../components/AnimeAvatar";
import ChatBubble from "../components/ChatBubble";
import ChatMascot from "../components/ChatMascot";
import StickerPanel from "../components/StickerPanel";
import PersonalityPicker from "../components/PersonalityPicker";

import { chats, users, currentUser } from "../data/mockData";

const personalityReplies = {
  tsundere: [
    { text: "I-it's not like I care or anything... baka! 😤", emotion: "angry" },
    { text: "Hmph, I guess that's... okay. Don't get the wrong idea!", emotion: "neutral" },
    { text: "W-whatever! It's not like I was waiting for your message!", emotion: "surprised" },
  ],
  soft: [
    { text: "Aww that's so sweet~ You're amazing! 🥺💕", emotion: "happy" },
    { text: "You always make my day brighter~ 🌸", emotion: "happy" },
    { text: "Take care of yourself, okay? I'm always here~ 💗", emotion: "happy" },
  ],
  chaotic: [
    { text: "LMAOOO BRO WHATTT 😂😂😂", emotion: "playful" },
    { text: "NO WAY HAHAHA I CAN'T- 💀💀", emotion: "playful" },
    { text: "bruh moment fr fr 😂🔥 this is sending me", emotion: "surprised" },
  ],
  senpai: [
    { text: "Indeed. A most intriguing observation. 🧐", emotion: "neutral" },
    { text: "You show great potential. Continue on this path. 😎", emotion: "neutral" },
    { text: "Hmm, I see. You've thought about this carefully.", emotion: "happy" },
  ],
};

const ChatView = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const chat = chats.find((c) => c.id === chatId);

  const [messages, setMessages] = useState(chat?.messages || []);
  const [input, setInput] = useState("");
  const [myEmotion, setMyEmotion] = useState("neutral");
  const [otherEmotion, setOtherEmotion] = useState("neutral");
  const [showStickers, setShowStickers] = useState(false);
  const [personality, setPersonality] = useState("soft");
  const [showPersonality, setShowPersonality] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const bottomRef = useRef(null);

  const otherUserId =
    chat?.participants.find((p) => p !== "me") || "kai";
  const otherUser = users[otherUserId];
  const displayName = chat?.isGroup ? chat.name : otherUser?.name;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.emotion) {
      if (lastMsg.senderId === "me") setMyEmotion(lastMsg.emotion);
      else setOtherEmotion(lastMsg.emotion);
    }
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOtherEmotion("sleeping");
    }, 30000);
    return () => clearTimeout(timer);
  }, [messages]);

  const detectEmotion = useCallback((text) => {
    const lower = text.toLowerCase();
    if (lower.includes("!") || lower.includes("haha") || lower.includes("love"))
      return "happy";
    if (lower.includes("sad") || lower.includes("miss"))
      return "sad";
    if (lower.includes("wow") || lower.includes("?!"))
      return "surprised";
    if (lower.includes("lol") || lower.includes("hehe"))
      return "playful";
    if (lower.includes("angry"))
      return "angry";
    return "happy";
  }, []);

  const simulateReply = useCallback(() => {
    const replies = personalityReplies[personality];
    const reply =
      replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      const replyMsg = {
        id: `m${Date.now() + 1}`,
        senderId: otherUserId,
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        emotion: reply.emotion,
      };

      setMessages((prev) => [...prev, replyMsg]);
      setOtherEmotion(reply.emotion);
    }, 1500);
  }, [personality, otherUserId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const emotion = detectEmotion(input);

    const newMsg = {
      id: `m${Date.now()}`,
      senderId: "me",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      emotion,
    };

    setMessages((prev) => [...prev, newMsg]);
    setMyEmotion(emotion);
    setInput("");
    simulateReply();
  };

  const sendSticker = (emoji) => {
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: "me",
      text: emoji,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "sticker",
      emotion: "playful",
    };

    setMessages((prev) => [...prev, newMsg]);
    setMyEmotion("playful");
    setShowStickers(false);
    simulateReply();
  };

  const toggleRecording = () => {
    if (isRecording) {
      const newMsg = {
        id: `m${Date.now()}`,
        senderId: "me",
        text: "🎤 Voice message",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "voice",
        emotion: "neutral",
      };

      setMessages((prev) => [...prev, newMsg]);
      simulateReply();
    }

    setIsRecording(!isRecording);
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <p>Chat not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative z-10">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel px-3 py-3 flex items-center gap-3 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
          className="p-1 text-foreground md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <AnimeAvatar
          src={otherUser?.avatar || currentUser.avatar}
          name={displayName || ""}
          status={otherUser?.status || "online"}
          emotion={otherEmotion}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-heading font-bold text-foreground truncate">
            {displayName}
          </h2>
          <p className="text-[10px] text-muted-foreground">
            {otherUser?.status === "online"
              ? "Online"
              : `Last seen ${otherUser?.lastSeen || "recently"}`}
          </p>
        </div>

        <div className="flex gap-1 items-center">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowPersonality(!showPersonality)}
              className="p-2 text-foreground rounded-full"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>

            <PersonalityPicker
              current={personality}
              onChange={setPersonality}
              open={showPersonality}
              onClose={() => setShowPersonality(false)}
            />
          </div>

          <motion.button whileHover={{ scale: 1.1 }} className="p-2 text-foreground rounded-full">
            <Phone className="w-4 h-4" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} className="p-2 text-foreground rounded-full">
            <Video className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 z-10 relative">
        <ChatMascot emotion={otherEmotion} />
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} isMine={msg.senderId === "me"} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel px-3 py-3 z-10 relative"
      >
        <StickerPanel
          open={showStickers}
          onClose={() => setShowStickers(false)}
          onSelect={sendSticker}
        />

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowStickers(!showStickers)}
            className="p-2 text-muted-foreground"
          >
            <Smile className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 relative">
            {isRecording ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-destructive/10">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm text-destructive">
                  Recording...
                </span>
              </div>
            ) : (
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-2.5 rounded-full bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            )}
          </div>

          {input.trim() ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              className="p-2.5 rounded-full anime-gradient text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleRecording}
              className={`p-2.5 rounded-full ${
                isRecording ? "bg-destructive" : "anime-gradient"
              } text-primary-foreground`}
            >
              <Mic className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatView;