import { Router } from "express";
import CropListing from "../../models/CropListing.js";
import BuyerRequirement from "../../models/BuyerRequirement.js";

const router = Router();

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function scoreMatch(crop: any, requirement: any) {
  const sameCrop =
    normalize(crop.cropName) === normalize(requirement.cropName);
  if (!sameCrop) return null;

  const available = Number(crop.quantityKg) || 0;
  const wanted = Number(requirement.quantityKg) || 0;
  const farmerPrice = Number(crop.expectedPricePerKg) || 0;
  const buyerPrice = Number(requirement.targetPricePerKg) || 0;

  const quantityScore = wanted > 0
    ? Math.min(100, (available / wanted) * 100)
    : 0;

  const priceScore = farmerPrice > 0 && buyerPrice > 0
    ? farmerPrice <= buyerPrice
      ? 100
      : Math.max(0, 100 - ((farmerPrice - buyerPrice) / buyerPrice) * 100)
    : 50;

  const farmerLocation = normalize(crop.location);
  const buyerLocation = normalize(requirement.deliveryLocation);
  const locationScore = farmerLocation && buyerLocation
    ? farmerLocation === buyerLocation ? 100
      : farmerLocation.includes(buyerLocation) || buyerLocation.includes(farmerLocation) ? 70 : 25
    : 50;

  const score = Math.round(
    quantityScore * 0.35 + priceScore * 0.40 + locationScore * 0.25
  );

  return {
    score,
    cropMatch: true,
    quantity: {
      availableKg: available,
      requiredKg: wanted,
      sufficient: available >= wanted,
      coveragePercent: Math.round(quantityScore),
    },
    price: {
      farmerPricePerKg: farmerPrice,
      buyerTargetPerKg: buyerPrice,
      withinTarget: farmerPrice > 0 && buyerPrice > 0 && farmerPrice <= buyerPrice,
    },
    location: {
      farmerLocation: crop.location ?? "",
      deliveryLocation: requirement.deliveryLocation ?? "",
      sameLocation: farmerLocation !== "" && farmerLocation === buyerLocation,
    },
  };
}

// GET /api/matching?requirementId=<buyer-requirement-id>
// Returns active farmer listings ranked for one open buyer requirement.
router.get("/", async (req, res, next) => {
  try {
    const requirementId = String(req.query.requirementId ?? "");
    if (!requirementId) {
      return res.status(400).json({
        message: "Provide a requirementId query parameter.",
      });
    }

    const requirement = await BuyerRequirement.findOne({
      _id: requirementId,
      status: "open",
    }).lean();

    if (!requirement) {
      return res.status(404).json({ message: "Open buyer requirement not found." });
    }

    const crops = await CropListing.find({ status: "active" })
      .select("cropName quantityKg expectedPricePerKg location description imageUrl createdAt")
      .limit(500)
      .lean();

    const matches = crops
      .map((crop: any) => {
        const match = scoreMatch(crop, requirement);
        if (!match) return null;
        return {
          listing: crop,
          match,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.match.score - a.match.score);

    return res.json({
      requirement: {
        id: requirement._id,
        cropName: requirement.cropName,
        quantityKg: requirement.quantityKg,
        targetPricePerKg: requirement.targetPricePerKg,
        deliveryLocation: requirement.deliveryLocation,
      },
      count: matches.length,
      matches,
      note: "Recommendations only. Confirm crop quality, transport, and final price directly before a deal.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
