import type { RequestHandler } from "express";
import { Friendship } from "../models/Friendship.model.js";
import User from "../models/user.model.js";
import { Types } from "mongoose";

const makePairKey = (a: string, b: string): string => [a, b].sort().join("_");

export const sendFriendRequest: RequestHandler = async (req, res) => {
  const requesterId = req.user?._id;
  if (!requesterId) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const { recipientEmail } = req.body;
  if (typeof recipientEmail !== "string" || !recipientEmail.trim()) {
    res.status(400).json({ error: "recipientEmail is required." });
    return;
  }

  try {
    const recipient = await User.exists({
      email: recipientEmail.trim().toLowerCase(),
    });
    if (!recipient) {
      res.status(404).json({ error: "Receiver not found." });
      return;
    }

    const recipientId = recipient._id;
    if (recipientId.toString() === requesterId.toString()) {
      res
        .status(400)
        .json({ error: "You cannot send a friend request to yourself." });
      return;
    }

    const pairKey = makePairKey(recipientId.toString(), requesterId.toString());

    const existing = await Friendship.findOne({ pairKey }).select(
      "status requester",
    );

    if (existing) {
      if (existing.status === "accepted") {
        res.status(409).json({ error: "You are already friends." });
        return;
      }
      if (existing.status === "blocked") {
        // generic message so a blocked user can't tell they're blocked
        res.status(404).json({ error: "Receiver not found." });
        return;
      }
      if (existing.status === "pending") {
        if (existing.requester.equals(requesterId)) {
          res.status(409).json({ error: "Request already sent." });
          return;
        }
        // they already sent me one, so accept it
        await Friendship.updateOne(
          { _id: existing._id, status: "pending" },
          { status: "accepted" },
        );
        res.status(200).json({ message: "Friend request accepted." });
        return;
      }
      if (existing.status === "declined") {
        // re-open it (add a cooldown here if want anti-spam)
        await Friendship.updateOne(
          { _id: existing._id, status: "declined" },
          { requester: requesterId, recipient: recipientId, status: "pending" },
        );
        res.status(201).json({ message: "Friend request sent." });
        return;
      }
    }

    const friendRequest = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
      pairKey,
    });

    res
      .status(201)
      .json({ message: "Friend request sent.", data: friendRequest });
  } catch (err: any) {
    if (err?.code === 11000) {
      res
        .status(409)
        .json({ error: "A request or friendship already exists." });
      return;
    }
    console.error("sendFriendRequest failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const getFriends: RequestHandler = async (req, res) => {
  const user = req.user?._id;
  if (!user) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const cursor = req.query.cursor as string | undefined;

  if (cursor && !Types.ObjectId.isValid(cursor)) {
    res.status(400).json({ error: "Invalid cursor." });
    return;
  }

  try {
    const filter: Record<string, unknown> = {
      users: user,
      status: "accepted",
    };
    if (cursor) filter._id = { $gt: new Types.ObjectId(cursor) };

    // 1) get my accepted friendships (one page)
    const friendships = await Friendship.find(filter)
      .sort({ _id: 1 })
      .limit(limit)
      .select("users updatedAt")
      .lean();

    // 2) pick the other person from each friendship
    const friendIds = friendships.map(
      (f) => f.users?.find((id) => !id.equals(user))!,
    );

    // 3) fetch those users in one query
    const users = await User.find({ _id: { $in: friendIds } })
      .select("name email avatar") // adjust to your User fields, never password
      .lean();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // 4) build the response, keeping friendship order
    const data = friendships.map((f, i) => ({
      friendshipId: f._id,
      friendedAt: f.updatedAt,
      user: userMap.get(friendIds[i].toString()) ?? null,
    }));

    res.json({
      data,
      nextCursor:
        friendships.length === limit
          ? friendships[friendships.length - 1]._id
          : null,
    });
  } catch (err) {
    console.error("getFriends failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const AcceptRequest: RequestHandler = async (req, res) => {
  const me = req.user?._id;
  // console.log(me);
  if (!me) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid request id." });
    return;
  }

  try {
    // One atomic query: it must be pending AND addressed to me
    const friendship = await Friendship.findOneAndUpdate(
      { _id: id, recipient: me, status: "pending" },
      { status: "accepted" },
      { returnDocument: "after" },
    ).lean();

    if (!friendship) {
      res.status(404).json({ error: "Request not found or already handled." });
      return;
    }

    // Optional: emit to the original requester via Socket.IO here
    // io.to(friendship.requester.toString()).emit("friend:accepted", { ... });

    res.json({ message: "Friend request accepted." });
  } catch (err) {
    console.error("acceptFriendRequest failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const DeclineRequest: RequestHandler = async (req, res) => {
  const me = req.user?._id;
  // console.log(me);
  if (!me) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid request id." });
    return;
  }

  try {
    // One atomic query: it must be pending AND addressed to me
    const friendship = await Friendship.findOneAndUpdate(
      { _id: id, recipient: me, status: "pending" },
      { status: "declined" },
      { returnDocument: "after" },
    ).lean();

    if (!friendship) {
      res.status(404).json({ error: "Request not found or already handled." });
      return;
    }

    // Optional: emit to the original requester via Socket.IO here
    // io.to(friendship.requester.toString()).emit("friend:accepted", { ... });

    res.json({ message: "Friend request declined." });
  } catch (err) {
    console.error("DeclineFriendRequest failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const GetIncomingRequsets: RequestHandler = async (req, res) => {
  const me: Types.ObjectId | undefined = req.user?._id;
  if (!me) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  const page = Math.max(
    1,
    Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
  );

  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(String(req.query.limit ?? "20"), 10) || 20),
  );
  try {
    const incomingRequests = await Friendship.find({
      recipient: me,
      status: "pending",
      requester: { $ne: me },
    })
      .select("_id requester createdAt")
      .populate("requester", "fullName username avatar")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    res.status(200).json({
      message: "Incoming requests fetched successfully.",
      data: incomingRequests,
      pagination: {
        page,
        limit,
        hasMore: incomingRequests.length === limit,
      },
    });
  } catch (err: unknown) {
    console.error("acceptFriendRequest failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const removeFriend: RequestHandler = async (req, res) => {
  const me: Types.ObjectId | undefined = req.user?._id;
  if (!me) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  const userId = String(req.params.userId);
  if (!Types.ObjectId.isValid(userId)) {
    res.status(400).json({ error: "Invalid request id." });
    return;
  }
  if (userId === me.toString()) {
    res.status(400).json({ error: "You cannot unfriend yourself." });
    return;
  }
  try {
    const otherId = new Types.ObjectId(userId).toString();
    const pairKey = makePairKey(me.toString(), otherId);
    const deleted = await Friendship.findOneAndDelete({
      pairKey: pairKey,
      status: "accepted",
    }).lean();
    if (!deleted) {
      res.status(404).json({ error: "Friendship not found." });
      return;
    }

    //todo
    // io.to(userId).emit("friend:removed", { userId: me.toString() });

    res.status(200).json({ message: "deleted", deleted: deleted });
    return;
  } catch (err) {
    console.error("removeFriend failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};
