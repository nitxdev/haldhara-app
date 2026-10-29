import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/),
  password: z.string().min(12).max(72),
  role: z.enum(["farmer", "buyer", "transporter", "expert"]).default("farmer")
});

export const loginSchema = z.object({
  phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/),
  password: z.string().min(1).max(72)
});
