import { create } from "zustand";
import { checkAuthAPI, SignUpAPI, LoginAPI, LogoutAPI } from "../api/API";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  onlineUsers:[],
  socket: null,

  checkAuth: async () => {
    try {
      // console.log("checkAuth is running");
      const res = await checkAuthAPI();
      set({ authUser: res });
      get().connetSocket();
    } catch (err) {
      console.error("Error in authCheck:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
      // console.log("checkAuth is ending");
    }
  },

  signup: async (formdata) => {
    set({ isSigningUp: true });
    try {
      const res = await SignUpAPI(formdata);
      set({ authUser: res.data });
      toast.success(res.message || "Signup successful");
      get().connetSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      console.log("error: ", err.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (formdata) => {
    set({ isLoggingIn: true });
    try {
      const res = await LoginAPI(formdata);
      set({ authUser: res.data });
      toast.success(res.message || "Login successful");
      get().connetSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.log("error: ", err.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await LogoutAPI();
      set({ authUser: null });
      toast.success("logged out successfully");
      get().disconnectSocket();
    } catch (err) {
      toast.error("Error logging out");
      console.log("Logout Error:", err);
    }
  },

  updateProfile: async (data) => {
    try {
      console.log("updateprofile Api called");

      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("profile Updated successfully");
    } catch (err) {
      console.log("error in update profile:", err);
      toast.error(err?.response?.data?.message);
    }
  },
  connetSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, { withCredentials: true });
    socket.connect()
    set({socket:socket})

    //listen for online users event
    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds});
    })
  },
  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
  }
}));
