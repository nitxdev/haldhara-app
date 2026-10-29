import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import mongoose from "mongoose";
import User from "../../models/User.js";
import CropListing from "../../models/CropListing.js";
import Order from "../../models/Order.js";

const router = Router();

async function getUser(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  try {
    const payload = jwt.verify(header.slice(7), secret);
    if (typeof payload === "string") return null;

    const id = payload.userId ?? payload.id ?? payload.sub;

    if (typeof id === "string" && mongoose.isValidObjectId(id)) {
      const user = await User.findById(id);
      if (user) return user;
    }

    if (typeof payload.phone === "string") {
      return await User.findOne({ phone: payload.phone });
    }

    return null;
  } catch {
    return null;
  }
}

const createOrderSchema = z.object({
  listingId: z.string().refine(mongoose.isValidObjectId, "Invalid listing ID"),
  quantityKg: z.coerce.number().positive().finite(),
  deliveryAddress: z.string().trim().min(3).max(300),
  phone: z.string().trim().min(5).max(20),
  notes: z.string().trim().max(500).optional().default(""),
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const buyer = await getUser(req);

    if (!buyer) {
      res.status(401).json({ success: false, message: "Please log in again." });
      return;
    }

    if (buyer.role !== "buyer") {
      res.status(403).json({ success: false, message: "Only buyer accounts can place orders." });
      return;
    }

    const parsed = createOrderSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Please check your order details.",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { listingId, quantityKg, deliveryAddress, phone, notes } = parsed.data;

    const listing = await CropListing.findOne({
      _id: listingId,
      status: "active",
    });

    if (!listing) {
      res.status(404).json({ success: false, message: "Crop listing is unavailable." });
      return;
    }

    if (String(listing.farmer) === String(buyer._id)) {
      res.status(400).json({ success: false, message: "You cannot order your own crop." });
      return;
    }

    if (quantityKg > listing.quantityKg) {
      res.status(400).json({
        success: false,
        message: `Only ${listing.quantityKg} kg is currently listed.`,
      });
      return;
    }

    const totalAmount = Math.round(quantityKg * listing.expectedPricePerKg * 100) / 100;

    const order = await Order.create({
      listing: listing._id,
      buyer: buyer._id,
      farmer: listing.farmer,
      cropName: listing.cropName,
      quantityKg,
      pricePerKg: listing.expectedPricePerKg,
      totalAmount,
      deliveryAddress,
      phone,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/mine", async (req: Request, res: Response, next) => {
  try {
    const user = await getUser(req);

    if (!user) {
      res.status(401).json({ success: false, message: "Please log in again." });
      return;
    }

    const filter = user.role === "farmer"
      ? { farmer: user._id }
      : { buyer: user._id };

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("buyer", "name phone")
      .populate("farmer", "name phone")
      .lean();

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

export default router;
