import express from "express";
import { GenerateJWT } from "./jwt.utils.js";
const isProduction = process.env.NODE_ENV === "production";

export const setTokenCookie = (res, userid) => {
  const payload = {
    _id: userid,
  };
  const jwtToken = GenerateJWT(payload);
  res.cookie("token_jwt", jwtToken, {
    httpOnly: true,
    secure: isProduction, // only HTTPS in production
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, //1Day
  });
  return jwtToken;
};

export const RemoveCookie = (res) => {
  res.clearCookie("token_jwt", {
    httpOnly: true,
    secure: isProduction, // only HTTPS in production
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({message:"Logout successfully..."})
};
