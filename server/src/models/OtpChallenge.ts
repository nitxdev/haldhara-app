import mongoose, { Schema } from "mongoose";

const otpChallengeSchema = new Schema({
  phone: { type: String, required: true, index: true },
  purpose: {
    type: String,
    enum: ["signup", "login", "phone-change"],
    required: true
  },
  codeHash: { type: String, required: true, select: false },
  providerSessionId: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true, expires: 0 },
  attempts: { type: Number, default: 0 },
  verifiedAt: { type: Date, default: null }
}, { timestamps: true });

otpChallengeSchema.index({ phone: 1, purpose: 1 }, { unique: true });

export default mongoose.models.OtpChallenge ||
  mongoose.model("OtpChallenge", otpChallengeSchema);
