import mongoose, { Schema, type InferSchemaType } from "mongoose";

const cropOfferSchema = new Schema({
  requirement: {
    type: Schema.Types.ObjectId,
    ref: "BuyerRequirement",
    required: true,
    index: true,
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "CropListing",
    required: true,
  },
  farmer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  offeredQuantityKg: { type: Number, required: true, min: 1 },
  offeredPricePerKg: { type: Number, required: true, min: 0.01 },
  message: { type: String, trim: true, maxlength: 1000, default: "" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "withdrawn"],
    default: "pending",
    index: true,
  },
}, { timestamps: true });

cropOfferSchema.index({ requirement: 1, farmer: 1, listing: 1 });

export type CropOfferDocument = InferSchemaType<typeof cropOfferSchema>;

export default mongoose.model("CropOffer", cropOfferSchema);
