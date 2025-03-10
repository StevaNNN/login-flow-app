import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String },
    fullName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "player"],
      required: true,
      default: "player",
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
