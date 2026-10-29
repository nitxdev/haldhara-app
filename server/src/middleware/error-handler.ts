import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: error.issues
    });
    return;
  }

  const status = typeof error?.status === "number" ? error.status : 500;

  if (status >= 500) console.error(error);

  res.status(status).json({
    success: false,
    message: status >= 500 ? "Internal server error" : error.message
  });
};

export default errorHandler;
