import Message from "../models/Message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSockeId, io } from "../lib/socket.js";
export const getAllContacts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch (err) {
        console.error("Error in getAllContacts", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getMessagesByUserId = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const myId = req.user._id;
        const { id: userToChatId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId },
            ],
        });
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("Error in getMessagesByUserId", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const sendMessage = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        if (!text?.trim() && !image) {
            res.status(400).json({
                message: "Text or image is required.",
            });
            return;
        }
        if (senderId.toString() === receiverId) {
            res.status(400).json({
                message: "Cannot send message to yourself.",
            });
            return;
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            res.status(404).json({ message: "Receiver not found." });
            return;
        }
        let imageUrl;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: "Chatting_App",
                });
                imageUrl = uploadResponse.secure_url;
            }
            catch (uploadErr) {
                console.error("Cloudinary upload error:", uploadErr);
                res.status(500).json({ message: "Failed to upload image" });
                return;
            }
        }
        const newMessage = new Message({
            senderId,
            reciverId: receiverId,
            text,
            Image: imageUrl,
        });
        await newMessage.save();
        const receiverSocketId = getReceiverSockeId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (err) {
        console.error("Error in sendMessage", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getChatPartners = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { reciverId: loggedInUserId }],
        });
        const chatPartnersIds = [
            ...new Set(messages
                .filter((msg) => msg.senderId && msg.reciverId)
                .map((msg) => msg.senderId.toString() === loggedInUserId.toString()
                ? msg.reciverId.toString()
                : msg.senderId.toString())),
        ];
        const chatPartners = await User.find({
            _id: { $in: chatPartnersIds },
        }).select("-password");
        res.status(200).json(chatPartners);
    }
    catch (err) {
        console.error("Error in getChatPartners", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
