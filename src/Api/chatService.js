import api from "./axios";

/**
 * Optimized Chat Service
 * Yahan humne headers ko axios interceptors ke liye chhod diya hai ya 
 * ek hi baar function mein define kiya hai.
 */

const getAuthHeader = () => {
  const savedData = localStorage.getItem("userInfo");
  if (!savedData) return {};
  const { token } = JSON.parse(savedData);
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const chatService = {
  // 1. Sidebar ke liye: Sirf un logo ki list jinse chat ho chuki hai
  getConversations: async () => {
    const { data } = await api.get("/chat/conversations", getAuthHeader());
    return data;
  },

  // 2. NEW CHAT ke liye: Saare users ki list backend se fetch karna
  getAllUsers: async () => {
    const { data } = await api.get("/chat/all-users", getAuthHeader());
    return data;
  },

  // 3. Chat history mangwane ke liye
  getMessages: async (userId) => {
    const { data } = await api.get(`/chat/${userId}`, getAuthHeader());
    return data;
  },

  // 4. Naya message bhejne ke liye
  sendMessage: async (userId, messageData) => {
    // messageData: { text, type, emotion }
    const { data } = await api.post(`/chat/send/${userId}`, messageData, getAuthHeader());
    return data;
  },

  // 5. Messages ko 'Read' mark karne ke liye
  markAsRead: async (userId) => {
    const { data } = await api.post(`/chat/read/${userId}`, {}, getAuthHeader());
    return data;
  }
};