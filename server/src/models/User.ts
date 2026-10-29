import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, select: false },
  role: {
    type: String,
    enum: ["farmer", "buyer", "transporter", "expert", "admin"],
    default: "farmer"
  },
  verificationStatus: {
    type: String,
    enum: ["unverified", "pending", "verified", "rejected"],
    default: "unverified"
  }
}, { timestamps: true });

export default mongoose.models.User ||
  mongoose.model("User", userSchema);
