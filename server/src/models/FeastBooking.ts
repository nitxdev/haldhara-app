import { Schema, model } from "mongoose";

const feastBookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  eventName: { type: String, required: true, trim: true, maxlength: 120 },
  eventType: { type: String, required: true, maxlength: 60 },
  eventDate: { type: Date, required: true },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  guests: { type: Number, required: true, min: 1 },
  crops: { type: String, required: true, trim: true, maxlength: 2000 },
  budget: { type: Number, required: true, min: 0 },
  notes: { type: String, default: "", maxlength: 2000 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default model("FeastBooking", feastBookingSchema);
