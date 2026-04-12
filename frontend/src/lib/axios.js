import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://chat-app-ebon-one-41.vercel.app/api",
  withCredentials: true,
});
