import { axiosInstance } from "../lib/axios.js"

export const LoginAPI =async(formdata)=>{
    const res = await axiosInstance.post("/auth/login",formdata);
    return res.data;
}