import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    text: {
      type: String,
      maxlength:2000,
      trim:true,  
    },
    Image: {
      type: String,
    },
  },
  { timestamps: true },
);

const Message= mongoose.model("Mesage",messageSchema)

export default Message;
