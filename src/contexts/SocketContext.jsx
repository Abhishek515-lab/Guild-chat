import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext"; // Aapka login wala context

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuth(); // Maan lo aapka user data yahan hai

    useEffect(() => {
        if (authUser) {
            // Backend URL aur User ID bhejna handshake mein
            const newSocket = io("http://localhost:5000", {
                query: { userId: authUser._id },
            });

            setSocket(newSocket);

            // Online users ki list sunna
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => newSocket.close();
        } else {
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