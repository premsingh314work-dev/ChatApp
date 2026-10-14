import { Request, Response, NextFunction } from "express";
import { VerifyJWT } from "../utils/jwt.utils.js";
import Users from "../models/user.model.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token_jwt;
    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }
    const decoded = VerifyJWT(token); // returns _id of user

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }
    const user = await Users.findById(decoded._id).select("-password");
    if (!user) {
      res.status(401).json({
        message: "Unauthorized - User not found",
      });
      return;
    }
    req.user = user;
    // console.log(req.user);
    next();
  } catch (err: unknown) {
    console.error("Error in protectRoute middleware", err);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};
