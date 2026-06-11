import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().toLowerCase(),
  phone: z.string().min(8).max(20).optional(),
  password: z.string().min(8).max(128),
  role: z.enum(["PASSENGER", "DRIVER", "ADMIN"]).default("PASSENGER")
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});
