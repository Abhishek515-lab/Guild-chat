import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ChatSidebar from "../components/ChatSidebar";
import FABMenu from "../components/FABMenu";
import { useIsMobile } from "../hooks/use-mobile";

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="w-20 h-20 rounded-full anime-gradient flex items-center justify-center"
    >
      <MessageCircle className="w-10 h-10 text-primary-foreground" />
    </motion.div>

    <div className="text-center">
      <h2 className="text-lg font-heading font-bold text-foreground">
        Welcome to AnimeChat
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Select a chat to start your anime adventure ✨
      </p>
    </div>
  </div>
);

const AppLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const hasContent = !isRoot;

  // 📱 Mobile Layout
  if (isMobile) {
    if (isRoot) {
      return (
        <div className="h-screen relative z-10">
          <ChatSidebar />
          <FABMenu />
        </div>
      );
    }

    return (
      <div className="h-screen relative z-10">
        <Outlet />
      </div>
    );
  }

  // 💻 Desktop Layout
  return (
    <div className="flex h-screen relative z-10">
      {/* Sidebar */}
      <div className="w-[380px] min-w-[320px] max-w-[420px] border-r border-border glass-panel flex flex-col relative">
        <ChatSidebar />
        <FABMenu />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {hasContent ? <Outlet /> : <EmptyState />}
      </div>
    </div>
  );
};

export default AppLayout;