import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  requestSignupOtp,
  verifySignupOtp
} from "./otp.service.js";

const phoneSchema = z.string().regex(/^\+?[1-9]\d{7,14}$/);
const requestSchema = z.object({ phone: phoneSchema });
const verifySchema = z.object({
  phone: phoneSchema,
  code: z.string().regex(/^\d{6}$/)
});

export async function requestOtp(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { phone } = requestSchema.parse(req.body);
    const result = await requestSignupOtp(phone);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { phone, code } = verifySchema.parse(req.body);
    const result = await verifySignupOtp(phone, code);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
