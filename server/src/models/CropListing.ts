import mongoose, { Schema } from "mongoose";

const cropListingSchema = new Schema({
  farmer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  cropName: { type: String, required: true, trim: true, maxlength: 80 },
  quantityKg: { type: Number, required: true, min: 0.01 },
  expectedPricePerKg: { type: Number, required: true, min: 0.01 },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  imageUrl: { type: String, trim: true, default: "" },
  status: {
    type: String,
    enum: ["active", "sold", "cancelled"],
    default: "active",
  },
}, { timestamps: true });

export default mongoose.models.CropListing ||
  mongoose.model("CropListing", cropListingSchema);

