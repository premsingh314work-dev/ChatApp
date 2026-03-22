import express from "express";
import Message from "../models/Message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.error("Error in getAllContacts", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: UserToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          reciverId: UserToChatId,
        },
        {
          senderId: UserToChatId,
          reciverId: myId,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in GetMessageByUserId", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // upload it to the cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "Chatting_App",
      });
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      iage: imageUrl,
    });
    await newMessage.save();
    // todo : send message in real-time if user is online
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error in sendMessage", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // find al the messages where loggedInUserId is sender or reveiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { reciverId: loggedInUserId }],
    });
    const chatPartnersIds = [...new Set(messages.map((msg) =>
      msg.senderId.toString() === loggedInUserId.toString()
        ? msg.reciverId.toString()
        : msg.senderId.toString(),
    ))]

    const chatPartners = await User.find({_id: {$in:chatPartnersIds}}).select("-password");
    res.status(200).json(chatPartners)

  } catch (err) {
    console.error("Error in getChatPartners", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
