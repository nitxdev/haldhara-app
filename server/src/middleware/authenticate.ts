import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AppRole = "farmer" | "buyer" | "transporter" | "expert" | "admin";

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; role: AppRole };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(token, secret, {
      issuer: "haldhara-api",
      audience: "haldhara-client"
    });

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    const roles: AppRole[] = ["farmer", "buyer", "transporter", "expert", "admin"];
    if (!roles.includes(payload.role as AppRole)) {
      res.status(401).json({ success: false, message: "Invalid token role" });
      return;
    }

    req.auth = { userId: payload.sub, role: payload.role as AppRole };
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
