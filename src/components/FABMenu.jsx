import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Users, Bot, X } from "lucide-react";
import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { useNavigate } from "react-router-dom"; // 1. Navigate import kiya
import { useFriends } from "../contexts/FriendContext";
const FABMenu = () => {
  const [open, setOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate(); // 2. Navigate initialize kiya


  const { fetchAllUsers, allUsers, fetchMessages, setSelectedUser } = useChat();
  const { friends, fetchFriends, loading: friendsLoading } = useFriends();
  const handleNewChatClick = async () => {
    setOpen(false);
    await fetchAllUsers();
    setShowUserModal(true);
  };

  const items = [
    { icon: MessageCircle, label: "New Chat", color: "from-pink-400 to-purple-500", onClick: handleNewChatClick },
    { icon: Users, label: "New Group", color: "from-blue-400 to-cyan-500" },
    { icon: Bot, label: "AI Character", color: "from-purple-400 to-indigo-500" },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-20 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open &&
            items.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={item.onClick}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 group"
              >
                <span className="px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-md text-xs font-bold shadow-sm">
                  {item.label}
                </span>
                <div className={`w-11 h-11 rounded-full anime-gradient ${item.color} shadow-lg flex items-center justify-center text-white`}>
                  <item.icon className="w-5 h-5" />
                </div>
              </motion.button>
            ))}
        </AnimatePresence>

        <button
          onClick={() => setOpen(!open)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 ${open ? 'bg-red-400 rotate-45' : 'bg-pink-500'}`}
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b flex justify-between items-center bg-pink-50">
                <h3 className="font-bold text-pink-600">Start New Chat</h3>
                <button onClick={() => setShowUserModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
              </div>

             <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
        
                {friends && friends.length > 0 ? (
                  friends.map((friend) => (
                    <div
                      key={friend._id || friend.id}
                      onClick={() => {
                        
                        const chatUser = {
                          _id: friend._id || friend.id,
                          username: friend.username || friend.name,
                          profilePic: friend.profilePic || friend.avatar
                        };

                        setSelectedUser(chatUser); 
                        fetchMessages(chatUser._id);
                        navigate(`/chat/${chatUser._id}`);
                        setShowUserModal(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl cursor-pointer transition-all active:scale-95"
                    >
              
                      <img 
                        src={friend.profilePic || friend.avatar || "/avatar.png"} 
                        alt="" 
                        className="w-11 h-11 rounded-full border-2 border-pink-200 object-cover" 
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{friend.username || friend.name}</p>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Your Nakama</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">No friends found. 🌸</p>
                    <p className="text-[10px] mt-2">Find your guild members in the Friends tab first!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FABMenu;