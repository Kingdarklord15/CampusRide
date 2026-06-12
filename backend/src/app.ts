import "express-async-errors";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { analyticsRoutes } from "./modules/analytics/analytics.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { driversRoutes } from "./modules/drivers/drivers.routes.js";
import { feedbackRoutes } from "./modules/feedback/feedback.routes.js";
import { notificationsRoutes } from "./modules/notifications/notifications.routes.js";
import { passengersRoutes } from "./modules/passengers/passengers.routes.js";
import { paymentsRoutes } from "./modules/payments/payments.routes.js";
import { ratingsRoutes } from "./modules/ratings/ratings.routes.js";
import { ridesRoutes } from "./modules/rides/rides.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

export const app = express();

app.use(helmet());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://172.26.112.1:3000",
            "http://192.168.29.197:3000",
        ],
        credentials: true,
    })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX_REQUESTS }));

app.get("/api/v1/health", (_req, res) => res.json({ success: true, message: "CampusRide API is healthy" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/drivers", driversRoutes);
app.use("/api/v1/passengers", passengersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/rides", ridesRoutes);
app.use("/api/v1/ratings", ratingsRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
