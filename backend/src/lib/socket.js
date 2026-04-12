import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const isProduction = process.env.NODE_ENV === "production";

const io = new Server(server, {
  cors: {
    origin: isProduction ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

export function getReceiverSockeId(userId){
  return userSocketMap[userId];
}

const userSocketMap = {}; //{userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;
  //io.emit is used to send event to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnectd", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export {io,app,server};