import { create } from "zustand";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { GetAllContactsAPI, GetMyChatPartnersAPI } from "../api/API.js";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

import type {
  ChatMessage,
  ChatTab,
  ChatUser,
  SendMessageData,
} from "../types/chat.js";

const notificationSound = new Audio("/sounds/notification.mp3");

interface ChatState {
  allContacts: ChatUser[];
  chats: ChatUser[];
  messages: ChatMessage[];
  activeTab: ChatTab;
  selectedUser: ChatUser | null;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;

  toggleSound: () => void;
  setActiveTab: (tab: ChatTab) => void;
  setSelectecUser: (user: ChatUser | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessageData) => Promise<void>;
  subscribeToMessage: () => void;
  unsubscribeFromMessages: () => void;
}

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<{ message?: string; messages?: string }>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.messages ??
      "Something went wrong"
    );
  }
  return "Something went wrong";
};

export const useChatStore = create<ChatState>()((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled:
    JSON.parse(localStorage.getItem("isSoundEnabled") ?? "false") === true,

  toggleSound: () => {
    const enabled = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(enabled));
    set({ isSoundEnabled: enabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectecUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const contacts = await GetAllContactsAPI();
      set({ allContacts: contacts });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUserLoading: true });
    try {
      const chats = await GetMyChatPartnersAPI();
      set({ chats });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<ChatMessage[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: unknown) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) {
      toast.error("Select a chat before sending a message");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post<ChatMessage>(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );

      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === tempId ? res.data : message,
        ),
      }));
    } catch (error: unknown) {
      set((state) => ({
        messages: state.messages.filter((message) => message._id !== tempId),
      }));
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  },

  subscribeToMessage: () => {
    const { selectedUser, isSoundEnabled } = get();
    const socket = useAuthStore.getState().socket;
    const currentUserId = useAuthStore.getState().authUser?._id;

    if (!selectedUser || !socket || !currentUserId) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage: ChatMessage) => {
      const activeUser = get().selectedUser;
      if (!activeUser) return;

      const belongsToCurrentChat =
        (newMessage.senderId === currentUserId &&
          newMessage.receiverId === activeUser._id) ||
        (newMessage.senderId === activeUser._id &&
          newMessage.receiverId === currentUserId);

      if (!belongsToCurrentChat) return;

      const currentMessages = get().messages;
      if (currentMessages.some((message) => message._id === newMessage._id)) {
        return;
      }

      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        notificationSound.currentTime = 0;
        void notificationSound.play().catch((error: unknown) => {
          console.log("Audio play failed:", error);
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    useAuthStore.getState().socket?.off("newMessage");
  },
}));
