import express from "express";
import { VerifyJWT } from "../utils/jwt.utils.js";
import Users from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token_jwt;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const decoded = VerifyJWT(token); // returns _id of user
    
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    const user = await Users.findById(decoded._id).select("-password");
    req.user=user;
    next();
  } catch (err) {
    console.error("Error in protectRoute middleware",err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
