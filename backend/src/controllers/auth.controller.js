import express from "express";
import User from "../models/user.model.js";

export const Login = async (req, res) => {
  const { phone, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      email,
      phone: phone || null,
    }).select("+password");
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Username or email is incorrect..." });
    }
    console.log(existingUser.password);

    if (existingUser.password === password) {
      return res.status(200).json({ message: "Login successfull ..." });
    } else {
      return res.status(401).json({ message: "Password is incorrect" });
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const Signup = async (req, res) => {
  const { fullName, email, password, phone, avatar } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already existed..." });
    }
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: password,
      phone: phone,
      avatar: phone,
    });
    await newUser.save();
    res.status(201).json({ message: "Account Created" });
  } catch (err) {
    console.log(err.message);
  }
};
