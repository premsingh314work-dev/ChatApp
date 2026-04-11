import express, { json } from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.route.js";
import messageRouter from "./routers/messages.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { app ,server} from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === "production";
app.use(
  cors({
    origin: isProduction ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

server.listen(PORT, (req, res) => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
