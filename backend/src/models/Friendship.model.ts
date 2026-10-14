import { Schema, model, Types } from "mongoose";

export interface IFriendship {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  users: Types.ObjectId[];
  status: "pending" | "accepted" | "declined" | "blocked";
  pairKey: string; // sorted "idA_idB", used for uniqueness
  createdAt?: Date;
  updatedAt?: Date;
}

const friendshipSchema = new Schema<IFriendship>(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    users: {
      type: [Schema.Types.ObjectId],
      validate: {
        validator: (v: Types.ObjectId[]) => v.length === 2,
        message: "users must contain exactly 2 ids",
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "blocked"],
      default: "pending",
    },
    pairKey: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);
// Keep `users` in sync automatically on create
friendshipSchema.pre("validate", function () {
  if (this.isNew) {
    this.users = [this.requester, this.recipient];
  }
});
friendshipSchema.index({ users: 1, status: 1, _id: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1, createdAt: -1, _id: -1 });
export const Friendship = model<IFriendship>("Friendship", friendshipSchema);
