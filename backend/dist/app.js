import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.route.js";
import messageRouter from "./routers/messages.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import friendRouter from "./routers/friends.route.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
app.use(cors({
    origin: isProduction ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/friends", friendRouter);
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("❌ Failed to start server:", error.message);
        }
        else {
            console.error("❌ Failed to start server:", error);
        }
        process.exitCode = 1;
    }
};
startServer();
