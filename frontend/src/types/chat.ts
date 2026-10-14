export interface ChatUser {
  _id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  isOptimistic?: boolean;
}

export interface SendMessageData {
  text?: string;
  image?: string;
}

export type ChatTab = "chats" | "contacts";
