import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";
import type { SocketData } from "../types/socket.types.js";
import { log } from "node:console";

const app = express();
const server = http.createServer(app);

const isProduction = process.env.NODE_ENV === "production";
const frontendUrl = isProduction
  ? process.env.FRONTEND_URL
  : "http://localhost:5173";

if (!frontendUrl) {
  throw new Error("FRONTEND_URL is missing in production");
}
const io = new Server<
  Record<string, (...args: any[]) => void>,
  Record<string, (...args: any[]) => void>,
  Record<string, (...args: any[]) => void>,
  SocketData
>(server, {
  cors: {
    origin: frontendUrl,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap: Record<string, string> = {};

export function getReceiverSockeId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.data.user?.fullName);

  const userId = socket.data.userId;
  userSocketMap[userId] = socket.id;
  // console.log(JSON.stringify(userSocketMap));
  // console.log(Object.keys(userSocketMap));

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.data.user?.fullName);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
