import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../../models/User.js";
import CropListing from "../../models/CropListing.js";

const router = Router();
const uploadDir = path.resolve(process.cwd(), "uploads", "crop-photos");
fs.mkdirSync(uploadDir, { recursive: true });

const photoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const createSchema = z.object({
  cropName: z.string().trim().min(1).max(80),
  quantityKg: z.coerce.number().positive().finite(),
  expectedPricePerKg: z.coerce.number().positive().finite(),
  location: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000).optional().default(""),
  imageUrl: z.string().trim().max(300).regex(/^\/uploads\/crop-photos\/[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$/i).optional().default(""),
});

async function getFarmer(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  try {
    const payload = jwt.verify(header.slice(7), secret);
    if (typeof payload === "string") return null;

    const id = payload.userId ?? payload.id ?? payload.sub;
    if (typeof id === "string" && id) {
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


router.post("/photo", (req: Request, res: Response, next) => {
  void (async () => {
    const farmer = await getFarmer(req);
    if (!farmer) {
      res.status(401).json({ success: false, message: "Please log in again." });
      return;
    }

    photoUpload.single("photo")(req, res, (error) => {
      if (error) {
        res.status(400).json({
          success: false,
          message: "Upload failed. Use JPG, PNG or WebP up to 5 MB.",
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: "Please select a valid photo." });
        return;
      }

      res.status(201).json({
        success: true,
        data: { imageUrl: `/uploads/crop-photos/${req.file.filename}` },
      });
    });
  })().catch(next);
});
router.get("/", async (_req: Request, res: Response, next) => {
  try {
    const listings = await CropListing.find({ status: "active" })
      .select("cropName quantityKg expectedPricePerKg location description imageUrl createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req: Request, res: Response, next) => {
  try {
    const farmer = await getFarmer(req);
    if (!farmer) {
      res.status(401).json({ success: false, message: "Please log in again." });
      return;
    }

    if (farmer.role !== "farmer") {
      res.status(403).json({ success: false, message: "Only farmer accounts can list crops." });
      return;
    }

    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Please check the crop details.",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const listing = await CropListing.create({
      ...parsed.data,
      farmer: farmer._id,
    });

    res.status(201).json({
      success: true,
      message: "Crop listing saved successfully.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/mine", async (req: Request, res: Response, next) => {
  try {
    const farmer = await getFarmer(req);
    if (!farmer) {
      res.status(401).json({ success: false, message: "Please log in again." });
      return;
    }

    const listings = await CropListing.find({ farmer: farmer._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
});

export default router;




