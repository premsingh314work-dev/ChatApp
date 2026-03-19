import express from "express";
import { Login, Logout, Signup, UpadateUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/Auth.middleware.js";

const authRouter = express.Router();

authRouter.post('/login',Login)
authRouter.post('/signup',Signup)
authRouter.get('/logout',Logout)
authRouter.put('/update-profile',protectRoute,UpadateUser)
authRouter.get('/check',protectRoute,(req,res)=>{
    res.status(200).json(req.user)
})
    

export default authRouter