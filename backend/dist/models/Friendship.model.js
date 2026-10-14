import { Schema, model } from "mongoose";
const friendshipSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined", "blocked"],
        default: "pending",
    },
    pairKey: { type: String, required: true, unique: true },
}, { timestamps: true });
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index({ requester: 1, status: 1 });
export const Friendship = model("Friendship", friendshipSchema);
