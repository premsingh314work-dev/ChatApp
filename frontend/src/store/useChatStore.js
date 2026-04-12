import { create } from "zustand";
import { GetAllContactsAPI, GetMyChatPartnersAPI } from "../api/API.js";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { Candy } from "lucide-react";
import { useAuthStore } from "./useAuthStore.js";


const notificationSound=new Audio("/sounds/notification.mp3")

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActveTab: (tab) => {
    set({ activeTab: tab });
  },
  setSelectecUser: (selectedUser) => {
    set({ selectedUser });
  },

  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await GetAllContactsAPI();
      set({ allContacts: res });
    } catch (err) {
      toast.error(err?.response?.data?.messages);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUserLoading: true });
    try {
      const res = await GetMyChatPartnersAPI();
      set({ chats: res });
    } catch (err) {
      toast.error(err?.response?.data?.messages);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessagesByUserId: async (userId) => {
    try {
      set({ isMessagesLoading: true });
      const res = await axiosInstance.get(`/messages/${userId}`);
      // console.log(res.data);
      set({ messages: res.data });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: messages.concat(res.data) });
    } catch (err) {
      set({ messages: messages });
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  },
  subscribeToMessage:()=>{
    const {selectedUser,isSoundEnabled} =get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage)=>{
      const currentMessages = get().messages;
      set({messages:[...currentMessages,newMessage]});
      if(isSoundEnabled){
        notificationSound.currentTime =0;
        notificationSound.play().catch((e)=>console.log("Audio Play failed:", e));
      }
    })
  },
  unsubscribeFromMessages:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  }
}));
