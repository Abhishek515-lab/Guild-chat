import { useSocket } from "../contexts/SocketContext";
import { useEffect } from "react";
import { toast } from "sonner";
const useListenRequests = () => {
    const { socket } = useSocket();

    useEffect(() => {
        socket?.on("newFriendRequest", (data) => {
            // Sonner Notification: Ye bottom-right ya top-right mein mast pop hoga
            toast("New Friend Request! ✨", {
                description: `${data.senderName} wants to be your Nakama!`,
                action: {
                    label: "View",
                    onClick: () => console.log("Redirect to Friends Tab"),
                },
            });
        });

        return () => socket?.off("newFriendRequest");
    }, [socket]);
};
export default useListenRequests;