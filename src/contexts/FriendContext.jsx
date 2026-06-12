import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../Api/axios"; 
import { toast } from "sonner";

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Friends List (Memoized)
  const fetchFriends = useCallback(async () => {
    try {
      const res = await api.get("/users/friends");
      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch Friends Error:", error);
    }
  }, []);

  // 2. Fetch Pending Requests List (Memoized)
  const fetchPendingRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/requests/pending");
      setPendingRequests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch Pending Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Outgoing Friend Request Sender (Memoized)
  const sendRequest = useCallback(async (targetId) => {
    try {
      const res = await api.post("/users/request/send", { targetId });
      toast.success("Request sent! 🌸");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  }, []);

  // 4. Accept Incoming Request Handler (Memoized)
  const acceptRequest = useCallback(async (targetId) => {
    try {
      await api.post("/users/request/accept", { targetId });
      
      // Update local state immediately for fast UX
      setPendingRequests((prev) => 
        prev.filter((req) => (req._id || req) !== targetId)
      );
      
      // Sync fresh friends array
      await fetchFriends();
      toast.success("Dost ban gaya! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept");
    }
  }, [fetchFriends]);

  // Initial Sync Handler on Application Mount
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, [fetchFriends, fetchPendingRequests]);

  // 💡 CRITICAL FIX: Pure values aur functions ko useMemo me lock kiya.
  // notifications.jsx ki socket utility ke liye setPendingRequests ko bhi add kiya hai.
  const contextValue = useMemo(() => ({
    friends,
    pendingRequests,
    loading,
    fetchFriends,
    fetchPendingRequests,
    sendRequest,
    acceptRequest,
    setPendingRequests // Safe sync for Socket triggers
  }), [
    friends,
    pendingRequests,
    loading,
    fetchFriends,
    fetchPendingRequests,
    sendRequest,
    acceptRequest
  ]);

  return (
    <FriendContext.Provider value={contextValue}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error("useFriends must be used within a FriendProvider");
  }
  return context;
};