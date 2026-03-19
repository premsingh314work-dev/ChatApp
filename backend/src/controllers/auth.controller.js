import express from "express";
import User from "../models/user.model.js";
import { RemoveCookie, setTokenCookie } from "../utils/Authcookies.utils.js";
import { GenerateHashedPass ,verifyPass} from "../utils/password.utils.js";

export const Login = async (req, res) => {
  const { phone, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    }).select("+password");
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Username or email is incorrect..." });
    }
    const ismatch = verifyPass(password,existingUser.password);
    if (ismatch) {
      setTokenCookie(res,existingUser._id);
      return res.status(200).json({ message: "Login Successfull..." });
    } else {
      return res.status(401).json({ message: "Password is incorrect" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const Signup = async (req, res) => {
  const { fullName, email, password, phone, avatar } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already existed..." });
    }
    
    const hashpass=await GenerateHashedPass(password);
    
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashpass,
      phone: phone,
      avatar: avatar,
    });
    await newUser.save();
    setTokenCookie(res,newUser._id);
    res.status(201).json({ message: "Account Created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const Logout =(_,res)=>{
  RemoveCookie(res);
}
