import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next({
        statusCode: 422,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: result.error.flatten()
      });
    }
    req[source] = result.data;
    return next();
  };
