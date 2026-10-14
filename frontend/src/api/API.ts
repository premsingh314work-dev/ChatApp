import { axiosInstance } from "../lib/axios.js";
import type {
  AuthFormData,
  AuthResponse,
  AuthUser,
  SignupFormData,
} from "../types/auth.js";
import type { ChatUser } from "../types/chat.js";

export const LoginAPI = async (
  formdata: AuthFormData,
): Promise<AuthResponse> => {
  const res = await axiosInstance.post<AuthResponse>("/auth/login", formdata);
  return res.data;
};

export const SignUpAPI = async (
  formdata: SignupFormData,
): Promise<AuthResponse> => {
  const res = await axiosInstance.post<AuthResponse>("/auth/signup", formdata);
  return res.data;
};

/**
 * This endpoint is assumed to return the user object directly.
 * If your backend wraps it in { data: user }, update the return type and caller.
 */
export const checkAuthAPI = async (): Promise<AuthUser> => {
  const res = await axiosInstance.get<AuthUser>("/auth/check");
  return res.data;
};

export const GetAllContactsAPI = async (): Promise<ChatUser[]> => {
  const res = await axiosInstance.get<ChatUser[]>("/messages/contacts");
  return res.data;
};

export const GetMyChatPartnersAPI = async (): Promise<ChatUser[]> => {
  const res = await axiosInstance.get<ChatUser[]>("/messages/chats");
  return res.data;
};

export const LogoutAPI = async (): Promise<void> => {
  await axiosInstance.get("/auth/logout");
};
