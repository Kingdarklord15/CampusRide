import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.validator.js";

const repo = new AuthRepository(prisma);
const service = new AuthService(repo);
const controller = new AuthController(service);

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), controller.register);
authRoutes.post("/login", validate(loginSchema), controller.login);
authRoutes.post("/refresh", validate(refreshSchema), controller.refresh);
authRoutes.post("/logout", authenticate, controller.logout);
authRoutes.get("/me", authenticate, controller.me);
