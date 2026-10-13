import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export const connectDB = async () => {
    try {
        // console.log("Mongo URI:", process.env.MONGODB_URI);
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is missing from environment variables");
        }
        await mongoose.connect(mongoUri);
        console.log("DB connected");
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Database connection failed:", err.message);
        }
        else {
            console.error("Database connection failed:", err);
        }
        throw err;
    }
};
