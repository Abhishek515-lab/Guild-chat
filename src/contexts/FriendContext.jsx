import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/axios"; 
import { toast } from "sonner";

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    try {
      const res = await api.get("/users/friends");
      setFriends(res.data);
    } catch (error) {
      console.error("Fetch Friends Error:", error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/requests/pending");
      setPendingRequests(res.data);
    } catch (error) {
      console.error("Fetch Pending Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (targetId) => {
    try {
      const res = await api.post("/users/request/send", { targetId });
      toast.success("Request sent! 🌸");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  const acceptRequest = async (targetId) => {
    try {
      await api.post("/users/request/accept", { targetId });
      
      setPendingRequests((prev) => 
        prev.filter((req) => (req._id || req) !== targetId)
      );
      
      await fetchFriends();
      toast.success("Dost ban gaya! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept");
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, []);

  return (
    <FriendContext.Provider 
      value={{ 
        friends, 
        pendingRequests, 
        fetchFriends, 
        fetchPendingRequests, 
        sendRequest, 
        acceptRequest, 
        loading 
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => useContext(FriendContext);