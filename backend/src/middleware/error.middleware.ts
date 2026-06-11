import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`, "ROUTE_NOT_FOUND"));
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return res.status(409).json({ success: false, code: "UNIQUE_CONSTRAINT", message: "Duplicate resource" });
  }

  const statusCode = error instanceof AppError ? error.statusCode : (error as { statusCode?: number }).statusCode ?? 500;
  const code = error instanceof AppError ? error.code : (error as { code?: string }).code ?? "INTERNAL_ERROR";
  const message = error instanceof Error ? error.message : "Internal server error";
  const details = (error as { details?: unknown }).details;

  if (statusCode >= 500) logger.error(message, error);
  return res.status(statusCode).json({ success: false, code, message, details });
};
