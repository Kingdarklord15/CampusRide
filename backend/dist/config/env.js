import "dotenv/config";
import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().url().default("postgresql://campusride:campusride_password@localhost:5432/campusride_db?schema=public"),
    JWT_ACCESS_SECRET: z.string().min(32).default("dev_access_secret_replace_in_production"),
    JWT_REFRESH_SECRET: z.string().min(32).default("dev_refresh_secret_replace_in_production"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).default(12),
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100)
});
export const env = envSchema.parse(process.env);
