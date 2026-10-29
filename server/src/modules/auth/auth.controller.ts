import type { Request, Response, NextFunction } from "express";
import { login, register } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    res.status(201).json({ success: true, data: await register(input) });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    res.json({ success: true, data: await login(input) });
  } catch (error) {
    next(error);
  }
}
