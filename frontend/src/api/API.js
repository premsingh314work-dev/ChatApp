import { axiosInstance } from "../lib/axios.js";

export const LoginAPI = async (formdata) => {
  const res = await axiosInstance.post("/auth/login", formdata);
  return res.data;
};

export const SignUpAPI = async (formdata) => {
  const res = await axiosInstance.post("/auth/signup", formdata);
  return res.data;
};

export const checkAuthAPI = async () => {
  const res = await axiosInstance.get("/auth/check");
  return res.data
};

export const LogoutAPI = async()=>{
    const res = await axiosInstance.get('/auth/logout');
}

