import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { checkAuthAPI, SignUpAPI, LoginAPI, LogoutAPI } from "../api/API.js";
import { axiosInstance } from "../lib/axios.js";

import type {
  AuthUser,
  AuthFormData,
  SignupFormData,
  UpdateProfileData,
  AuthResponse,
} from "../types/auth.js";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://chatapp-05al.onrender.com";

interface AuthState {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (formdata: SignupFormData) => Promise<void>;
  login: (formdata: AuthFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;

  // Kept with the original spelling so existing components do not break.
  connetSocket: () => void;
  disconnectSocket: () => void;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const user = await checkAuthAPI();
      set({ authUser: user });
      get().connetSocket();
    } catch (error: unknown) {
      console.error("Error in auth check:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formdata) => {
    set({ isSigningUp: true });
    try {
      const res: AuthResponse = await SignUpAPI(formdata);
      set({ authUser: res.data });
      toast.success(res.message ?? "Signup successful");
      get().connetSocket();
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Signup failed");
      toast.error(message);
      console.error("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formdata) => {
    set({ isLoggingIn: true });

    try {
      const res = await LoginAPI(formdata);

      set({ authUser: res.data });
      toast.success("Logged in successfully");

      return true;
    } catch (error) {
      // Keep your existing error-handling logic here.
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Login failed");
      } else {
        toast.error("Login failed");
      }

      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await LogoutAPI();
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error logging out"));
      console.error("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put<AuthUser>(
        "/auth/update-profile",
        data,
      );
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Profile update failed"));
      console.error("Update profile error:", error);
    }
  },

  connetSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const activeSocket = socket ?? io(BASE_URL, { withCredentials: true });
    activeSocket.connect();
    set({ socket: activeSocket });

    activeSocket.off("getOnlineUsers");
    activeSocket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    socket?.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
