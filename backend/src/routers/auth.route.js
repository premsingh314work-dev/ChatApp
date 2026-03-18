import express from "express";

const authRouter = express.Router();

authRouter.get('/login',(req,res)=>{
    res.status(200).json({ message: "Login successful" });
})
authRouter.get('/signup',(req,res)=>{
    res.status(200).json({ message: "signup successful" });
})
authRouter.get('/update',(req,res)=>{
    res.status(200).json({ message: "update successful" });
})


export default authRouter