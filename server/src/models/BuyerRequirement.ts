import mongoose, { Schema } from "mongoose";

const buyerRequirementSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  cropName: { type: String, required: true, trim: true, maxlength: 80 },
  quantityKg: { type: Number, required: true, min: 0.01 },
  targetPricePerKg: { type: Number, required: true, min: 0.01 },
  deliveryLocation: { type: String, required: true, trim: true, maxlength: 160 },
  requiredBy: { type: Date, required: true },
  notes: { type: String, trim: true, maxlength: 1000, default: "" },
  status: {
    type: String,
    enum: ["open", "fulfilled", "cancelled"],
    default: "open",
    index: true,
  },
}, { timestamps: true });

export default mongoose.models.BuyerRequirement ||
  mongoose.model("BuyerRequirement", buyerRequirementSchema);
