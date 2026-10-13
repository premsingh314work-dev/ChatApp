import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRETEKEY;
if (!secretKey) {
    throw new Error("SECRETEKEY is missing from environment variables");
}
export const GenerateJWT = (payload) => {
    return jwt.sign(payload, secretKey, {
        expiresIn: "7d",
    });
};
export const VerifyJWT = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        if (typeof decoded === "string" || typeof decoded._id !== "string") {
            return null;
        }
        return decoded;
    }
    catch {
        return null;
    }
};
