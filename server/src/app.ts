import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import otpChannelRoutes from "./modules/auth/otp-channel.routes.js";
import buyerRequirementRoutes from "./modules/buyer-requirements/buyer-requirement.routes.js";
import matchingRoutes from "./modules/matching/matching.routes.js";
import offerRoutes from "./modules/offers/offer.routes.js";
import cropListingRoutes from "./modules/crop-listings/crop-listing.routes.js";
import feastRoutes from "./modules/feast/feast.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";

import errorHandler from "./middleware/error-handler.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      const localOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(
        origin || ""
      );

      if (!origin || origin === env.clientUrl || localOrigin) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Haldhara API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", otpChannelRoutes);

app.use("/api/buyer-requirements", buyerRequirementRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/feast", feastRoutes);

app.use("/uploads/crop-photos", express.static("uploads/crop-photos"));
app.use("/api/crops", cropListingRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

export default app;
