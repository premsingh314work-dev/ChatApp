import type { ExtendedError, Socket } from "socket.io";
import type { SocketData } from "../types/socket.types.js";
import User from "../models/user.model.js";
import { VerifyJWT } from "../utils/jwt.utils.js";

type AuthSocket = Socket<
  Record<string, (...args: any[]) => void>,
  Record<string, (...args: any[]) => void>,
  Record<string, (...args: any[]) => void>,
  SocketData
>;

export const socketAuthMiddleware = async (
  socket: AuthSocket,
  next: (err?: ExtendedError) => void,
): Promise<void> => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("token_jwt="))
      ?.slice("token_jwt=".length);

    if (!token) {
      next(new Error("Unauthorized - No Token Provided"));
      return;
    }

    const decoded = VerifyJWT(token);

    if (!decoded) {
      next(new Error("Unauthorized - Invalid Token"));
      return;
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      next(new Error("User Not Found"));
      return;
    }

    socket.data.userId = user._id.toString();
    socket.data.user = user;

    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`,
    );

    next();
  } catch (err: unknown) {
    console.error("Error in socket middleware", err);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
