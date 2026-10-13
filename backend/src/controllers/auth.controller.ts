import type { Request, Response, RequestHandler } from "express";
import User from "../models/user.model.js";
import { RemoveCookie, setTokenCookie } from "../utils/Authcookies.utils.js";
import { GenerateHashedPass, verifyPass } from "../utils/password.utils.js";
import cloudinary from "../lib/cloudinary.js";

interface LoginBody {
  email: string;
  password: string;
}

interface SignupBody {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
}

interface UpdateProfileBody {
  profilePic?: string;
}

export const Login: RequestHandler<{}, unknown, LoginBody> = async (
  req,
  res,
) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      res.status(404).json({
        error: "Username or email is incorrect...",
      });
      return;
    }

    const isMatch = await verifyPass(password, existingUser.password);

    if (!isMatch) {
      res.status(401).json({
        error: "Username or email is incorrect...",
      });
      return;
    }

    setTokenCookie(res, existingUser._id.toString());

    res.status(200).json({
      message: "Login Successfull...",
      data: {
        fullName: existingUser.fullName,
        email: existingUser.email,
        phone: existingUser.phone,
        avatar: existingUser.avatar,
      },
    });
  } catch (err: unknown) {
    console.error("Error in Login:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const Signup: RequestHandler<{}, unknown, SignupBody> = async (
  req,
  res,
) => {
  const { fullName, email, password, phone, avatar } = req.body;

  if (!fullName || !email || !password) {
    return res.status(401).json({
      error: "Please fill every field...",
    });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        error: "Email already existed...",
      });
      return;
    }

    const hashpass = await GenerateHashedPass(password);

    const newUser = new User({
      fullName,
      email,
      password: hashpass,
      phone,
      avatar,
    });

    await newUser.save();

    setTokenCookie(res, newUser._id.toString());

    res.status(201).json({
      message: "Account Created",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
      },
    });
  } catch (err: unknown) {
    console.error("Error in Signup:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const Logout: RequestHandler = (_req, res) => {
  RemoveCookie(res);
};

export const UpadateUser: RequestHandler<
  {},
  unknown,
  UpdateProfileBody
> = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { profilePic } = req.body;

    if (!profilePic) {
      res.status(400).json({
        message: "Profile pic is required.",
      });
      return;
    }

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "Chatting_App",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: uploadResponse.secure_url,
      },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err: unknown) {
    console.error("Error in Update Profile:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
