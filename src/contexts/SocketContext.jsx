import { createContext, useState, useEffect, useContext, useMemo } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

// 💡 OPTIMIZATION: URL ko component ke baahar rakha taaki 
// re-renders par ye kabhi bhi change na ho aur memory clean rahe.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user: authUser } = useAuth(); 

    // Pure reference identification: Sirf ID change hone par hi socket rebuild hoga, 
    // agar user bio, status ya avatar badalta hai toh connection reload nahi hoga.
    const authUserId = authUser?._id;

    useEffect(() => {
        if (!authUserId) {
            console.log("No authUser found, skipping/cleaning socket.");
            setSocket((prevSocket) => {
                if (prevSocket) prevSocket.close();
                return null;
            });
            setOnlineUsers([]);
            return;
        }

        console.log("Attempting Socket connection for ID:", authUserId);

        const newSocket = io(SOCKET_URL, {
            query: { userId: authUserId },
            reconnection: true,
            reconnectionAttempts: 5, // Unlimited retry loops se bachata hai
            reconnectionDelay: 2000,
        });

        newSocket.on("connect", () => {
            console.log("SOCKET CONNECTED! ID:", newSocket.id);
        });

        newSocket.on("connect_error", (error) => {
            console.error("SOCKET ERROR:", error.message);
        });

        newSocket.on("getOnlineUsers", (users) => {
            console.log("Online Users List:", users);
            setOnlineUsers(users);
        });

        newSocket.on("disconnect", (reason) => {
            console.warn("Socket disconnected:", reason);
        });

        setSocket(newSocket);

        // 💡 CRITICAL CLEANUP: Sockets ko unmount par band karne ke sath-sath 
        // listeners ko strictly .off() karna zaroori hai memory management ke liye.
        return () => {
            console.log("Cleaning up socket listeners and connection...");
            newSocket.off("connect");
            newSocket.off("connect_error");
            newSocket.off("getOnlineUsers");
            newSocket.off("disconnect");
            newSocket.close();
        };
    }, [authUserId]); // Fixed: Ab sirf actual User ID badalne par hi connection refresh hoga

    // Context Value Memoization
    const contextValue = useMemo(() => ({
        socket,
        onlineUsers
    }), [socket, onlineUsers]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context;
};