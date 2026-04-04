import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Users, Bot, X } from "lucide-react";
import { useState } from "react";

const FABMenu = () => {
  const [open, setOpen] = useState(false);

  const items = [
    { icon: MessageCircle, label: "New Chat", color: "from-primary to-accent" },
    { icon: Users, label: "New Group", color: "from-accent to-secondary" },
    { icon: Bot, label: "AI Character", color: "from-secondary to-primary" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-20 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          items.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <span className="px-3 py-1.5 rounded-lg glass-panel text-xs font-heading font-bold text-foreground shadow-md">
                {item.label}
              </span>
              <div className={`w-11 h-11 rounded-full ${item.color} shadow-lg flex items-center justify-center text-primary-foreground`}>
                <item.icon className="w-5 h-5" />
              </div>
            </motion.button>
          ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 135 : 0 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full anime-gradient shadow-lg flex items-center justify-center text-primary-foreground"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default FABMenu;
