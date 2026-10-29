import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "CropListing",
      required: true,
      index: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cropName: { type: String, required: true, trim: true },
    quantityKg: { type: Number, required: true, min: 0.01 },
    pricePerKg: { type: Number, required: true, min: 0.01 },
    totalAmount: { type: Number, required: true, min: 0.01 },
    deliveryAddress: { type: String, required: true, trim: true, maxlength: 300 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
    status: {
      type: String,
      enum: ["confirmed", "accepted", "in_transit", "delivered", "cancelled"],
      default: "confirmed",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);
