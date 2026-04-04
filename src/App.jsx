import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import ParticleBackground from "./components/ParticleBackground";
import AppLayout from "./layouts/AppLayout";

import ChatView from "./pages/ChatView";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";
import { FriendProvider } from "./contexts/FriendContext";
import {SocketContextProvider} from "./contexts/SocketContext"
import notifications from "./pages/Notifications";
import Verify from "./pages/Verify"
import Notifications from "./pages/Notifications";
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("userInfo");

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketContextProvider>
       <FriendProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ParticleBackground />

            <BrowserRouter>
              <Routes>
                {/* Auth Route */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/verify/:token" element={<Verify />} />

                {/* Protected Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<ChatView />} />
                  <Route path="/chat/:chatId" element={<ChatView />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/notifications" element={<Notifications/>}/>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
        </FriendProvider>
        </SocketContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;