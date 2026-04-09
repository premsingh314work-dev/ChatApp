import { create } from "zustand";
import { GetAllContactsAPI,GetMyChatPartnersAPI } from "../api/API.js";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

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
        toast.error(err?.response?.data?.messages)
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
        toast.error(err?.response?.data?.messages)
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessagesByUserId: async(userId)=>{
    try{
      set({isMessagesLoading:true});
      const res = await axiosInstance.get(`/messages/${userId}`);
      // console.log(res.data);
      set({messages:res.data});
    }catch(err){
      console.log(err);
      toast.error(err.response?.data?.message ||"Something went wrong");
    }finally{
      set({isMessagesLoading:false});
    }
  }
}));
