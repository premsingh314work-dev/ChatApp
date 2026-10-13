import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRETEKEY;

if (!secretKey) {
  throw new Error("SECRETEKEY is missing from environment variables");
}

export interface TokenPayload extends JwtPayload {
  _id: string;
}

export const GenerateJWT = (payload: { _id: string }): string => {
  return jwt.sign(payload, secretKey, {
    expiresIn: "7d",
  });
};

export const VerifyJWT = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, secretKey);

    if (typeof decoded === "string" || typeof decoded._id !== "string") {
      return null;
    }

    return decoded as TokenPayload;
  } catch {
    return null;
  }
};
