import { Router } from "express";
import rateLimit from "express-rate-limit";
import { registerController, loginController } from "./auth.controller.js";
import { requestOtp, verifyOtp } from "./otp.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import User from "../../models/User.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/otp/request", authLimiter, requestOtp);
router.post("/otp/verify", authLimiter, verifyOtp);
router.post("/register", authLimiter, registerController);
router.post("/login", authLimiter, loginController);

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

