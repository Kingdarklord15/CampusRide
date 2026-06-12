import { Prisma } from "@prisma/client";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
export const notFoundHandler = (req, _res, next) => {
    next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`, "ROUTE_NOT_FOUND"));
};
export const errorHandler = (error, _req, res, _next) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return res.status(409).json({ success: false, code: "UNIQUE_CONSTRAINT", message: "Duplicate resource" });
    }
    const statusCode = error instanceof AppError ? error.statusCode : error.statusCode ?? 500;
    const code = error instanceof AppError ? error.code : error.code ?? "INTERNAL_ERROR";
    const message = error instanceof Error ? error.message : "Validation Failed";
    const details = error.details;
    if (statusCode >= 500)
        logger.error(message, error);
    return res.status(statusCode).json({ success: false, code, message, details });
};
