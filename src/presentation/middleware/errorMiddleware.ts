import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ConflictError } from "../../shared/errors/ConflictError";
// import { ValidationError } from "@/shared/errors/validationError";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);

  if (error instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      error: {
        message: error.message,
        code: "NOT_FOUND",
      },
    });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({
      success: false,
      error: {
        message: error.message,
        code: "CONFLICT",
      },
    });
    return;
  }

  if (error.stack?.includes("Validation")) {
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: "VALIDATION_ERROR",
      },
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      message: error.message || "Internal server error",
      code: "INTERNAL_ERROR",
    },
  });
  return;
};
