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

  // Audio system optimized with useMemo
  const sendSound = useMemo(() => new Audio("/sounds/send.mp3"), []);
  const receiveSound = useMemo(() => new Audio("/sounds/main.mp3"), []);

  // Safe sound player helper
  const playNotificationSound = useCallback((type) => {
    try {
      const player = type === "send" ? sendSound : receiveSound;
      player.currentTime = 0;
      player.play().catch(e => console.log("Audio play blocked by browser:", e));
    } catch (err) {
      console.error("Sound play failed:", err);
    }
  }, [sendSound, receiveSound]);

  // Keep references updated without re-triggering hooks
  const selectedUserRef = useRef(null);
  const currentUserRef = useRef(null);

  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // Fetch Conversations
  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Conversations fetch error:", error);
    }
  }, []);

  // Fetch All Guild Users
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

  // Fetch Chat History
  const fetchMessages = useCallback(async (userId) => {
    if (!userId) return;
    setMessages([]); 
    setLoading(true);
    try {
      const data = await chatService.getMessages(userId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Outgoing message sender
  const sendNewMessage = useCallback(async (userId, messageData) => {
    try {
      const data = await chatService.sendMessage(userId, messageData);
      playNotificationSound("send");

      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });

      // Update sidebar state instantly for UX
      setConversations((prevConv) => {
        const exists = prevConv.some(c => c._id === userId);
        if (!exists) {
          fetchConversations(); // Reload sidebar if it's a completely new chat
          return prevConv;
        }
        return prevConv.map((conv) => 
          conv._id === userId 
            ? { ...conv, lastMessage: data.text || data.message, updatedAt: new Date().toISOString() }
            : conv
        );
      });

      return data;
    } catch (error) {
      console.error("Send error:", error);
    }
  }, [playNotificationSound, fetchConversations]);

  // Helper helper to avoid duplicated logs
  const addIncomingMessage = useCallback((msg) => {
    setMessages((prev) => {
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  }, []);

  // Real-time Socket Incoming Message Manager
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentAuthUser = currentUserRef.current;
      const activeChatUser = selectedUserRef.current;

      const isFromMe = newMessage.senderId === currentAuthUser?._id;
      const isChatWithThisUser = newMessage.senderId === activeChatUser?._id || newMessage.receiverId === activeChatUser?._id;

      // 1. Agar active chat open hai tabhi messages screen me append honge
      if (isChatWithThisUser) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }

      // 2. Dynamic Conversations/Sidebar lists updates
      setConversations((prevConv) => {
        const targetUserId = isFromMe ? newMessage.receiverId : newMessage.senderId;
        const exists = prevConv.some(conv => conv._id === targetUserId);

        if (!exists) {
          // Dynamic load if new message from an unknown person
          chatService.getConversations().then(data => setConversations(data));
          return prevConv;
        }

        return prevConv.map((conv) => {
          if (conv._id === targetUserId) {
            const isChatOpen = activeChatUser?._id === newMessage.senderId;
            const shouldIncrement = !isFromMe && !isChatOpen;

            return {
              ...conv,
              lastMessage: newMessage.text || newMessage.message,
              unreadCount: shouldIncrement ? (Number(conv.unreadCount) || 0) + 1 : 0,
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        });
      });

      // Sound alerts triggering
      if (!isFromMe) {
        playNotificationSound("receive");
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, playNotificationSound]);

  // Pure global optimization wrapper
  const contextValue = useMemo(() => ({
    messages, conversations, allUsers, loading, selectedUser,
    setSelectedUser, fetchMessages, fetchConversations, sendNewMessage,
    setMessages, fetchAllUsers, addIncomingMessage, setConversations
  }), [
    messages, conversations, allUsers, loading, selectedUser,
    fetchMessages, fetchConversations, sendNewMessage, fetchAllUsers, addIncomingMessage
  ]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);