import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user: authUser } = useAuth(); 
    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    useEffect(() => {
        if (authUser) {
            console.log(" Attempting Socket connection for:", authUser.username);

            const newSocket = io(socketUrl, {
                query: { userId: authUser._id },
                reconnection: true, // Auto-reconnect on fail
            });

            // Log: Jab connect ho jaye
            newSocket.on("connect", () => {
                console.log(" SOCKET CONNECTED! ID:", newSocket.id);
            });

            //  Log: Agar connection fail ho
            newSocket.on("connect_error", (error) => {
                console.error("SOCKET ERROR:", error.message);
            });

            //  Log: Online users list update
            newSocket.on("getOnlineUsers", (users) => {
                console.log("Online Users List:", users);
                setOnlineUsers(users);
            });

            //  Log: Disconnect logic
            newSocket.on("disconnect", (reason) => {
                console.warn("Socket disconnected:", reason);
            });

            setSocket(newSocket);

            return () => {
                console.log(" Cleaning up socket connection...");
                newSocket.close();
            };
        } else {
            console.log(" No authUser found, skipping socket.");
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);