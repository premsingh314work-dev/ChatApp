import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRETEKEY;

export const GenerateJWT = (payload) => {
  try {
    const token = jwt.sign(payload, secretKey);
    return token;
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const VerifyJWT = (token)=>{
  const decoded = jwt.verify(token,secretKey);
  return decoded;  
}
