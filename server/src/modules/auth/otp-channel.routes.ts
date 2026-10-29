import { Router } from "express";
import { getAvailableOtpChannels } from "./providers/otp-channels.js";

const router = Router();

router.get("/channels", (_req, res) => {
  res.json({
    success: true,
    data: {
      available: getAvailableOtpChannels(),
      note: "Only configured OTP channels are listed."
    }
  });
});

export default router;
