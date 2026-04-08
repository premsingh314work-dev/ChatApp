import { create } from "zustand";
import { checkAuthAPI, SignUpAPI,LoginAPI, LogoutAPI } from "../api/API";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
        // console.log("checkAuth is running");
        const res = await checkAuthAPI();
        set({ authUser: res });
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
      return res;
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
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
        console.log("error: ", err.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async()=>{
    try{await LogoutAPI();
    set({authUser:null})
    toast.success("logged out successfully");
    }catch(err){
        toast.error("Error logging out");
        console.log("Logout Error:",err);
    }
  },

  updateProfile :async(data)=>{
    try{
      console.log("updateprofile Api called");
      
      const res = await axiosInstance.put("/auth/update-profile",data)
      set({authUser:res.data});
      toast.success("profile Updated successfully");
    }catch(err){
      console.log("error in update profile:",err);
      toast.error(err?.response?.data?.message);
    }
  }
}));
