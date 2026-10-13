import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
      unique: true,
    },
  },
  { timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema>;

const User = mongoose.model("User", userSchema);

export default User;
