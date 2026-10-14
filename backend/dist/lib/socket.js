import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";
const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === "production";
const frontendUrl = isProduction
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";
if (!frontendUrl) {
    throw new Error("FRONTEND_URL is missing in production");
}
const io = new Server(server, {
    cors: {
        origin: frontendUrl,
        credentials: true,
    },
});
io.use(socketAuthMiddleware);
const userSocketMap = {};
export function getReceiverSockeId(userId) {
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
