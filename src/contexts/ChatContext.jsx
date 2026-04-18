import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { chatService } from "../Api/chatService";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  // Audio Setup: Inhe useMemo mein dala hai taaki performance badiya rahe
  const sendSound = useMemo(() => new Audio("/sounds/send.mp3"), []);
  const receiveSound = useMemo(() => new Audio("/sounds/main.mp3"), []);

  //  Sound Function
  const playNotificationSound = useCallback((type) => {
    try {
      if (type === "send") {
        sendSound.currentTime = 0; // Taaki click karte hi turant baje
        sendSound.play().catch(e => console.log("Audio play error:", e));
      } else {
        receiveSound.currentTime = 0;
        receiveSound.play().catch(e => console.log("Audio play error:", e));
      }
    } catch (err) {
      console.error("Sound play failed:", err);
    }
  }, [sendSound, receiveSound]);
  //  1. Ref ka use karenge stale closure se bachne ke liye
  const selectedUserRef = useRef(null);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Conversations fetch error:", error);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chatService.getAllUsers();
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await chatService.getMessages(userId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendNewMessage = async (userId, messageData) => {
    try {
      const data = await chatService.sendMessage(userId, messageData);

      playNotificationSound("send");

      setMessages((prev) => {
        //  Check agar message ID pehle se hai (Optimistic update ya socket ki wajah se)
        const exists = prev.some((m) => m._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });

      fetchConversations();
      return data;
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  //  2. YAHI HAI REAL-TIME KA ASLI FIX
  // ChatContext.jsx ke andar ka logic change karo
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const isFromMe = newMessage.senderId === currentUser?._id;

      // 1. Messages list update (Chat window ke liye)
      setMessages((prev) => [...prev, newMessage]);

      // 2. Sidebar update (Notification increment logic)
      setConversations((prevConv) => {
        return prevConv.map((conv) => {
          // Check karo ki ye message isi user se hai ya isi user ke liye hai
          const isTargetConv = conv._id === newMessage.senderId || conv._id === newMessage.receiverId;

          if (isTargetConv) {
            // Condition: Agar chat open NAHI hai AND message doosre ne bheja hai
            const isChatOpen = selectedUserRef.current?._id === newMessage.senderId;
            const shouldIncrement = !isFromMe && !isChatOpen;

            return {
              ...conv,
              lastMessage: newMessage.message,
              // 🔥 Ye line 1 pe 1, 2 pe 2 dikhayegi
              unreadCount: shouldIncrement
                ? (Number(conv.unreadCount) || 0) + 1
                : 0,
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        });
      });

      // Sound play
      if (!isFromMe) playNotificationSound("receive");
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, fetchConversations, currentUser, playNotificationSound]);
  const addIncomingMessage = useCallback((msg) => {
    setMessages((prev) => {
      if (prev.find((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  }, []);
  return (
    <ChatContext.Provider value={{
      messages, conversations, allUsers, loading,
      selectedUser, setSelectedUser, fetchMessages,
      fetchConversations, sendNewMessage, setMessages, fetchAllUsers, addIncomingMessage, setConversations,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);