import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Check, X, Loader2, MessageSquare, User } from "lucide-react";
import AnimeAvatar from "./AnimeAvatar";
import { toast } from "sonner";
import api from "../Api/axios"; // 👈 'api' instance use karein
import { useFriends } from "../contexts/FriendContext";
import { useNavigate } from "react-router-dom";

const FriendSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sendRequest, pendingRequests, friends } = useFriends();

  const savedUser = localStorage.getItem("userInfo");
  const userInfo = savedUser ? JSON.parse(savedUser) : null;
  const currentUserId = userInfo?._id || userInfo?.id;
  
  const navigate = useNavigate();

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/users/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err.response?.data || err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleAddFriend = async (userId, userName) => {
    try {
      await sendRequest(userId);
      // Agar userName undefined hua toh 'Nakama' dikhayega
      toast.success(`Request sent to ${userName || "Nakama"}! 🌸`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="flex flex-col h-full px-3 pt-3 overflow-hidden">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your nakama..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all border border-transparent focus:border-primary/20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          {query && !loading && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <AnimatePresence mode="popLayout">
          {query.trim() && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
              <p className="text-[10px] text-muted-foreground font-heading font-bold uppercase tracking-wider px-2 mb-2">
                Search Results {results.length > 0 ? `(${results.length})` : ""}
              </p>

              {results.length > 0 ? (
                results.map((user) => {
                  const isMe = user._id === currentUserId;
                  const isFriend = friends?.some(f => f._id === user._id || f.id === user._id);
                  const isPending = pendingRequests?.some(r => r._id === user._id || r.id === user._id);

                  return (
                    <motion.div
                      key={user._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors mb-1"
                    >
                      <AnimeAvatar src={user.avatar} name={user.username} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-heading font-bold text-foreground truncate">
                          {user.username} {isMe && <span className="ml-1 text-[9px] text-primary">(You)</span>}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {isMe ? "Owner of this world" : isFriend ? "Already Friends" : isPending ? "Request Sent" : "New Discovery"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isMe ? (
                          <div className="p-2 text-muted-foreground/30"><User className="w-4 h-4" /></div>
                        ) : isFriend ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/chat/${user._id}`)}
                            className="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }}
                            // 👈 FIX: Dono userId aur userName pass kiya yahan
                            onClick={() => !isPending && handleAddFriend(user._id, user.username)}
                            disabled={isPending}
                            className={`p-2 rounded-full transition-all shadow-sm ${isPending ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground"}`}
                          >
                            {isPending ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : !loading && (
                <p className="text-xs text-center text-muted-foreground py-4">No users found 🌸</p>
              )}
            </motion.div>
          )}

          {!query.trim() && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-[10px] text-muted-foreground font-heading font-bold uppercase tracking-wider px-2 mb-2">
                My Friends ({friends?.length || 0})
              </p>
              {friends?.length > 0 ? (
                friends.map((friend, index) => (
                  <div key={`${friend._id || friend.id}-${index}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/20 transition-all group">
                    <AnimeAvatar src={friend.avatar} name={friend.name || friend.username} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-heading font-bold">{friend.name || friend.username}</p>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[9px] text-muted-foreground uppercase">Online</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/chat/${friend._id || friend.id}`)}
                      className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10 rounded-full"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No friends yet. Start searching! ✨</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FriendSearch;