import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../../models/User.js";
import BuyerRequirement from "../../models/BuyerRequirement.js";

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
    if (typeof id === "string" && id) return await User.findById(id);

    if (typeof payload.phone === "string") {
      return await User.findOne({ phone: payload.phone });
    }
    return null;
  } catch {
    return null;
  }
}

const createSchema = z.object({
  cropName: z.string().trim().min(1).max(80),
  quantityKg: z.coerce.number().positive().finite(),
  targetPricePerKg: z.coerce.number().positive().finite(),
  deliveryLocation: z.string().trim().min(1).max(160),
  requiredBy: z.coerce.date(),
  notes: z.string().trim().max(1000).optional().default(""),
});

router.get("/", async (_req: Request, res: Response, next) => {
  try {
    const requirements = await BuyerRequirement.find({ status: "open" })
      .select("cropName quantityKg targetPricePerKg deliveryLocation requiredBy notes createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ success: true, data: requirements });
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

    const requirements = await BuyerRequirement.find({ buyer: user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: requirements });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ success: false, message: "Please log in again." });
      return;
    }

    if (user.role !== "buyer" && user.role !== "farmer" && user.role !== "admin") {
      res.status(403).json({ success: false, message: "This account cannot post requirements." });
      return;
    }

    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Please check the requirement details.",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    if (parsed.data.requiredBy.getTime() < Date.now()) {
      res.status(400).json({ success: false, message: "Required-by date must be in the future." });
      return;
    }

    const requirement = await BuyerRequirement.create({
      ...parsed.data,
      buyer: user._id,
    });

    res.status(201).json({
      success: true,
      message: "Buyer requirement posted.",
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
