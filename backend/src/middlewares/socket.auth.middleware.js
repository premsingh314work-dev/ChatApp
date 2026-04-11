import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { VerifyJWT } from "../utils/jwt.utils.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("token_jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected:Invalid token");
      return next(new Error("Unauthorized - No Token Provided"));
    }
    const decoded = VerifyJWT(token); // returns _id of user

    if (!decoded) {
      console.log("Socket connection rejected:Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      console.log("Socket connection rejected:User not found");
      return next(new Error("User Not Found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    console.log(
      `Socket auntheticated for user: ${user.fullName} (${user._id})`,
    );

    next();
  } catch (err) {
    console.error("Error in socket middleware", err.message);
    next(new Error("Unauthorized - Authenticated failed."))
  }
};
