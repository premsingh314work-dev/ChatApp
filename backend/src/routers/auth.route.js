import express from "express";
import { Login, Signup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login',Login)
authRouter.post('/signup',Signup)
authRouter.get('/update',(req,res)=>{
    res.status(200).json({ message: "update successful" });
})


export default authRouter