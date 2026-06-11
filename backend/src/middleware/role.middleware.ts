import type { NextFunction, Request, Response } from "express";
import { forbidden } from "../utils/errors.js";
import type { AuthUser } from "./auth.middleware.js";

export const authorize =
  (...roles: AuthUser["role"][]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return next(forbidden());
    return next();
  };
