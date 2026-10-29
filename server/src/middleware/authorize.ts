import type { Request, Response, NextFunction } from "express";
import type { AppRole } from "./authenticate.js";

export function authorize(...allowedRoles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({ success: false, message: "Insufficient permissions" });
      return;
    }

    next();
  };
}
