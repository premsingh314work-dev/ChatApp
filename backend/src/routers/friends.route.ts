import express from "express";
import { Request, Response } from "express";

import { protectRoute } from "../middlewares/Auth.middleware.js";
import {
  AcceptRequest,
  DeclineRequest,
  getFriends,
  GetIncomingRequsets,
  removeFriend,
  sendFriendRequest,
} from "../controllers/friends.controller.js";

// localhost:3000/api/friends
const friendRouter = express.Router();

// /friends
friendRouter.get("/", protectRoute, getFriends);

// /friends/requests
friendRouter.post("/requests", protectRoute, sendFriendRequest);

// /friends/requests/incoming
friendRouter.get("/requests/incoming", protectRoute, GetIncomingRequsets);

// /friends/:userId
friendRouter.delete("/:userId", protectRoute, removeFriend);

// /requests/:id/accept
friendRouter.patch("/requests/:id/accept", protectRoute, AcceptRequest);

// /friends/requests/:id/decline
friendRouter.patch("/requests/:id/decline", protectRoute, DeclineRequest);

export default friendRouter;
