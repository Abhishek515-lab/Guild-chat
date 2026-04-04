import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. Pending Requests Fetch Karne Ka Function (REQUIRED FOR NOTIFICATIONS) ---
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      const res = await axios.get("http://localhost:5000/api/users/requests/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests(res.data); // Backend se aayi list yahan set hogi
    } catch (error) {
      console.error("Fetch Pending Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Send Request ---
  const sendRequest = async (targetId) => {
    try {
      // 🚨 Debugging ke liye console log lagao
      console.log("Accepting request for ID:", targetId);
      
      const response = await axios.post(
        "http://localhost:5000/api/users/request/accept", 
        { targetId },
        getConfig()
      );

      // ✅ List se hatao
      setPendingRequests(prev => prev.filter(req => (req._id || req) !== targetId));

      // ✅ LocalStorage update (varna refresh pe wapas aa jayega)
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (response.data.user) {
         localStorage.setItem("userInfo", JSON.stringify({
            ...userInfo,
            friends: response.data.user.friends,
            pendingRequests: response.data.user.pendingRequests
         }));
      }

      toast.success("Friend request accepted! 🌸");
      return response.data;

    } catch (err) {
      // 🚨 Exact error dekhne ke liye:
      const message = err.response?.data?.message || "Failed to accept request";
      console.error("FULL ERROR:", err.response); // Browser console check karo yahan
      toast.error(message);
    }
  };

  // --- 3. Accept Request ---
 const acceptRequest = async (targetId) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    const response = await axios.post(
      "http://localhost:5000/api/users/request/accept", 
      { targetId },
      { headers: { Authorization: `Bearer ${userInfo?.token}` } }
    );

    // 🔥 SABSE ZAROORI: LocalStorage ko naye data se replace karo
    // Backend se aane wala 'response.data.user' fresh hona chahiye
    if (response.data.user) {
      const updatedInfo = { 
        ...userInfo, 
        friends: response.data.user.friends, 
        pendingRequests: response.data.user.pendingRequests 
      };
      
      localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
      
      // State update karo taaki screen turant badle
      setPendingRequests(response.data.user.pendingRequests);
      setFriends(response.data.user.friends);
    }

    toast.success("Dost ban gaya! 🎉");
    
    // Agar state sync nahi ho rahi, toh force refresh kar do (Temporary Fix)
    // window.location.reload(); 

  } catch (err) {
    console.error("Accept Error:", err.response?.data);
    toast.error(err.response?.data?.message || "Failed to accept");
  }
};
  return (
    <FriendContext.Provider value={{ 
      friends, 
      pendingRequests, 
      setPendingRequests, // Notification update ke liye zaroori hai
      fetchPendingRequests, 
      sendRequest, 
      acceptRequest, 
      loading 
    }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => useContext(FriendContext);