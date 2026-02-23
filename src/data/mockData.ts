import avatarSakura from "@/assets/avatar-sakura.png";
import avatarKai from "@/assets/avatar-kai.png";
import avatarLuna from "@/assets/avatar-luna.png";
import avatarHaru from "@/assets/avatar-haru.png";
import avatarYuki from "@/assets/avatar-yuki.png";

export type AvatarEmotion = "neutral" | "happy" | "sad" | "surprised" | "playful" | "angry" | "sleeping";
export type UserStatus = "online" | "offline" | "typing";
export type ThemeName = "sakura" | "neon" | "rainy" | "light" | "hacker" | "game" | "futuristic";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  emotion: AvatarEmotion;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: "text" | "image" | "voice" | "gif" | "sticker";
  mediaUrl?: string;
  emotion?: AvatarEmotion;
}

export interface Chat {
  id: string;
  participants: string[];
  name?: string;
  isGroup: boolean;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
}

export const currentUser: User = {
  id: "me",
  name: "You (Sakura)",
  avatar: avatarSakura,
  status: "online",
  emotion: "neutral",
};

export const users: Record<string, User> = {
  me: currentUser,
  kai: {
    id: "kai",
    name: "Kai",
    avatar: avatarKai,
    status: "online",
    emotion: "neutral",
  },
  luna: {
    id: "luna",
    name: "Luna",
    avatar: avatarLuna,
    status: "offline",
    emotion: "sleeping",
    lastSeen: "2 hours ago",
  },
  haru: {
    id: "haru",
    name: "Haru",
    avatar: avatarHaru,
    status: "online",
    emotion: "happy",
  },
  yuki: {
    id: "yuki",
    name: "Yuki",
    avatar: avatarYuki,
    status: "offline",
    emotion: "sleeping",
    lastSeen: "30 min ago",
  },
};

export const chats: Chat[] = [
  {
    id: "chat-kai",
    participants: ["me", "kai"],
    isGroup: false,
    unreadCount: 3,
    messages: [
      { id: "m1", senderId: "kai", text: "Hey Sakura! Did you see the new anime?", timestamp: "10:30 AM", type: "text", emotion: "happy" },
      { id: "m2", senderId: "me", text: "Yes!! It was so good! 🌸", timestamp: "10:32 AM", type: "text", emotion: "happy" },
      { id: "m3", senderId: "kai", text: "The fight scene in episode 5 was insane!", timestamp: "10:33 AM", type: "text", emotion: "surprised" },
      { id: "m4", senderId: "me", text: "I know right?! I literally screamed", timestamp: "10:34 AM", type: "text", emotion: "surprised" },
      { id: "m5", senderId: "kai", text: "Haha same! Want to watch ep 6 together tonight?", timestamp: "10:35 AM", type: "text", emotion: "playful" },
      { id: "m6", senderId: "me", text: "Absolutely! I'll bring snacks 🍡", timestamp: "10:36 AM", type: "text", emotion: "happy" },
      { id: "m7", senderId: "kai", text: "Perfect! See you at 8 ✨", timestamp: "10:37 AM", type: "text", emotion: "happy" },
    ],
    lastMessage: { id: "m7", senderId: "kai", text: "Perfect! See you at 8 ✨", timestamp: "10:37 AM", type: "text" },
  },
  {
    id: "chat-luna",
    participants: ["me", "luna"],
    isGroup: false,
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "luna", text: "Good night Sakura! 🌙", timestamp: "Yesterday", type: "text", emotion: "neutral" },
      { id: "m2", senderId: "me", text: "Night Luna! Sweet dreams~", timestamp: "Yesterday", type: "text", emotion: "happy" },
    ],
    lastMessage: { id: "m2", senderId: "me", text: "Night Luna! Sweet dreams~", timestamp: "Yesterday", type: "text" },
  },
  {
    id: "chat-group",
    participants: ["me", "kai", "luna", "haru", "yuki"],
    name: "Anime Squad 🎌",
    isGroup: true,
    unreadCount: 12,
    messages: [
      { id: "m1", senderId: "haru", text: "Who's coming to the convention next week?", timestamp: "9:00 AM", type: "text", emotion: "happy" },
      { id: "m2", senderId: "yuki", text: "I'm in! Already got my cosplay ready 🔥", timestamp: "9:05 AM", type: "text", emotion: "playful" },
      { id: "m3", senderId: "kai", text: "Same! Going as my favorite character", timestamp: "9:10 AM", type: "text", emotion: "happy" },
      { id: "m4", senderId: "me", text: "Count me in too!", timestamp: "9:15 AM", type: "text", emotion: "happy" },
    ],
    lastMessage: { id: "m4", senderId: "me", text: "Count me in too!", timestamp: "9:15 AM", type: "text" },
  },
  {
    id: "chat-naruto",
    participants: ["me", "kai", "haru"],
    name: "Naruto Fans 🍥",
    isGroup: true,
    unreadCount: 5,
    messages: [
      { id: "m1", senderId: "kai", text: "Believe it! New episode dropped 🔥", timestamp: "8:00 AM", type: "text", emotion: "happy" },
    ],
    lastMessage: { id: "m1", senderId: "kai", text: "Believe it! New episode dropped 🔥", timestamp: "8:00 AM", type: "text" },
  },
  {
    id: "chat-romance",
    participants: ["me", "luna", "yuki"],
    name: "Romance RP 💕",
    isGroup: true,
    unreadCount: 8,
    messages: [
      { id: "m1", senderId: "luna", text: "Okay who's starting the new arc? 🥺", timestamp: "Yesterday", type: "text", emotion: "happy" },
    ],
    lastMessage: { id: "m1", senderId: "luna", text: "Okay who's starting the new arc? 🥺", timestamp: "Yesterday", type: "text" },
  },
  {
    id: "chat-slice",
    participants: ["me", "haru", "yuki", "kai"],
    name: "Slice of Life ☕",
    isGroup: true,
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "yuki", text: "Just finished Violet Evergarden... I'm crying 😭", timestamp: "3:00 PM", type: "text", emotion: "sad" },
    ],
    lastMessage: { id: "m1", senderId: "yuki", text: "Just finished Violet Evergarden... I'm crying 😭", timestamp: "3:00 PM", type: "text" },
  },
  {
    id: "chat-haru",
    participants: ["me", "haru"],
    isGroup: false,
    unreadCount: 1,
    messages: [
      { id: "m1", senderId: "haru", text: "Check out this cool wallpaper I found!", timestamp: "11:00 AM", type: "text", emotion: "happy" },
    ],
    lastMessage: { id: "m1", senderId: "haru", text: "Check out this cool wallpaper I found!", timestamp: "11:00 AM", type: "text" },
  },
];
