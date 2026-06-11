import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { unauthorized } from "../utils/errors.js";
import { verifyAccessToken } from "../config/jwt.js";

export type AuthUser = {
  id: string;
  role: "PASSENGER" | "DRIVER" | "ADMIN";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) throw unauthorized("Missing access token");

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) throw unauthorized("Invalid access token");
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    next(unauthorized("Invalid or expired access token"));
  }
};
