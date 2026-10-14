import express from "express";
import { protectRoute } from "../middlewares/Auth.middleware.js";
import { sendFriendRequest } from "../controllers/friends.controller.js";
// localhost:3000/api/friends
const friendRouter = express.Router();
friendRouter.post("/requests", protectRoute, sendFriendRequest);
export default friendRouter;
