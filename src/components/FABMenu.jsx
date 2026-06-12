import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Users, Bot, X, Shield, Check, Search, ArrowRight, Camera } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useChat } from "../contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useFriends } from "../contexts/FriendContext";
import { toast } from "sonner";

const FABMenu = () => {
  const [open, setOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGuildModal, setShowGuildModal] = useState(false);
  
  const [step, setStep] = useState(1);
  const [guildSearch, setGuildSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [guildName, setGuildName] = useState("");
  const [guildDesc, setGuildDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const navigate = useNavigate();
  const { setSelectedUser, setConversations, fetchMessages } = useChat();
  const { friends } = useFriends();

  const filteredFriendsForChat = useMemo(() => 
    friends?.filter(f => f.username?.toLowerCase().includes(userSearch.toLowerCase())), 
  [friends, userSearch]);

  const filteredFriendsForGuild = useMemo(() => 
    friends?.filter(f => f.username?.toLowerCase().includes(guildSearch.toLowerCase())), 
  [friends, guildSearch]);

  const toggleMember = useCallback((id) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  }, []);

  const resetGuildForm = useCallback(() => {
    setShowGuildModal(false);
    setStep(1);
    setGuildName("");
    setGuildDesc("");
    setSelectedMembers([]);
  }, []);

  const handleCreateGuild = useCallback(() => {
    if (!guildName.trim()) return toast.error("Guild Name is required!");
    
    const newGuild = {
      _id: Date.now().toString(),
      name: guildName,
      username: guildName,
      description: guildDesc,
      members: selectedMembers,
      isGroup: true,
      updatedAt: new Date().toISOString(),
      lastMessage: "Guild formed! ⚔️"
    };

    if (setConversations) {
      setConversations(prev => [newGuild, ...prev]);
    }
    
    toast.success(`${guildName} formed!`);
    resetGuildForm();
  }, [guildName, guildDesc, selectedMembers, setConversations, resetGuildForm]);

  const handleStartChat = useCallback((friend) => {
    if (setSelectedUser) setSelectedUser(friend);
    if (fetchMessages) fetchMessages(friend._id);
    navigate(`/chat/${friend._id}`);
    setShowUserModal(false);
  }, [setSelectedUser, fetchMessages, navigate]);

  const toggleFabMenu = useCallback(() => setOpen(prev => !prev), []);
  const openUserModal = useCallback(() => { setOpen(false); setShowUserModal(true); }, []);
  const openGuildModal = useCallback(() => { setOpen(false); setShowGuildModal(true); }, []);
  const closeUserModal = useCallback(() => setShowUserModal(false), []);
  const setStepOne = useCallback(() => setStep(1), []);
  const setStepTwo = useCallback(() => setStep(2), []);

  const items = useMemo(() => [
    { icon: MessageCircle, label: "New Chat", className: "anime-gradient", onClick: openUserModal },
    { icon: Users, label: "New Guild", className: "bg-primary", onClick: openGuildModal },
    { icon: Bot, label: "AI Bot", className: "bg-secondary", onClick: () => {} },
  ], [openUserModal, openGuildModal]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && items.map((item, i) => (
            <motion.button key={item.label} onClick={item.onClick}
              initial={{ opacity: 0, scale: 0, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ delay: i * 0.05 }} className="flex items-center gap-2 group"
            >
              <span className="px-3 py-1.5 anime-gradient rounded-lg glass-panel text-[10px] font-bold shadow-sm text-foreground border border-white/10 uppercase tracking-widest">
                {item.label}
              </span>
              <div className={`w-11 h-11 rounded-full shadow-lg anime-gradient flex items-center justify-center text-white ${item.className || 'bg-primary'}`}>
                <item.icon className="w-5 h-5" />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
        <button onClick={toggleFabMenu} className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white anime-gradient transition-all duration-300 ${open ? 'bg-destructive rotate-45' : 'bg-primary shadow-primary/20'}`}>
          <Plus className="w-7 h-7" />
        </button>
      </div>

      <AnimatePresence>
        {(showUserModal || showGuildModal) && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-md bg-black/10">
            {showUserModal && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="glass-panel w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 bg-background/60"
              >
                <div className="p-4 border-b border-white/10 flex anime-gradient justify-between items-center">
                  <h3 className="font-black uppercase tracking-tighter text-primary flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" /> New Chat
                  </h3>
                  <button onClick={closeUserModal} className="hover:rotate-90 transition-transform"><X className="w-5 h-5 opacity-50" /></button>
                </div>
                
                <div className="p-4">
                  <div className="relative flex items-center bg-muted/30 rounded-2xl px-3 border border-white/10 focus-within:border-primary/50 transition-all">
                    <Search className="w-4 h-4 text-primary" />
                    <input type="text" placeholder="Search Nakama..." className="w-full bg-transparent p-3 text-sm outline-none text-foreground" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                  </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto p-2 custom-scrollbar">
                  {filteredFriendsForChat?.map(friend => (
                    <div key={friend._id} onClick={() => handleStartChat(friend)}
                      className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-white/10"
                    >
                      <img src={friend.avatar || "/avatar.png"} className="w-12 h-12 rounded-full border-2 border-primary/20" />
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm tracking-tight">{friend.username}</p>
                        <p className="text-[9px] font-black text-primary uppercase opacity-70">Tap to start</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {showGuildModal && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                className="glass-panel w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 bg-background/60"
              >
                <div className="p-6 anime-gradient text-white flex justify-between items-center shadow-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <h3 className="font-black uppercase tracking-widest">{step === 1 ? "Recruit" : "Register"}</h3>
                  </div>
                  <button onClick={resetGuildForm} className="bg-white/20 rounded-full p-1"><X className="w-4 h-4" /></button>
                </div>

                <div className="p-6">
                  {step === 1 ? (
                    <>
                      <div className="relative flex items-center bg-muted/40 rounded-2xl px-3 mb-4 border border-white/10">
                        <Search className="w-4 h-4 text-primary" />
                        <input type="text" placeholder="Search friends..." className="w-full bg-transparent p-3 text-sm outline-none text-foreground" value={guildSearch} onChange={(e) => setGuildSearch(e.target.value)} />
                      </div>
                      <div className="max-h-[35vh] overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-1">
                        {filteredFriendsForGuild?.map(friend => (
                          <div key={friend._id} onClick={() => toggleMember(friend._id)}
                            className={`flex items-center gap-3 p-4 rounded-[1.5rem] cursor-pointer transition-all border-2 ${selectedMembers.includes(friend._id) ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'border-transparent bg-muted/20 hover:bg-muted/40'}`}
                          >
                            <img src={friend.avatar || "/avatar.png"} className="w-10 h-10 rounded-full shadow-sm" />
                            <span className="flex-1 font-bold text-sm text-foreground">{friend.username}</span>
                            {selectedMembers.includes(friend._id) && <Check className="w-5 h-5 text-primary" />}
                          </div>
                        ))}
                      </div>
                      <button disabled={selectedMembers.length === 0} onClick={setStepTwo}
                        className="w-full py-4 rounded-2xl anime-gradient text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 shadow-xl"
                      >
                        Proceed <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center group">
                         <div className="w-24 h-24 bg-muted/30 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-primary/30 group-hover:border-primary transition-all cursor-pointer">
                            <Camera className="w-8 h-8 opacity-40 group-hover:opacity-100 text-primary" />
                         </div>
                         <p className="text-[10px] font-black text-primary/50 mt-2 uppercase tracking-[0.3em]">Guild Crest</p>
                      </div>
                      <input type="text" placeholder="Guild Name" className="w-full px-5 py-4 bg-muted/20 rounded-2xl border border-white/10 focus:border-primary outline-none text-foreground font-bold" value={guildName} onChange={(e) => setGuildName(e.target.value)} />
                      <textarea placeholder="Slogan..." className="w-full px-5 py-4 bg-muted/20 rounded-2xl border border-white/10 focus:border-primary outline-none text-foreground font-bold h-24 resize-none" value={guildDesc} onChange={(e) => setGuildDesc(e.target.value)} />
                      <div className="flex gap-3">
                         <button onClick={setStepOne} className="flex-1 py-4 rounded-2xl bg-muted/30 font-bold uppercase text-[10px]">Back</button>
                         <button onClick={handleCreateGuild} className="flex-[2] py-4 rounded-2xl anime-gradient text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20">Form Guild</button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FABMenu;