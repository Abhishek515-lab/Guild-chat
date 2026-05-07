import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { chatService } from "../Api/chatService";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { Users } from "lucide-react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const sendSound = useMemo(() => new Audio("/sounds/send.mp3"), []);
  const receiveSound = useMemo(() => new Audio("/sounds/main.mp3"), []);

  //  Sound Function
  const playNotificationSound = useCallback((type) => {
    try {
      if (type === "send") {
        sendSound.currentTime = 0;
        sendSound.play().catch(e => console.log("Audio play error:", e));
      } else {
        receiveSound.currentTime = 0;
        receiveSound.play().catch(e => console.log("Audio play error:", e));
      }
    } catch (err) {
      console.error("Sound play failed:", err);
    }
  }, [sendSound, receiveSound]);

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

  // fatch Users
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

  // fatch msg
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

  // msg send
  const sendNewMessage = async (userId, messageData) => {
    try {
      const data = await chatService.sendMessage(userId, messageData);

      playNotificationSound("send");

      setMessages((prev) => {
      
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

//  masg headling
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const isFromMe = newMessage.senderId === currentUser?._id;


      setMessages((prev) => [...prev, newMessage]);


      setConversations((prevConv) => {
        return prevConv.map((conv) => {
    
          const isTargetConv = conv._id === newMessage.senderId || conv._id === newMessage.receiverId;

          if (isTargetConv) {
       
            const isChatOpen = selectedUserRef.current?._id === newMessage.senderId;
            const shouldIncrement = !isFromMe && !isChatOpen;

            return {
              ...conv,
              lastMessage: newMessage.message,
          
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